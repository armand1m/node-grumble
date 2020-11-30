import path from 'path';
import { NodeGrumble, Events, MessageType } from '.';

const testAudioPath = path.resolve(
  __dirname,
  './__fixtures__/test.webm'
);

/**
 * TODO: Test more error scenarios.
 * TODO: Break the connection test into multiple scenarios.
 */
describe('node-grumble client integration tests', () => {
  it('should connect', async (done) => {
    jest.setTimeout(30000);

    const connection = await NodeGrumble.connect({
      url: 'armand1m.dev',
    });

    connection.on(Events.Connected, () => {
      console.log('Client is connected. Triggering text and audio.');
      connection.sendTextMessage('oi guilerme tudo bem');
      connection.playFile(testAudioPath, 0.2);

      setTimeout(() => {
        connection.playFile(testAudioPath, 0.4);
      }, 3000);

      setTimeout(() => {
        connection.playFile(testAudioPath, 0.6);
      }, 6000);

      setTimeout(() => {
        connection.playFile(testAudioPath);
      }, 9000);
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
      done();
    });

    setTimeout(() => {
      connection.disconnect();
    }, 20000);
  });

  // it('should fail to connect', () => {
  //   expect(() => {
  //     return NodeGrumble.create({
  //       url: 'nonexistant.server',
  //     }).connect();
  //   }).rejects.toThrow();
  // });
});
