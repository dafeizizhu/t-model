const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')
const TZero = require('./t-zero')
const TInt8 = require('./t-int8')

class TInt16 extends TBase {
  static isValid (value) {
    return !isNaN(value) &&
      this.parse(value) >= -Math.pow(2, 15) &&
      this.parse(value) <= Math.pow(2, 15) - 1
  }
  static parse (value) {
    return parseInt(value, 10)
  }
  static get TYPE_ID () {
    return TYPE_IDS.INT16
  }
  static readWithHead (is, head) {
    switch (head.typeId) {
      case this.TYPE_ID:
        return this.readFrom(is, is.tBuffer)
      case TZero.TYPE_ID:
        return TZero.readFrom(is, is.tBuffer)
      case TInt8.TYPE_ID:
        return TInt8.readFrom(is, is.tBuffer)
      default:
        throw new Error(`type mismatch, expected ${[this.TYPE_ID, TZero.TYPE_ID, TInt8.TYPE_ID]}, actual ${head.typeId}`)
    }
  }
  static readFrom (is, tBuffer) {
    return tBuffer.readInt16()
  }
  static skipField (is, tBuffer) {
    tBuffer.position += 2
  }
  write (os, tag) {
    if (TInt8.isValid(this._value)) {
      new TInt8(this._value).write(os, tag)
    } else {
      super.write(os, tag)
    }
  }
  writeTo (os, tBuffer) {
    tBuffer.writeInt16(this._value)
  }
}

module.exports = TInt16
