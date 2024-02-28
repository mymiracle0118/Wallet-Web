// https://gist.github.com/joni/3760795/8f0c1a608b7f0c8b3978db68105c5b1d741d0446
export function toUTF8Array(str: string) {
  let utf8 = []
  let i
  for (i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i)
    if (charcode < 0x80) utf8.push(charcode)
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f))
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f))
    }
    // surrogate pair
    else {
      charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      )
    }
  }
  return utf8
}

export function fromUTF8Array(data: Array<string | number>): string {
  // array of bytes
  let str = '',
    i

  for (i = 0; i < data.length; i++) {
    let value = data[i]

    if (value < 0x80) {
      str += String.fromCharCode(value)
    } else if (value > 0xbf && value < 0xe0) {
      str += String.fromCharCode(((value & 0x1f) << 6) | (data[i + 1] & 0x3f))
    } else if (value > 0xdf && value < 0xf0) {
      str += String.fromCharCode(((value & 0x0f) << 12) | ((data[i + 1] & 0x3f) << 6) | (data[i + 2] & 0x3f))
      i += 2 // eslint-disable-line
    } else {
      // surrogate pair
      const charCode =
        (((value & 0x07) << 18) | ((data[i + 1] & 0x3f) << 12) | ((data[i + 2] & 0x3f) << 6) | (data[i + 3] & 0x3f)) -
        0x010000

      str += String.fromCharCode((charCode >> 10) | 0xd800, (charCode & 0x03ff) | 0xdc00)
      i += 3 // eslint-disable-line
    }
  }

  return str
}
