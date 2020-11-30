import { NodeGrumble, Events, MessageType } from '../src';

const main = async () => {
  const grumble = NodeGrumble.create({
    url: 'intruder.network',
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

    if (packet.type === MessageType.UserState) {
      console.log("user state changes received");
      console.log(packet.message.name)
    }
  });

  connection.on(Events.Close, () => {
    console.log('Connection got closed.');
  });

  process.on('SIGINT', function() {
    connection.disconnect();
  });
};

main();
