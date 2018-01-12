const TBase = require('./t-base')
const { TYPE_IDS } = require('../constants')

class TZero extends TBase {
  static isValid (value) {
    return true
  }
  static parse (value) {
    return 0
  }
  static get TYPE_ID () {
    return TYPE_IDS.ZERO
  }
  static readFrom (is, tBuffer) {
    return 0
  }
  static skipField (is, tBuffer) {}
  writeTo (os, tBuffer) {}
}

module.exports = TZero
