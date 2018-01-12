const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')
const TZero = require('./t-zero')

class TFloat extends TBase {
  static get PRECISION () { return 5 }
  static isValid (value) {
    return !isNaN(value) && value !== null && value !== undefined
  }
  static parse (value) {
    return parseFloat(value)
  }
  static get TYPE_ID () {
    return TYPE_IDS.FLOAT
  }
  static readWithHead (is, head) {
    switch (head.typeId) {
      case this.TYPE_ID:
        return this.readFrom(is, is.tBuffer)
      case TZero.TYPE_ID:
        return TZero.readFrom(is, is.tBuffer)
      default:
        throw new Error(`type mismatch, expected ${[this.TYPE_ID, TZero.TYPE_ID]}, actual ${head.typeId}`)
    }
  }
  static readFrom (is, tBuffer) {
    return new this(tBuffer.readFloat()).valueOf()
  }
  static skipField (is, tBuffer) {
    tBuffer.position += 4
  }
  write (os, tag) {
    if (this._value === 0) {
      new TZero().write(os, tag)
    } else {
      super.write(os, tag)
    }
  }
  writeTo (os, tBuffer) {
    tBuffer.writeFloat(this._value)
  }
  valueOf () {
    return this._value === 0 ? 0 : Number(this._value.toPrecision(this.constructor.PRECISION))
  }
}

module.exports = TFloat
