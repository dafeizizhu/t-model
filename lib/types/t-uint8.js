const TInt16 = require('./t-int16')

class TUInt8 extends TInt16 {
  static isValid (value) {
    return super.isValid(value) &&
      this.parse(value) >= 0 &&
      this.parse(value) <= Math.pow(2, 8) - 1
  }
}

module.exports = TUInt8
