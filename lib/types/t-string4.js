const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')

class TString4 extends TBase {
  static isValid (value) {
    return Buffer.byteLength(String(value), 'utf8') >= 256
  }
  static parse (value) {
    return String(value)
  }
  static get TYPE_ID () {
    return TYPE_IDS.STRING4
  }
  static readFrom (is, tBuffer) {
    let length = tBuffer.readUInt32()
    return tBuffer.readString(length)
  }
  static skipField (is, tBuffer) {
    let length = tBuffer.readUInt32()
    tBuffer.position += length
  }
  writeTo (os, tBuffer) {
    let length = Buffer.byteLength(this._value, 'utf8')
    tBuffer.writeUInt32(length)
    tBuffer.writeString(this._value, length)
  }
}

module.exports = TString4
