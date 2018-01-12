const TBase = require('./t-base')
const TInt8 = require('./t-int8')

class TBool extends TBase {
  static isValid (value) {
    return true
  }
  static parse (value) {
    return !!value
  }
  static readWithHead (is, head) {
    return !!TInt8.readWithHead(is, head)
  }
  write (os, tag) {
    new TInt8(this._value ? 1 : 0).write(os, tag)
  }
}

module.exports = TBool
