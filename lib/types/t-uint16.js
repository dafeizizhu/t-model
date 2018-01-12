const TInt32 = require('./t-int32')

class TUInt16 extends TInt32 {
  static isValid (value) {
    return super.isValid(value) &&
      this.parse(value) >= 0 &&
      this.parse(value) <= Math.pow(2, 16) - 1
  }
}

module.exports = TUInt16
