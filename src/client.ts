import {
  Events,
  Messages,
  Connection,
  NodeGrumbleOptions,
} from './types';
import { TextMessage } from './generated/Mumble';
import { createConnection } from './connection/create-connection';

export class NodeGrumble {
  private options: NodeGrumbleOptions;
  private connection: Connection | undefined;

  constructor(options: NodeGrumbleOptions) {
    this.options = options;
  }

  async connect() {
    this.connection = await createConnection(this.options);
  }

  disconnect() {
    if (!this.connection) {
      return;
    }

    this.connection.disconnect();
    this.connection = undefined;
  }

  on(event: Events, callback: (data?: any) => void) {
    if (!this.connection) {
      throw new TypeError('No connection established.');
    }

    this.connection.events.on(event, callback);
  }

  sendTextMessage(message: string, channelId: number = 0) {
    if (!this.connection) {
      throw new TypeError('No connection established.');
    }

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
