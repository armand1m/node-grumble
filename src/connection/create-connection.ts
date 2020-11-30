import {
  CompleteGrumbleOptions,
  NodeGrumbleOptions,
  Events,
  Messages,
  UnwrapPromise,
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

export const createConnection = async (
  options: NodeGrumbleOptions
) => {
  const completeOptions: CompleteGrumbleOptions = {
    ...defaultOptions,
    ...options,
  };

  const {
    events,
    write,
    writeAudio,
    disconnect,
  } = await createSocket(completeOptions);

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
  });

  events.on(Events.Close, () => {
    if (pingInterval) {
      clearInterval(pingInterval);
    }
  });

  return {
    write,
    writeAudio,
    events,
    disconnect,
  };
};
