import { NodeGrumble, Events } from '../src';

const main = async () => {
  const grumble = new NodeGrumble({
    url: 'intruder.network',
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
  });

  // setInterval(() => {
  //   grumble.sendTextMessage('oi guilerme tudo bem');
  // }, 5000);
};

main();
