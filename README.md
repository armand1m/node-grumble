# node-grumble

`node-grumble` is a Node.js client for Mumble and Grumble written in Typescript.

This package is a total rewrite from the NoodleJS library with a few enhancements:

 - [x] Type-safe Event Driven Programming
 - [ ] Bot User Features
    - [ ] Change name
 - [ ] Channel Features
    - [ ] Set Channel
    - [ ] Listen multiple channels
    - [ ] Observe channel changes
 - User Features
    - [ ] List users in the server
    - [ ] List users in a channel
    - [ ] Observe user changes
 - Text Features
    - [x] Send text to a Channel
    - [ ] Send text to a User
 - Voice Features
    - [x] Play audio file
    - [x] Volume control
    - [ ] Process incoming voice

## Usage

```sh
yarn add node-grumble
```

```ts
import { NodeGrumble, Events, MessageType } from 'node-grumble';

const connection = await NodeGrumble.connect({
  url: 'mumble-server.endpoint.dev',
});

connection.on(Events.Connected, () => {
  console.log('Client is connected. Triggering text and audio.');
  connection.sendTextMessage('Hi! I am logged in.');
  connection.playFile('./some-audio-file.mp3', 0.5);
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
});
```