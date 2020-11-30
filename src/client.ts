import { Messages, NodeGrumbleOptions } from './types';
import { TextMessage } from './proto/Mumble';
import { createConnection } from './connection/create-connection';
import { AudioDispatcher } from './connection/create-audio-dispatcher';

export const NodeGrumble = {
  create: (options: NodeGrumbleOptions) => {
    return {
      connect: async () => {
        const connection = await createConnection(options);
        const audioDispatcher = new AudioDispatcher(connection, 0);

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
          playFile: (filepath: string) => {
            audioDispatcher.playFile(filepath);
          },
          disconnect: () => {
            connection.disconnect();
            audioDispatcher.close();
          },
          on: connection.events.on.bind(connection.events),
        };

        return handlers;
      },
    };
  },
};
