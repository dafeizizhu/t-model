const Int64BE = require('int64-buffer').Int64BE

const { createBuffer } = require('../util')

class TBuffer {
  constructor (buffer) {
    if (!buffer) buffer = createBuffer([])
    this._buffer = buffer
    this._length = buffer.length
    this._capacity = this._length
    this._position = 0
  }

  get position () {
    return this._position
  }
  set position (value) {
    this._position = value
  }
  get length () {
    return this._length
  }
  set length (value) {
    this._length = value
  }
  get buffer () {
    let tmp = createBuffer(this._length)
    this._buffer.copy(tmp, 0, 0, this._length)
    return tmp
  }

  _allocate (length) {
    if (this._capacity > this._position + length) return

    this._capacity = Math.max(512, (this._position + length) * 2)
    let temp = createBuffer(this._capacity)
    this._buffer.copy(temp, 0, 0, this._position)
    this._buffer = undefined
    this._buffer = temp
  }

  writeInt8 (value) {
    value = parseInt(value, 10)
    this._allocate(1)
    this._buffer.writeInt8(value, this._position)
    this._position += 1
    this._length = this._position
  }
  writeInt16 (value) {
    value = parseInt(value, 10)
    this._allocate(2)
    this._buffer.writeInt16BE(value, this._position)
    this._position += 2
    this._length = this._position
  }
  writeInt32 (value) {
    value = parseInt(value, 10)
    this._allocate(4)
    this._buffer.writeInt32BE(value, this._position)
    this._position += 4
    this._length = this._position
  }
  writeInt64 (value) {
    this._allocate(8)
    if (!(value instanceof Int64BE)) {
      value = new Int64BE(value)
    }
    value.toBuffer().copy(this._buffer, this._position, 0, 8)
    this._position += 8
    this._length = this._position
  }
  writeUInt8 (value) {
    value = parseInt(value, 10)
    this._allocate(1)
    this._buffer.writeUInt8(value, this._position)
    this._position += 1
    this._length = this._position
  }
  writeUInt16 (value) {
    value = parseInt(value, 10)
    this._allocate(2)
    this._buffer.writeUInt16BE(value, this._position)
    this._position += 2
    this._length = this._position
  }
  writeUInt32 (value) {
    value = parseInt(value, 10)
    this._allocate(4)
    this._buffer.writeUInt32BE(value, this._position)
    this._position += 4
    this._length = this._position
  }
  writeFloat (value) {
    value = parseFloat(value)
    this._allocate(4)
    this._buffer.writeFloatBE(value, this._position)
    this._position += 4
    this._length = this._position
  }
  writeDouble (value) {
    value = parseFloat(value)
    this._allocate(8)
    this._buffer.writeDoubleBE(value, this._position)
    this._position += 8
    this._length = this._position
  }
  writeString (value, length) {
    this._allocate(length)
    this._buffer.write(value, this._position, length, 'utf8')
    this._position += length
    this._length = this._position
  }
  writeBuffer (value) {
    if (value.length === 0) return
    this._allocate(value.length)
    value.copy(this._buffer, this._position, 0, value.length)
    this._position += value.length
    this._length = this._position
  }

  readInt8 () {
    this._position += 1
    return this._buffer.readInt8(this._position - 1)
  }
  readInt16 () {
    this._position += 2
    return this._buffer.readInt16BE(this._position - 2)
  }
  readInt32 () {
    this._position += 4
    return this._buffer.readInt32BE(this._position - 4)
  }
  readInt64 () {
    let buffer = createBuffer(8)
    this._buffer.copy(buffer, 0, this._position, this._position + 8)
    this._position += 8
    return new Int64BE(buffer)
  }
  readUInt8 () {
    this._position += 1
    return this._buffer.readUInt8(this._position - 1)
  }
  readUInt32 () {
    this._position += 4
    return this._buffer.readUInt32BE(this._position - 4)
  }
  readFloat () {
    this._position += 4
    return this._buffer.readFloatBE(this._position - 4)
  }
  readDouble () {
    this._position += 8
    return this._buffer.readDoubleBE(this._position - 8)
  }
  readString (length) {
    let tmp = createBuffer(length)
    this._buffer.copy(tmp, 0, this._position, this._position + length)
    this._position += length
    return tmp.toString('utf8', 0, tmp.length)
  }
  readBuffer (length) {
    let buffer = createBuffer(length)
    this._buffer.copy(buffer, 0, this._position, this._position + length)
    this._position += length
    return buffer
  }
}

module.exports = TBuffer
