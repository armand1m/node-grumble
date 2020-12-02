# node-grumble

`node-grumble` is a Node.js client for Mumble written in Typescript. 
The name is inspired by the Mumble Server implementation in Go called [Grumble](https://github.com/mumble-voip/grumble/).

This package is a rewrite from scratch and some refactors from code copied from the NoodleJS package, which was also an inspiration for this project.

It is currently being developed, so many features are still missing and the API might change a lot. Expect breaking changes if using lower than 1.0.0

## Features

 - [x] Type-safe Event Driven Programming
    - [x] Typed Connection, Close and Error events
    - [x] Typed protobuf events
 - User Features
    - [ ] Change name
 - Channel Features
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
    - [ ] Real time list of speaking users

## Usage

```sh
yarn add mumbo
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

## Why?

I communicate with my friends in Brazil through Mumble for voice chat. Even more in 2020 since we're mostly home.
We used Discord in the past but it disappointed us quite a lot back then, so @guilhermelimak decided to deploy a mumble server for us to use instead.

We also create some bots to use so it enhances our experience using mumble.

We used the NoodleJS library before, but we've got used to write Typescript applications for the last 3 years in our jobs, so managing voice activity and chat activity without any type checking was a huge pain.
There are some `// @ts-ignore`'s around our bot servers together with some code that can potentially fail.

I thought about contributing back to NoodleJS, but a complete typescript rewrite sounded like too much for a first contribution for me.
I also don't trust that much packages that offer type definitions but are written in JS, as the type definitions often mismatch the actual implementation, requiring to use things such as `tsd` to make sure it is correct.The volume controls when playing audio with NoodleJS didn't seem to work (at the time of this writing).

Besides all of that, I wanted to learn a bit more about the UDP protocol, Protocol Buffers and Audio Streaming. Unfortunately, my work rarely exposes me to this type of challenges.
`node-grumble` is my attempt on learning a bit more about the above, while also bringing a better development experience for me and my friends while we use Mumble.

## Credits

- All the NoodleJS developers, it wouldn't happen without much of the code I ~~stole~~ borrowed from them.
- Rafael Martins, for bootstraping one of the bots that motivated me to end up writing this.
- [Guilherme Lima](https://github.com/guilhermelimak), for accepting me breaking his murmur instance with this and for exposing me to Mumble.
- Armando Magalhaes (me), for spending my time writing and testing all of this.