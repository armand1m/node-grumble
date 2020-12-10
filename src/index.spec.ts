import path from 'path';
import { NodeGrumble, Events, MessageType } from '.';

const testAudioPath = path.resolve(
  __dirname,
  './__fixtures__/test.webm'
);

const wait = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

/**
 * TODO: Test more error scenarios.
 * TODO: Break the connection test into multiple scenarios.
 */
describe('node-grumble client integration tests', () => {
  it('should connect', async (done) => {
    jest.setTimeout(30000);

    const grumble = NodeGrumble.create({
      url: String(process.env.MUMBLE_SERVER_URL),
    });

    grumble.on(Events.Error, (error) => {
      console.error('Client errored:', error);
    });

    grumble.on(Events.Packet, (packet) => {
      console.log(packet);
    });

    grumble.on(MessageType.UserState, (userState) => {
      console.log(`UserState packet received: ${userState.name}`);
    });

    grumble.on(Events.Close, () => {
      console.log('Connection got closed.');
      done();
    });

    const connection = await grumble.connect();

    connection.sendTextMessage('message-test');

    await connection.playFile(testAudioPath, 0.2);
    await connection.playFile(testAudioPath);

    connection.mute();
    await wait(2000);
    connection.unmute();
    await wait(2000);

    setTimeout(() => {
      connection.disconnect();
    }, 2000);
  });

  it('should fail to connect', async () => {
    expect.assertions(1);

    await expect(
      NodeGrumble.create({ url: 'nonexistant.server' }).connect()
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should connect and listen to state changes', async (done) => {
    jest.setTimeout(30000);

    const receivedData = jest.fn();
    const grumble = NodeGrumble.create({
      url: String(process.env.MUMBLE_SERVER_URL),
    });

    grumble.on(Events.Close, () => {
      expect(receivedData).toHaveBeenCalled();
      done();
    });

    grumble.state.users.subscribe(receivedData);
    grumble.state.channels.subscribe(receivedData);

    const connection = await grumble.connect();

    setTimeout(() => {
      connection.disconnect();
    }, 5000);
  });
});
