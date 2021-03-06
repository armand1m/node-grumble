import { EventEmitter } from 'events';
import { Writable as WritableStream } from 'stream';
import { defaultAudioConfig } from './audio-configuration';
import { Connection } from './create-connection';

const createFrameBuffer = () => {
  return Buffer.alloc(defaultAudioConfig.frameSize * 2);
};

/**
 * AudioDispatcher is a Writable Stream with some
 * additional behavior to interact with the connection.
 *
 * Writing in the AudioDispatcher writes directly into the connection socket.
 *
 * TODO: Cleanup this class a bit more. A lot of cleanup
 * was already made but there is still some room for improvement.
 */
export class AudioDispatcher extends WritableStream {
  private whisperId: number;
  private connection: Connection;
  private processObserver: EventEmitter;
  private processInterval: NodeJS.Timeout | undefined | null;
  private frameQueue: Buffer[];
  private lastWrite: number;
  private lastFrame: Buffer;
  private lastFrameWritten: number;
  private voiceSequence: number;

  constructor(connection: Connection, voiceTarget: number) {
    super();
    this.whisperId = voiceTarget;
    this.connection = connection;
    this.processObserver = new EventEmitter();
    this.frameQueue = [];
    this.lastWrite = Date.now();
    this.lastFrame = createFrameBuffer();
    this.lastFrameWritten = 0;
    this.voiceSequence = 0;
    this.processInterval = setInterval(
      this._processAudioBuffer.bind(this),
      defaultAudioConfig.frameLength
    );
  }

  close() {
    if (this.processInterval) {
      clearInterval(this.processInterval);
    }

    this.processInterval = null;
    this.frameQueue = [];
    this.lastFrame = createFrameBuffer();
    this.lastFrameWritten = 0;
    this.voiceSequence = 0;
  }

  _processAudioBuffer() {
    while (
      this.lastWrite + defaultAudioConfig.frameLength <
      Date.now()
    ) {
      if (this.frameQueue.length > 0) {
        const frame = this.frameQueue.shift();

        if (!frame) {
          break;
        }

        this.voiceSequence += this.connection.writeAudio(
          frame,
          this.whisperId,
          this.voiceSequence,
          this.frameQueue.length < 1
        );

        this.processObserver.emit('written');
      }

      this.lastWrite += defaultAudioConfig.frameLength;
    }
  }

  /**
   * This is an override on the stream.Writable class.
   */
  _write(chunk: Buffer, encoding: BufferEncoding, cb: () => void) {
    while (true) {
      if (this.frameQueue.length >= defaultAudioConfig.frameLength) {
        this.processObserver.once('written', () => {
          this._write(chunk, encoding, cb);
        });
        return;
      }

      const writtenBefore = this.lastFrameWritten;
      chunk.copy(this.lastFrame, this.lastFrameWritten, 0);
      let written = writtenBefore + chunk.length;

      if (written >= this.lastFrame.length) {
        written = this.lastFrame.length;
        this.frameQueue.push(this.lastFrame);
        this.lastFrame = createFrameBuffer();
        this.lastFrameWritten = 0;
      } else {
        this.lastFrameWritten = written;
      }

      if (chunk.length > written - writtenBefore) {
        chunk = chunk.slice(written - writtenBefore);
      } else {
        return cb();
      }
    }
  }
}
