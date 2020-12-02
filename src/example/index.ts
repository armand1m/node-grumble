import { NodeGrumble, Events, MessageType } from '../';

const main = async () => {
  const connection = await NodeGrumble.connect({
    url: String(process.env.MUMBLE_SERVER_URL),
  });

  connection.on(Events.Connected, () => {
    console.log('Client is connected.');
  });

  connection.on(Events.Error, (error) => {
    console.error('Client errored: ', error);
  });

  connection.on(Events.Packet, (packet) => {
    if (packet.type === MessageType.UserState) {
      console.log('user state changes received');
      console.log(packet.message.name);
    }
  });

  connection.on(MessageType.ChannelState, (channelState) => {
    console.log('Received Channel State event:', channelState);
  });

  connection.on(Events.Close, () => {
    console.log('Connection got closed.');
  });

  process.on('SIGINT', function () {
    connection.disconnect();
  });
};

main();
