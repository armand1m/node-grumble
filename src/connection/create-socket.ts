import tls from 'tls';
import { EventEmitter } from 'events';
import { Writer } from 'protobufjs';
import { Events, Messages, CompleteGrumbleOptions } from '../types';
import {
  writePacketToSocket,
  createMumbleProtobufDecoder,
} from '../protobuf';

export const createSocket = async (
  finalOptions: CompleteGrumbleOptions
) => {
  const events = new EventEmitter();
  const { decodeMessage } = await createMumbleProtobufDecoder();

  const socket = tls.connect(
    finalOptions.port,
    finalOptions.url,
    finalOptions,
    () => events.emit(Events.Connected)
  );

  socket.on('close', () => {
    events.emit(Events.Close);
  });

  socket.on('error', (error) => {
    events.emit(Events.Error, error);
  });

  socket.on('data', (data) => {
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

      const { type, message } = decodeMessage(typeId, buffer);

      events.emit('packet', { type, message });
      events.emit(type, message);
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
