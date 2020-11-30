import tls from 'tls';
import { EventEmitter } from 'events';
import {
  CompleteGrumbleOptions,
  NodeGrumbleOptions,
  Events,
  Messages,
} from './types';
import { DefaultOptions } from './defaults';
import { Authenticate, Ping, Version } from './generated/Mumble';
import { createProtobufInterface } from './protobuf';

function encodeVersion(major: number, minor: number, patch: number) {
  return (
    ((major & 0xffff) << 16) | ((minor & 0xff) << 8) | (patch & 0xff)
  );
}

export const createConnection = async (
  options: NodeGrumbleOptions
) => {
  const eventEmitter = new EventEmitter();
  const protobuf = await createProtobufInterface();
  const finalOptions: CompleteGrumbleOptions = {
    ...DefaultOptions,
    ...options,
  };

  let pingRoutineInterval: NodeJS.Timeout;

  eventEmitter.on(Events.Connected, async () => {
    const version = Version.encode({
      version: encodeVersion(0, 0, 0),
      release: 'node-grumble',
      os: 'NodeJS',
      osVersion: process.version,
    });

    const authenticate = Authenticate.encode({
      username: finalOptions.name,
      password: finalOptions.password,
      opus: true,
      tokens: finalOptions.tokens,
      celtVersions: [],
    });

    await protobuf.writeProto(
      Messages.Version,
      version.finish(),
      socket
    );

    await protobuf.writeProto(
      Messages.Authenticate,
      authenticate.finish(),
      socket
    );

    pingRoutineInterval = setInterval(() => {
      const ping = Ping.fromPartial({
        timestamp: Date.now(),
      });

      protobuf.writeProto(
        Messages.Ping,
        Ping.encode(ping).finish(),
        socket
      );
    }, 15000);
  });

  const socket = tls.connect(
    finalOptions.port,
    finalOptions.url,
    finalOptions,
    async () => {
      eventEmitter.emit(Events.Connected);
    }
  );

  socket.on('close', () => {
    if (pingRoutineInterval) {
      clearInterval(pingRoutineInterval);
    }
  });

  socket.on('error', (error) => {
    eventEmitter.emit(Events.Error, error);
  });

  socket.on('data', (data) => {
    while (data.length > 6) {
      const typeId = data.readUInt16BE(0);
      const length = data.readUInt32BE(2);
      const totalLength = length + 6;

      if (data.length < totalLength) {
        console.warn(
          `Socket Data should be of length "${totalLength}" but it has "${data.length}"`
        );
        console.warn(`Message Type Id: ${typeId}`);
        break;
      }

      /**
       * Extracts the message buffer out of the data stream
       * and clears out the data stream to make room
       * for the next message.
       */
      const buffer = data.slice(6, totalLength);
      data = data.slice(buffer.length + 6);

      if (typeId === Messages.UDPTunnel) {
        /**
         * TODO: Setup Opus encoder first then get the readAudio function from here:
         * https://github.com/Gielert/NoodleJS/blob/master/src/Connection.js#L96
         */
        // this.readAudio(data);
        break;
      }

      const { type, message } = protobuf.decodeMessage(
        typeId,
        buffer
      );

      console.log(
        `received: ${type} ${JSON.stringify(message, null, 2)}`
      );
      eventEmitter.emit(type, message);
    }
  });

  return {
    socket,
    eventEmitter,
  };
};
