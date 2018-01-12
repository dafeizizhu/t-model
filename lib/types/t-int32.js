const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')
const TZero = require('./t-zero')
const TInt8 = require('./t-int8')
const TInt16 = require('./t-int16')

class TInt32 extends TBase {
  static isValid (value) {
    return !isNaN(value) &&
      this.parse(value) >= -Math.pow(2, 31) &&
      this.parse(value) <= Math.pow(2, 31) - 1
  }
  static parse (value) {
    return parseInt(value, 10)
  }
  static get TYPE_ID () {
    return TYPE_IDS.INT32
  }
  static readWithHead (is, head) {
    switch (head.typeId) {
      case this.TYPE_ID:
        return this.readFrom(is, is.tBuffer)
      case TZero.TYPE_ID:
        return TZero.readFrom(is, is.tBuffer)
      case TInt8.TYPE_ID:
        return TInt8.readFrom(is, is.tBuffer)
      case TInt16.TYPE_ID:
        return TInt16.readFrom(is, is.tBuffer)
      default:
        throw new Error(`type mismatch, expected ${[this.TYPE_ID, TZero.TYPE_ID, TInt8.TYPE_ID, TInt16.TYPE_ID]}, actual ${head.typeId}`)
    }
  }
  static readFrom (is, tBuffer) {
    return tBuffer.readInt32()
  }
  static skipField (is, tBuffer) {
    tBuffer.position += 4
  }
  write (os, tag) {
    if (TInt16.isValid(this._value)) {
      new TInt16(this._value).write(os, tag)
    } else {
      super.write(os, tag)
    }
  }
  writeTo (os, tBuffer) {
    tBuffer.writeInt32(this._value)
  }
}

module.exports = TInt32
