import { Messages, NodeGrumbleOptions } from './types';
import { TextMessage } from './proto/Mumble';
import { createConnection } from './connection/create-connection';

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
          playFile: (filepath: string) => {
            console.log(`triggering play for "${filepath}"`);
          },
          disconnect: connection.disconnect.bind(connection),
          on: connection.events.on.bind(connection.events),
        };

        return handlers;
      },
    };
  },
};
