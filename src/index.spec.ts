import { NodeGrumble, Events } from '.';

describe('node-grumble client integration tests', () => {
  it('should connect', async (done) => {
    jest.setTimeout(30000);

    const grumble = new NodeGrumble({
      url: 'armand1m.dev',
    });

    const connection = await grumble.connect();

    connection.on(Events.Connected, () => {
      console.log('Client is connected.');
    });

    connection.on(Events.Error, (error) => {
      console.error('Client errored: ', error);
    });

    connection.on(Events.Packet, (packet) => {
      console.log(packet);
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
});
