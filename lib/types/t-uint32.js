const TInt64 = require('./t-int64')

class TUInt32 extends TInt64 {
  static isValid (value) {
    return super.isValid(value) &&
      this.parse(value) >= 0 &&
      this.parse(value) <= Math.pow(2, 32) - 1
  }
}

module.exports = TUInt32
