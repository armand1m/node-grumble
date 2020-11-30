import {
  Events,
  Messages,
  Connection,
  NodeGrumbleOptions,
} from './types';
import { TextMessage } from './generated/Mumble';
import { createConnection } from './connection/create-connection';

class NodeGrumbleConnection {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  disconnect() {
    this.connection.disconnect();
  }

  on(event: Events, callback: (data?: any) => void) {
    this.connection.events.on(event, callback);
  }

  sendTextMessage(message: string, channelId: number = 0) {
    const textMessage = TextMessage.fromPartial({
      channelId: [channelId],
      message,
    });

    this.connection.write(
      Messages.TextMessage,
      TextMessage.encode(textMessage)
    );
  }
}

export class NodeGrumble {
  private options: NodeGrumbleOptions;

  constructor(options: NodeGrumbleOptions) {
    this.options = options;
  }

  async connect() {
    const connection = await createConnection(this.options);
    return new NodeGrumbleConnection(connection);
  }
}
