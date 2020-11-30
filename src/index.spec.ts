import path from 'path';
import { NodeGrumble, Events, MessageType } from '.';

const testAudioPath = path.resolve(
  __dirname,
  './__fixtures__/test.mp3'
);

/**
 * TODO: Test more error scenarios.
 * TODO: Break the connection test into multiple scenarios.
 */
describe('node-grumble client integration tests', () => {
  it('should connect', async (done) => {
    jest.setTimeout(30000);

    const grumble = NodeGrumble.create({ url: 'armand1m.dev' });
    const connection = await grumble.connect();

    connection.on(Events.Connected, () => {
      console.log('Client is connected.');
    });

    connection.on(Events.Error, (error) => {
      console.error('Client errored:', error);
    });

    connection.on(Events.Packet, (packet) => {
      console.log(packet);
    });

    connection.on(MessageType.UserState, (userState) => {
      console.log(`UserState packet received: ${userState.name}`);
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
      connection.playFile(testAudioPath);
    }, 6000);

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
