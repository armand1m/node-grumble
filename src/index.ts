import { Events } from './types';
import { createConnection } from './client';

const main = async () => {
  const { eventEmitter } = await createConnection({
    url: 'armand1m.dev',
  });

  eventEmitter.on(Events.Connected, () => {
    console.log('Client is connected.');
  });

  eventEmitter.on(Events.Error, (error) => {
    console.error('Client errored: ', error);
  });
};

main();
