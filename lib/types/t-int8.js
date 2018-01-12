const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')
const TZero = require('./t-zero')

class TInt8 extends TBase {
  static isValid (value) {
    return !isNaN(value) &&
      this.parse(value) >= -Math.pow(2, 7) &&
      this.parse(value) <= Math.pow(2, 7) - 1
  }

  static parse (value) {
    return parseInt(value, 10)
  }

  static get TYPE_ID () {
    return TYPE_IDS.INT8
  }

  static readWithHead (is, head) {
    if (head.typeId === this.TYPE_ID) {
      return this.readFrom(is, is.tBuffer)
    } else if (head.typeId === TZero.TYPE_ID) {
      return TZero.readFrom(is, is.tBuffer)
    } else {
      throw new Error(`type mismatch, expected ${[this.TYPE_ID, TZero.TYPE_ID]}, actual ${head.typeId}`)
    }
  }

  static readFrom (is, tBuffer) {
    return tBuffer.readInt8()
  }

  static skipField (is, tBuffer) {
    tBuffer.position += 1
  }

  write (os, tag) {
    if (this._value === 0) {
      new TZero().write(os, tag)
    } else {
      super.write(os, tag)
    }
  }
  writeTo (os, tBuffer) {
    tBuffer.writeInt8(this._value)
  }
}

module.exports = TInt8
