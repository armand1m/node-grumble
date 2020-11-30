import { Messages, NodeGrumbleOptions } from './types';
import { TextMessage } from './proto/Mumble';
import { createConnection } from './connection/create-connection';
import { createAudioHandlers } from './connection/create-audio-handlers';

export const NodeGrumble = {
  /**
   * ## `NodeGrumble.connect()`
   *
   * Connects with the Mumble server and returns
   * handlers to interact with the connection.
   */
  connect: async (options: NodeGrumbleOptions) => {
    const connection = await createConnection(options);
    const audioHandlers = createAudioHandlers(connection);

    const handlers = {
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
      on: connection.events.on.bind(connection.events),
      /**
       * ## `disconnect()`;
       *
       * Disconnects the client from the server.
       * Terminates all interfaces and connections.
       */
      disconnect: () => connection.disconnect(),
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
      /**
       * ## `playFile(filename: string, volume: number = 1)`
       *
       * Plays a file in the current channel.
       * Volume can be controlled with float numbers between 0 and 1.
       */
      playFile: (filename: string, volume: number = 1) => {
        audioHandlers.playFile(filename, volume);
      },
    };

    return handlers;
  },
};
