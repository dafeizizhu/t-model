const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')

class TBytes extends TBase {
  static isValid (value) {
    return Array.isArray(value) ||
      Buffer.isBuffer(value) ||
      typeof value === 'string' ||
      value instanceof ArrayBuffer ||
      !isNaN(value)
  }
  static parse (value) {
    if (!isNaN(value)) {
      return Buffer.allocUnsafe(parseInt(value, 10))
    } else {
      return Buffer.from(value)
    }
  }
  static get TYPE_ID () {
    return TYPE_IDS.SIMPLELIST
  }
  static readFrom (is, tBuffer) {
    let head = is.readHead()
    if (head.typeId !== TYPE_IDS.INT8) throw new Error('typemismatch')
    let size = is.readInt32(0, true)
    if (size < 0) throw new Error(`invalid bytes size ${size}`)
    return tBuffer.readBuffer(size)
  }
  writeTo (os, tBuffer) {
    os.writeHead(0, TYPE_IDS.INT8)
    os.writeInt32(0, this._value.length)
    tBuffer.writeBuffer(this._value)
  }
}

module.exports = TBytes
