const md5 = require('md5')

const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')

module.exports = T => {
  class TList extends TBase {
    static get name () {
      return 'TList<' + T.name + '>'
    }
    static isValid (value) {
      return value === undefined || Array.isArray(value)
    }
    static parse (value) {
      value = value || []
      return value.map(v => new T(v))
    }
    static get TYPE_ID () {
      return TYPE_IDS.LIST
    }
    static readFrom (is, tBuffer) {
      let size = is.readInt32(0, true)
      if (size < 0) throw new Error(`invalid list size ${size}`)
      let list = new TList()
      for (let i = 0; i < size; i++) {
        list.push(T.read(is, 0, true))
      }
      return list.valueOf()
    }
    writeTo (os, tBuffer) {
      let size = this._value.length
      os.writeInt32(0, size)
      this._value.forEach(tv => tv.write(os, 0))
    }
    push (v) {
      this._value.push(new T(v))
    }
    valueOf () {
      return this._value.map(tv => tv.valueOf())
    }
    keyOf () {
      return md5(this._value.map(tv => tv.keyOf()).join('__key__'))
    }
  }

  return TList
}
