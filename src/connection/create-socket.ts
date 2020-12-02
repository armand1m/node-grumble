import tls from 'tls';
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
import { TypedEventEmitter } from '../structures/EventEmitter';
import { createAudioInterface } from './create-audio-interface';

export const createSocket = (
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
     * as they're decoded.
     *
     * The `data` buffer is constantly mutated from the Mumble Server,
     * and from this event handler as it cleans the data buffer.
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
        if (process.env.DEBUG_UDP) {
          console.log('UDPTunnel message received:', buffer);
        }

        /**
         * TODO: Implement audio processing.
         *
         * Implementation in NoodleJS:
         * https://github.com/Gielert/NoodleJS/blob/master/src/Connection.js#L96
         */
        // readAudio(data);
        break;
      }

      const packet = decodeMessage(typeId, buffer);
      events.emit(Events.Packet, packet);
      events.emit(packet.type, packet.message);
    }
  });

  const write = (type: Messages, writer: Writer) => {
    return writePacketToSocket(type, writer.finish(), socket);
  };

  const disconnect = () => socket.end();

  const { setBitrate, writeAudio } = createAudioInterface(socket);

  return { events, write, disconnect, writeAudio, setBitrate };
};
