import { Messages, NodeGrumbleOptions } from './types';
import { TextMessage } from './proto/Mumble';
import { createConnection } from './connection/create-connection';
import { AudioDispatcher } from './connection/create-audio-dispatcher';
import { createAudioHandlers } from './connection/create-audio-handlers';

export const NodeGrumble = {
  create: (options: NodeGrumbleOptions) => {
    return {
      connect: async () => {
        const connection = await createConnection(options);

        const handlers = {
          sendTextMessage: (
            message: string,
            channelId: number = 0
          ) => {
            const textMessage = TextMessage.fromPartial({
              channelId: [channelId],
              message,
            });

            connection.write(
              Messages.TextMessage,
              TextMessage.encode(textMessage)
            );
          },
          playFile: (filename: string) => {
            const dispatcher = new AudioDispatcher(connection, 0);
            const handlers = createAudioHandlers(dispatcher);

            handlers.playFile(filename);
          },
          disconnect: () => {
            connection.disconnect();
          },
          on: connection.events.on.bind(connection.events),
        };

        return handlers;
      },
    };
  },
};
