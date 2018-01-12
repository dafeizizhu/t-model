const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')
const TString1 = require('./t-string1')
const TString4 = require('./t-string4')

class TString extends TBase {
  static isValid (value) {
    return true
  }
  static parse (value) {
    let length = Buffer.byteLength(value)
    if (length < 256) {
      return new TString1(value)
    } else {
      return new TString4(value)
    }
  }
  static readWithHead (is, head) {
    switch (head.typeId) {
      case TYPE_IDS.STRING1:
        return TString1.readFrom(is, is.tBuffer)
      case TYPE_IDS.STRING4:
        return TString4.readFrom(is, is.tBuffer)
      default:
        throw new Error(`type mismatch, expected ${[TString1.TYPE_ID, TString4.TYPE_ID]}, actual ${head.typeId}`)
    }
  }
  write (os, tag) {
    this._value.write(os, tag)
  }
  valueOf () {
    return this._value.valueOf()
  }
  keyOf () {
    return this._value.keyOf()
  }
}

module.exports = TString
