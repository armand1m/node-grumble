import ffmpeg from 'fluent-ffmpeg';
import { defaultAudioConfig } from './audio-configuration';
import { AudioDispatcher } from './create-audio-dispatcher';
import { Connection } from './create-connection';

export const createAudioHandlers = (connection: Connection) => {
  const playFile = (filename: string, volume: number = 1) => {
    const dispatcher = new AudioDispatcher(connection, 0);
    return ffmpeg(filename)
      .output(dispatcher)
      .audioFilters(`volume=${volume}`)
      .audioFrequency(defaultAudioConfig.sampleRate)
      .audioChannels(defaultAudioConfig.channels)
      .on('end', () => {
        /**
         * TODO: Check for a better way than a timeout.
         * It works well enough, though.
         */
        setTimeout(() => {
          dispatcher.close();
        }, 1000);
      })
      .format(defaultAudioConfig.format)
      .run();
  };

  return {
    playFile,
  };
};
