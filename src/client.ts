import tls, { TLSSocket } from 'tls';
import path from 'path';
import { EventEmitter } from 'events';
import protobufjs from 'protobufjs';
import { NodeGrumbleOptions } from './types';
import { DefaultOptions } from './defaults';

const protoFilePath = path.join(__dirname, './proto/Mumble.proto');

/**
 * Order matters here.
 * Adapted from https://github.com/Gielert/NoodleJS/blob/master/src/Messages.js
 *
 * From official mumble-protocol documentation:
 * https://mumble-protocol.readthedocs.io/en/latest/protocol_stack_tcp.html
 */
export enum Messages {
  Version,
  UDPTunnel,
  Authenticate,
  Ping,
  Reject,
  ServerSync,
  ChannelRemove,
  ChannelState,
  UserRemove,
  UserState,
  BanList,
  TextMessage,
  PermissionDenied,
  ACL,
  QueryUsers,
  CryptSetup,
  ContextActionModify,
  ContextAction,
  UserList,
  VoiceTarget,
  PermissionQuery,
  CodecVersion,
  UserStats,
  RequestBlob,
  ServerConfig,
  SuggestConfig,
}

export enum Events {
  Connected = 'connected',
  Error = 'error',
}

function encodeVersion(major: number, minor: number, patch: number) {
  return (
    ((major & 0xffff) << 16) | ((minor & 0xff) << 8) | (patch & 0xff)
  );
}

const createConnection = async (options: NodeGrumbleOptions) => {
  const eventEmitter = new EventEmitter();
  const protobuf = await createProtobufInterface();
  const finalOptions = {
    ...DefaultOptions,
    ...options,
  };

  const socket = tls.connect(
    finalOptions.port,
    finalOptions.url,
    finalOptions,
    () => {
      eventEmitter.emit(Events.Connected);
      protobuf.writeProto(
        Messages.Version,
        {
          version: encodeVersion(1, 0, 0),
          release: 'node-grumble client',
          os: 'NodeJS',
          os_version: process.version,
        },
        socket
      );

      protobuf.writeProto(
        Messages.Authenticate,
        {
          username: finalOptions.name,
          password: finalOptions.password,
          opus: true,
          tokens: finalOptions.tokens,
        },
        socket
      );
    }
  );

  socket.on('error', (error) => {
    eventEmitter.emit(Events.Error, error);
  });

  socket.on('data', (data) => {
    while (data.length > 6) {
      const typeId = data.readUInt16BE(0);
      const length = data.readUInt32BE(2);

      if (data.length < length + 6) {
        /**
         * TODO: Check git blame for this
         */
        break;
      }

      const buffer = data.slice(6, length + 6);
      data = data.slice(buffer.length + 6);

      if (Messages.UDPTunnel === typeId) {
        /**
         * TODO: Setup Opus encoder first then get the readAudio function from here:
         * https://github.com/Gielert/NoodleJS/blob/master/src/Connection.js#L96
         */
        // this.readAudio(data);
      } else {
        const { type, message } = protobuf.decodeMessage(
          typeId,
          buffer
        );
        eventEmitter.emit(type, message);
      }
    }
  });

  return {
    socket,
    eventEmitter,
  };
};

const createProtobufInterface = async () => {
  const protobuf = await protobufjs.load(protoFilePath);

  const encodeMessage = (type: string, payload: object) => {
    const packet = protobuf.lookupType(`MumbleProto.${type}`);

    if (packet.verify(payload)) {
      throw new Error(`Error verifying payload for packet ${type}`);
    }

    const message = packet.create(payload);
    return packet.encode(message).finish();
  };

  const decodeMessage = (typeId: Messages, buffer: Buffer) => {
    const type = Messages[typeId];
    const packet = protobuf.lookupType(`MumbleProto.${type}`);
    const message = packet.decode(buffer).toJSON();
    return {
      type,
      message,
    };
  };

  const writeProto = async (
    typeId: Messages,
    payload: object,
    socket: TLSSocket
  ) => {
    const packet = encodeMessage(Messages[typeId], payload);

    const header = Buffer.alloc(6);
    header.writeUInt16BE(typeId, 0);
    header.writeUInt32BE(packet.length, 2);

    socket.write(header);
    socket.write(packet);
  };

  return {
    writeProto,
    encodeMessage,
    decodeMessage,
  };
};

export const createClient = async (options: NodeGrumbleOptions) => {
  const { eventEmitter, socket } = await createConnection(options);

  return {
    eventEmitter,
    end: () => {
      socket.end();
    },
  };
};
