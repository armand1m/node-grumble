import { CompleteGrumbleOptions } from './types';

export const Audio = {
  sampleRate: 48000,
  channels: 1,
  bitDepth: 16,
  frameSize: 480,
  frameLength: 10,
};

export const Network = {
  framesPerPacket: 1,
  quality: 40000,
};

export const DefaultOptions: CompleteGrumbleOptions = {
  url: 'localhost',
  port: 64738,
  rejectUnauthorized: false,
  name: 'node-grumble',
  password: '',
  tokens: [],
};
