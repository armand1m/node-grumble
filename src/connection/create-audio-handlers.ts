import { Writable } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import { defaultAudioConfig } from './audio-configuration';

export const createAudioHandlers = (writableStream: Writable) => {
  const playFile = (filename: string) => {
    return ffmpeg(filename)
      .output(writableStream)
      .audioFrequency(defaultAudioConfig.sampleRate)
      .audioChannels(defaultAudioConfig.channels)
      .format('s16le')
      .run();
  };

  return {
    playFile,
  };
};
