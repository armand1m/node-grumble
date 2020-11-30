import { TLSSocket } from 'tls';
import { OpusEncoder } from '@discordjs/opus';
import { Codec, Messages } from '../types';

const defaultAudioConfig = {
  sampleRate: 48000,
  channels: 1,
  bitDepth: 16,
  frameSize: 480,
  frameLength: 10,
};

/**
 * TODO: Consider offloading this to an npm package like `varint`,
 * their implementation is far better than this
 **/
function encodeVarint(i: number) {
  const arr = [];

  if (i < 0) {
    i = ~i;

    if (i <= 0x3) {
      return {
        value: Buffer.from([0xfc | i]),
        length: 1,
      };
    }

    arr.push(0xf8);
  }

  if (i < 0x80) {
    arr.push(i);
  } else if (i < 0x4000) {
    arr.push((i >> 8) | 0x80);
    arr.push(i & 0xff);
  } else if (i < 0x200000) {
    arr.push((i >> 16) | 0xc0);
    arr.push((i >> 8) & 0xff);
    arr.push(i & 0xff);
  } else if (i < 0x10000000) {
    arr.push((i >> 24) | 0xe0);
    arr.push((i >> 16) & 0xff);
    arr.push((i >> 8) & 0xff);
    arr.push(i & 0xff);
  } else if (i < 0x100000000) {
    arr.push(0xf0);
    arr.push((i >> 24) & 0xff);
    arr.push((i >> 16) & 0xff);
    arr.push((i >> 8) & 0xff);
    arr.push(i & 0xff);
  } else {
    throw new TypeError(
      `Non-integer values are not supported. ('${i}')`
    );
  }

  return {
    value: Buffer.from(arr),
    length: arr.length,
  };
}

export const createAudioInterface = (socket: TLSSocket) => {
  const opusEncoder = new OpusEncoder(
    defaultAudioConfig.sampleRate,
    1
  );

  let _voiceSequence = 0;

  function writeAudio(
    rawPacket: Buffer,
    whisperTarget?: number,
    initialVoiceSequence?: number,
    isFinal?: boolean
  ) {
    const packet = opusEncoder.encode(rawPacket);

    const target = whisperTarget || 0;
    const typeTarget = (Codec.Opus << 5) | target;

    let voiceSequence = initialVoiceSequence ?? _voiceSequence;

    const sequenceVarint = encodeVarint(voiceSequence);

    const voiceHeader = Buffer.alloc(1 + sequenceVarint.length);
    voiceHeader[0] = typeTarget;
    sequenceVarint.value.copy(voiceHeader, 1, 0);

    if (packet.length > 0x1fff) {
      throw new TypeError(
        `Audio frame too long! Max Opus length is ${0x1fff} bytes.`
      );
    }

    let headerValue = packet.length;

    if (isFinal) {
      headerValue += 1 << 7;
    }

    const headerVarint = encodeVarint(headerValue);
    const header = headerVarint.value;

    const frame = Buffer.alloc(header.length + packet.length);
    header.copy(frame, 0);
    packet.copy(frame, header.length);

    voiceSequence++;

    header.writeUInt16BE(Messages.UDPTunnel, 0);
    header.writeUInt32BE(voiceHeader.length + frame.length, 2);

    socket.write(voiceHeader);
    socket.write(frame);

    if (voiceSequence > _voiceSequence) {
      _voiceSequence = voiceSequence;
    }

    return 1;
  }

  return {
    writeAudio,
  };
};
