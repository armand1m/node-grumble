import { NodeGrumble, Events } from '../';

const main = async () => {
  const grumble = NodeGrumble.create({
    url: String(process.env.MUMBLE_SERVER_URL),
  });

  grumble.on(Events.Connected, () => {
    console.log('Client is connected.');
  });

  grumble.on(Events.Error, (error) => {
    console.error('Client errored: ', error);
  });

  // grumble.on(Events.Packet, (packet) => {
  //   if (packet.type === MessageType.UserState) {
  //     console.log('user state changes received');
  //     console.log(packet.message.name);
  //   }
  // });

  // grumble.on(MessageType.ChannelState, (channelState) => {
  //   console.log('Received Channel State event:', channelState);
  // });

  grumble.on(Events.Close, () => {
    console.log('Connection got closed.');
  });

  grumble.state.users.subscribe((users) => {
    console.log('users state change:', users);
  });
  const connection = await grumble.connect();

  setTimeout(() => {
    connection.mute();
  }, 2000);

  process.on('SIGINT', () => {
    connection.disconnect();
  });
};

main();
