import { NodeGrumble, Events } from '.';

describe('node-grumble client integration tests', () => {
  it('should connect', async (done) => {
    jest.setTimeout(30000);
    const grumble = new NodeGrumble({
      url: 'armand1m.dev',
    });

    await grumble.connect();

    grumble.on(Events.Connected, () => {
      console.log('Client is connected.');
    });

    grumble.on(Events.Error, (error) => {
      console.error('Client errored: ', error);
    });

    grumble.on(Events.Packet, (packet) => {
      console.log(packet);
    });

    grumble.on(Events.Close, () => {
      console.log('Connection got closed.');
      clearInterval(textInterval);
      done();
    });

    const textInterval = setInterval(() => {
      grumble.sendTextMessage('oi guilerme tudo bem');
    }, 5000);

    setTimeout(() => {
      grumble.disconnect();
    }, 18000);
  });
});
