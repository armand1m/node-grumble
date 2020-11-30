import { TLSSocket } from 'tls';
import path from 'path';
import protobufjs from 'protobufjs';
import { Messages } from './types';

const protoFilePath = path.join(__dirname, './proto/Mumble.proto');

export const createProtobufInterface = async () => {
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
    messageTypeId: Messages,
    packet: Uint8Array,
    socket: TLSSocket
  ) => {
    const header = Buffer.alloc(6);
    header.writeUInt16BE(messageTypeId, 0);
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
