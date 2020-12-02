import ffmpeg from 'fluent-ffmpeg';
import { defaultAudioConfig } from './audio-configuration';
import { AudioDispatcher } from './create-audio-dispatcher';
import { Connection } from './create-connection';

export const createAudioHandlers = (connection: Connection) => {
  const playFile = (
    filename: string,
    volume: number = 1,
    channelId: number = 0
  ) => {
    const dispatcher = new AudioDispatcher(connection, channelId);

    return new Promise<void>((resolve, reject) => {
      ffmpeg(filename)
        .output(dispatcher)
        .audioFilters(`volume=${volume}`)
        .audioFrequency(defaultAudioConfig.sampleRate)
        .audioChannels(defaultAudioConfig.channels)
        .on('end', () => {
          dispatcher.close();
          resolve();
        })
        .on('error', reject)
        .format(defaultAudioConfig.format)
        .run();
    });
  };

  return {
    playFile,
  };
};
