/**
 * See https://mumble-protocol.readthedocs.io/en/latest/voice_data.html#variable-length-integer-encoding
 * for more information on this implementation.
 *
 * This implementation is a copy of the native C++ implementation from
 * mumble source code: https://github.com/mumble-voip/mumble/blob/master/src/PacketDataStream.h#L139-L186
 **/
export function encode(i: number) {
  const arr = [];

  if (i < 0) {
    i = ~i;

    if (i <= 0x3) {
      return Buffer.from([0xfc | i]);
    }

    arr.push(0xf8);
  }

  if (i < 0x80) {
    // Need top bit clear
    arr.push(i);
  } else if (i < 0x4000) {
    // Need top two bits clear
    arr.push((i >> 8) | 0x80);
    arr.push(i & 0xff);
  } else if (i < 0x200000) {
    // Need top three bits clear
    arr.push((i >> 16) | 0xc0);
    arr.push((i >> 8) & 0xff);
    arr.push(i & 0xff);
  } else if (i < 0x10000000) {
    // Need top four bits clear
    arr.push((i >> 24) | 0xe0);
    arr.push((i >> 16) & 0xff);
    arr.push((i >> 8) & 0xff);
    arr.push(i & 0xff);
  } else if (i < 0x100000000) {
    // It's a full 32-bit integer.
    arr.push(0xf0);
    arr.push((i >> 24) & 0xff);
    arr.push((i >> 16) & 0xff);
    arr.push((i >> 8) & 0xff);
    arr.push(i & 0xff);
  } else {
    // It's a 64-bit value.
    arr.push(0xf4);
    arr.push((i >> 56) & 0xff);
    arr.push((i >> 48) & 0xff);
    arr.push((i >> 40) & 0xff);
    arr.push((i >> 32) & 0xff);
    arr.push((i >> 24) & 0xff);
    arr.push((i >> 16) & 0xff);
    arr.push((i >> 8) & 0xff);
    arr.push(i & 0xff);
  }

  return Buffer.from(arr);
}
