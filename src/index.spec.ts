import { NodeGrumble, Events, MessageType } from '.';

/**
 * TODO: Test error scenarios.
 */

describe('node-grumble client integration tests', () => {
  it('should connect', async (done) => {
    jest.setTimeout(30000);

    const grumble = NodeGrumble.create({ url: 'intruder.network' });
    const connection = await grumble.connect();

    connection.on(Events.Connected, () => {
      console.log('Client is connected.');
    });

    connection.on(Events.Error, (error) => {
      console.error('Client errored:', error);
    });

    connection.on(Events.Packet, (packet) => {
      console.log(packet);

      if (packet.type === MessageType.UserState) {
        console.log(
          `UserState packet received: ${packet.message.name}`
        );
      }
    });

    connection.on(Events.Close, () => {
      console.log('Connection got closed.');
      clearInterval(textInterval);
      done();
    });

    const textInterval = setInterval(() => {
      connection.sendTextMessage('oi guilerme tudo bem');
    }, 5000);

    setTimeout(() => {
      connection.disconnect();
    }, 18000);
  });

  it('should fail to connect', () => {
    expect(() => {
      return NodeGrumble.create({
        url: 'nonexistant.server',
      }).connect();
    }).rejects.toThrow();
  });
});
