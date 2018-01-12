const { TYPE_IDS } = require('../constants')

const TBase = require('./t-base')

class TStruct extends TBase {
  static isValid (value) {
    return value === undefined || typeof value === 'object'
  }
  static get TYPE_ID () {
    return TYPE_IDS.STRUCT_BEGIN
  }
  static readWithHead (is, head) {
    let tmp = super.readWithHead(is, head)
    is.skipToStructEnd()
    return tmp
  }
  write (os, tag) {
    super.write(os, tag)
    os.writeHead(TYPE_IDS.STRUCT_END, 0)
  }
}

module.exports = TStruct
