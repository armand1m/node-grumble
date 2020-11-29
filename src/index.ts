import { createClient, Events } from './client';

const main = async () => {
  const client = await createClient({
    url: 'armand1m.dev',
    port: 64738,
  });

  client.eventEmitter.on(Events.Connected, () => {
    console.log('Client is connected.');
  });

  client.eventEmitter.on(Events.Error, (error) => {
    console.error('Client errored: ', error);
  });
};

main();
