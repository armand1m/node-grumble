import { TLSSocket } from 'tls';
import path from 'path';
import protobufjs from 'protobufjs';
import { Messages, Packet } from '../types';

const protoFilePath = path.join(__dirname, './Mumble.proto');

export const encodeVersion = (
  major: number,
  minor: number,
  patch: number
) => {
  return (
    ((major & 0xffff) << 16) | ((minor & 0xff) << 8) | (patch & 0xff)
  );
};

export const writePacketToSocket = (
  messageTypeId: Messages,
  packet: Uint8Array,
  socket: TLSSocket
) => {
  socket.write(createPacketHeader(messageTypeId, packet.length));
  socket.write(packet);
};

export const createPacketHeader = (
  messageTypeId: Messages,
  packetLength: number
) => {
  const header = Buffer.alloc(6);
  header.writeUInt16BE(messageTypeId, 0);
  header.writeUInt32BE(packetLength, 2);
  return header;
};

export const createMumbleProtobufDecoder = async () => {
  const protobuf = await protobufjs.load(protoFilePath);

  const decodeMessage = (typeId: Messages, buffer: Buffer) => {
    const type = Messages[typeId];
    const packet = protobuf.lookupType(`MumbleProto.${type}`);
    const message = packet.decode(buffer).toJSON();

    return {
      type,
      message,
    } as Packet;
  };

  return {
    decodeMessage,
  };
};
