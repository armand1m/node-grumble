import {
  CompleteGrumbleOptions,
  NodeGrumbleOptions,
  Events,
  Messages,
  UnwrapPromise,
  MessageType,
} from '../types';
import { Authenticate, Ping, Version } from '../proto/Mumble';
import { encodeVersion } from '../proto/protobuf';
import { createSocket } from './create-socket';

const defaultOptions: CompleteGrumbleOptions = {
  url: 'localhost',
  port: 64738,
  rejectUnauthorized: false,
  name: 'node-grumble',
  password: '',
  tokens: [],
};

export type Connection = UnwrapPromise<
  ReturnType<typeof createConnection>
>;

const defaultNetworkConfig = {
  framesPerPacket: 1,
  quality: 40000,
};

const calculateNetworkBandwidth = (
  bitrate: number,
  frames: number
) => {
  let overhead = 20 + 8 + 4 + 1 + 2 + frames + 12;
  overhead *= 800 / frames;
  return overhead + bitrate;
};

const calculateBitrate = (maxBandwidth: number) => {
  const frames = defaultNetworkConfig.framesPerPacket;
  let bitrate = defaultNetworkConfig.quality;

  if (calculateNetworkBandwidth(bitrate, frames) > maxBandwidth) {
    while (
      bitrate > 8000 &&
      calculateNetworkBandwidth(bitrate, frames) > maxBandwidth
    ) {
      bitrate -= 1000;
    }
  }

  return bitrate;
};

type Socket = ReturnType<typeof createSocket>;
type ConnectionHandlers = Pick<
  Socket,
  'disconnect' | 'events' | 'write' | 'writeAudio'
>;

export const createConnection = async (
  options: NodeGrumbleOptions
) => {
  return new Promise<ConnectionHandlers>((resolve, reject) => {
    const completeOptions: CompleteGrumbleOptions = {
      ...defaultOptions,
      ...options,
    };

    const {
      events,
      write,
      writeAudio,
      setBitrate,
      disconnect,
    } = createSocket(completeOptions);

    let pingInterval: NodeJS.Timeout | undefined;

    events.on(Events.Connected, async () => {
      const version = Version.encode({
        version: encodeVersion(0, 0, 0),
        release: 'node-grumble',
        os: 'NodeJS',
        osVersion: process.version,
      });

      const authenticate = Authenticate.fromPartial({
        username: completeOptions.name,
        password: completeOptions.password,
        tokens: completeOptions.tokens,
        opus: true,
      });

      write(Messages.Version, version);
      write(Messages.Authenticate, Authenticate.encode(authenticate));

      pingInterval = setInterval(() => {
        const ping = Ping.fromPartial({
          timestamp: Date.now(),
        });

        write(Messages.Ping, Ping.encode(ping));
      }, 15000);

      events.on(MessageType.ServerSync, ({ maxBandwidth }) => {
        setBitrate(calculateBitrate(maxBandwidth));

        resolve({
          write,
          writeAudio,
          events,
          disconnect,
        });
      });
    });

    events.on(Events.Close, () => {
      if (pingInterval) {
        clearInterval(pingInterval);
      }
    });

    events.on(Events.Error, (error) => {
      reject(error);
    });
  });
};
