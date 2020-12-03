import {
  EventMap,
  MessageEventMap,
  Messages,
  NodeGrumbleOptions,
} from './types';
import { TextMessage, UserState } from './proto/Mumble';
import { createConnection } from './connection/create-connection';
import { createAudioHandlers } from './connection/create-audio-handlers';
import { TypedEventEmitter } from './structures/EventEmitter';

const connect = async (
  options: NodeGrumbleOptions,
  events: TypedEventEmitter<MessageEventMap & EventMap>
) => {
  const connection = await createConnection(options, events);
  const audioHandlers = createAudioHandlers(connection);

  const handlers = {
    /**
     * ## `disconnect()`;
     *
     * Disconnects the client from the server.
     * Terminates all interfaces and connections.
     */
    disconnect: connection.disconnect.bind(connection),
    /**
     * ## `playFile(filename: string, volume: number = 1)`
     *
     * Plays a file in the current channel.
     * Volume can be controlled with float numbers between 0 and 1.
     */
    playFile: audioHandlers.playFile.bind(audioHandlers),
    /**
     * ## `sendTextMessage(message: string, channelId: number = 0)`
     *
     * Sends a text message to the specified channel.
     */
    sendTextMessage: (message: string, channelId: number = 0) => {
      const textMessage = TextMessage.fromPartial({
        channelId: [channelId],
        message,
      });

      connection.write(
        Messages.TextMessage,
        TextMessage.encode(textMessage)
      );
    },
  };

  return handlers;
};

export const NodeGrumble = {
  /**
   * Creates a NodeGrumble instance.
   *
   * Will create an event listener so you can setup
   * your listeners to events that matter to you before
   * creating a connection.
   *
   * Everything else that depends on a working connection
   * will be available as a result of the `connect` function.
   */
  create: (options: NodeGrumbleOptions) => {
    const events = new TypedEventEmitter<
      MessageEventMap & EventMap
    >();

    return {
      /**
       * ## `on(eventName, callback)`
       *
       * Sets event listeners for specific events
       * coming from the Mumble Server.
       *
       * Allows to listen either for the client setup
       * events or for serialized protobuf events directly
       * from Mumble server.
       */
      on: events.on.bind(events),
      /**
       * ## `NodeGrumble.connect()`
       *
       * Connects with the Mumble server and returns
       * handlers to interact with the connection.
       */
      connect: () => connect(options, events),
    };
  },
};
