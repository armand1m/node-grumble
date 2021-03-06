import { TLSSocket } from 'tls';
import { OpusEncoder } from '@discordjs/opus';
import { Codec, Messages } from '../types';
import * as Varint from '../structures/Varint';
import { defaultAudioConfig } from './audio-configuration';
import { createPacketHeader } from '../proto/protobuf';

export const createAudioInterface = (socket: TLSSocket) => {
  const opusEncoder = new OpusEncoder(
    defaultAudioConfig.sampleRate,
    defaultAudioConfig.channels
  );

  const setBitrate = (bitrate: number) => {
    /**
     * Remove ts ignore once https://github.com/discordjs/opus/pull/48 gets merged.
     */
    // @ts-ignore
    opusEncoder.setBitrate(bitrate);
  };

  function writeAudio(
    buffer: Buffer,
    whisperTarget?: number,
    initialVoiceSequence: number = 0,
    isFinal: boolean = false
  ) {
    const encodedBuffer = opusEncoder.encode(buffer);

    if (encodedBuffer.length > 0x1fff) {
      throw new TypeError(
        `Audio frame too long! Max Opus length is ${0x1fff} bytes.`
      );
    }

    const target = whisperTarget || 0;
    const typeTarget = (Codec.Opus << 5) | target;

    const sequence = Varint.encode(initialVoiceSequence);
    const voiceHeader = Buffer.alloc(1 + sequence.length);
    voiceHeader[0] = typeTarget;
    sequence.copy(voiceHeader, 1, 0);

    const bufferLength = isFinal
      ? encodedBuffer.length + (1 << 7)
      : encodedBuffer.length;

    const header = Varint.encode(bufferLength);
    const frame = Buffer.alloc(header.length + encodedBuffer.length);
    header.copy(frame, 0);
    encodedBuffer.copy(frame, header.length);

    const packetHeader = createPacketHeader(
      Messages.UDPTunnel,
      voiceHeader.length + frame.length
    );

    socket.write(packetHeader);
    socket.write(voiceHeader);
    socket.write(frame);

    /** Result can be used by AudioDispatch to keep it's own voice sequence state. */
    return 1;
  }

  return {
    setBitrate,
    writeAudio,
  };
};
