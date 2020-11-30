import tls from 'tls';
import { TypedEventEmitter } from '../structures/EventEmitter';
import { Writer } from 'protobufjs';
import {
  Events,
  Messages,
  MessageEventMap,
  CompleteGrumbleOptions,
  EventMap,
} from '../types';
import {
  writePacketToSocket,
  createMumbleProtobufDecoder,
} from '../proto/protobuf';

export const createSocket = async (
  finalOptions: CompleteGrumbleOptions
) => {
  const events = new TypedEventEmitter<MessageEventMap & EventMap>();

  const socket = tls.connect(
    finalOptions.port,
    finalOptions.url,
    finalOptions,
    () => events.emit(Events.Connected, undefined)
  );

  socket.on('close', () => {
    events.emit(Events.Close, undefined);
  });

  socket.on('error', (error: Error) => {
    events.emit(Events.Error, error);
  });

  socket.on('data', async (data: Buffer) => {
    const { decodeMessage } = await createMumbleProtobufDecoder();

    /**
     * Data Ingestion Loop.
     *
     * Keeps reading data from the socket and emitting events
     * as they're processed and decoded.
     */
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
       * then cleans it to make room for the next message.
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

      const packet = decodeMessage(typeId, buffer);

      events.emit(Events.Packet, packet);
      events.emit(packet.type, packet.message);
    }
  });

  const write = (type: Messages, writer: Writer) => {
    writePacketToSocket(type, writer.finish(), socket);
  };

  const disconnect = () => {
    socket.end();
  };

  return { events, write, disconnect };
};
