const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')

class TString1 extends TBase {
  static isValid (value) {
    return Buffer.byteLength(String(value), 'utf8') < 256
  }
  static parse (value) {
    return String(value)
  }
  static get TYPE_ID () {
    return TYPE_IDS.STRING1
  }
  static readFrom (is, tBuffer) {
    let length = tBuffer.readUInt8()
    return tBuffer.readString(length)
  }
  static skipField (is, tBuffer) {
    let length = tBuffer.readUInt8()
    tBuffer.position += length
  }
  writeTo (os, tBuffer) {
    let length = Buffer.byteLength(this._value, 'utf8')
    tBuffer.writeUInt8(length)
    tBuffer.writeString(this._value, length)
  }
}

module.exports = TString1
