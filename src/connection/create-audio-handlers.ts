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
    return new Promise<void>((resolve, reject) => {
      const dispatcher = new AudioDispatcher(connection, channelId);
      dispatcher.once('finish', () => {
        dispatcher.close();
        resolve();
      });

      ffmpeg(filename)
        .output(dispatcher)
        .audioFilters(`volume=${volume}`)
        .audioFrequency(defaultAudioConfig.sampleRate)
        .audioChannels(defaultAudioConfig.channels)
        .on('error', reject)
        .format(defaultAudioConfig.format)
        .run();
    });
  };

  return {
    playFile,
  };
};
