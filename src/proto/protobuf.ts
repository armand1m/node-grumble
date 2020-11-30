import { TLSSocket } from 'tls';
import path from 'path';
import protobufjs from 'protobufjs';
import { Messages, MessageType, Packet } from '../types';

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
  const header = Buffer.alloc(6);
  header.writeUInt16BE(messageTypeId, 0);
  header.writeUInt32BE(packet.length, 2);

  socket.write(header);
  socket.write(packet);
};

export const createMumbleProtobufDecoder = async () => {
  const protobuf = await protobufjs.load(protoFilePath);

  /**
   * TODO: Consider removing encodeMessage as it is not being used.
   * Try to find a way to use the generated libraries instead of this, since they do the encoding.
   */
  const encodeMessage = (type: MessageType, payload: object) => {
    const packet = protobuf.lookupType(`MumbleProto.${type}`);

    if (packet.verify(payload)) {
      throw new Error(`Error verifying payload for packet ${type}`);
    }

    const message = packet.create(payload);
    return packet.encode(message).finish();
  };

  /**
   * TODO: Try to infer the packet types and make ts types compliant
   */
  const decodeMessage = (typeId: Messages, buffer: Buffer) => {
    const type = Messages[typeId] as MessageType;
    const packet = protobuf.lookupType(`MumbleProto.${type}`);
    const message = packet.decode(buffer).toJSON();
    return {
      type,
      message,
    } as Packet;
  };

  return {
    encodeMessage,
    decodeMessage,
  };
};
