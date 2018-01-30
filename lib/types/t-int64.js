const Int64BE = require('int64-buffer').Int64BE

const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')
const TZero = require('./t-zero')
const TInt8 = require('./t-int8')
const TInt16 = require('./t-int16')
const TInt32 = require('./t-int32')

class TInt64 extends TBase {
  static isValid (value) {
    return !isNaN(value) &&
      this.parse(value) >= -Math.pow(2, 63) &&
      this.parse(value) <= Math.pow(2, 63) - 1
  }
  static parse (value) {
    return new Int64BE(value)
  }
  static get TYPE_ID () {
    return TYPE_IDS.INT64
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
      case TInt32.TYPE_ID:
        return TInt32.readFrom(is, is.tBuffer)
      default:
        throw new Error(`type mismatch, expected ${[this.TYPE_ID, TZero.TYPE_ID, TInt8.TYPE_ID, TInt16.TYPE_ID, TInt32.TYPE_ID]}, actual ${head.typeId}`)
    }
  }
  static readFrom (is, tBuffer) {
    return tBuffer.readInt64()
  }
  static skipField (is, tBuffer) {
    tBuffer.position += 8
  }
  write (os, tag) {
    if (TInt32.isValid(this._value)) {
      new TInt32(this._value).write(os, tag)
    } else {
      super.write(os, tag)
    }
  }
  writeTo (os, tBuffer) {
    tBuffer.writeInt64(this._value)
  }
  keyOf () {
    return this._value.toString()
  }
  valueOf () {
    return this._value.toString()
  }
}

module.exports = TInt64
