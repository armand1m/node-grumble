import { EventEmitter } from 'events';
import { Writable as WritableStream } from 'stream';
import { defaultAudioConfig } from './audio-configuration';
import { Connection } from './create-connection';

/**
 * TODO: Cleanup this class.
 */
export class AudioDispatcher extends WritableStream {
  private connection: Connection;
  private processObserver: EventEmitter;
  private processInterval: NodeJS.Timeout | undefined | null;
  private frameQueue: Buffer[];
  private lastFrame: Buffer;
  private whisperId: number;
  private _volume: number;
  private lastFrameWritten: number;
  private lastWrite: any;
  private voiceSequence: number;

  constructor(connection: Connection, voiceTarget: number) {
    super();
    this.connection = connection;
    this.processObserver = new EventEmitter();

    this.open();

    this.frameQueue = [];
    this.lastFrame = this._createFrameBuffer();

    this.whisperId = voiceTarget;

    this._volume = 1;
    this.lastFrameWritten = 0;
    this.lastWrite = null;

    this.voiceSequence = 0;
  }

  open() {
    if (this.processInterval) return;
    this.processInterval = setInterval(
      this._processAudioBuffer.bind(this),
      defaultAudioConfig.frameLength
    );
  }

  close() {
    if (this.processInterval) clearInterval(this.processInterval);
    this.processInterval = null;
    this.frameQueue = [];
    this.lastFrame = this._createFrameBuffer();
    this.lastFrameWritten = 0;
    this.lastWrite = null;
    this.voiceSequence = 0;
  }

  set volume(volume) {
    this._volume = volume;
  }

  get volume() {
    return this._volume;
  }

  applyFrameVolume(frame: Buffer, gain: number) {
    for (var i = 0; i < frame.length; i += 2) {
      frame.writeInt16LE(Math.floor(frame.readInt16LE(i) * gain), i);
    }
    return frame;
  }

  _createFrameBuffer() {
    return Buffer.alloc(defaultAudioConfig.frameSize * 2);
  }

  _processAudioBuffer() {
    if (
      !this.lastWrite ||
      this.lastWrite + 20 * defaultAudioConfig.frameLength <
        Date.now()
    ) {
      this.lastWrite = Date.now();
      return;
    }

    while (
      this.lastWrite + defaultAudioConfig.frameLength <
      Date.now()
    ) {
      if (this.frameQueue.length > 0) {
        let frame = this.frameQueue.shift();

        if (!frame) {
          break;
        }

        if (this._volume !== 1) {
          frame = this.applyFrameVolume(frame, this._volume);
        }

        if (this.frameQueue.length < 1) {
          this.voiceSequence += this.connection.writeAudio(
            frame,
            this.whisperId,
            this.voiceSequence,
            true
          );
        } else {
          this.voiceSequence += this.connection.writeAudio(
            frame,
            this.whisperId,
            this.voiceSequence,
            false
          );
        }

        this.processObserver.emit('written');
      }

      this.lastWrite += defaultAudioConfig.frameLength;
    }

    return;
  }

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
        this.lastFrame = this._createFrameBuffer();
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
