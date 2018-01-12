const md5 = require('md5')

const { TYPE_IDS } = require('../constants')
const TBase = require('./t-base')

module.exports = (KeyT, ValueT) => {
  class TMap extends TBase {
    static get name () {
      return 'TMap<' + KeyT.name + ', ' + ValueT.name + '>'
    }
    static isValid (value) {
      return value === undefined || typeof value === 'object'
    }
    static parse (value) {
      value = value || {}
      return Object.keys(value).reduce((p, c) => {
        let tk, tv
        if (typeof value[c]._key === 'object') {
          tk = new KeyT(value[c]._key)
          tv = new ValueT(value[c]._value)
        } else {
          tk = new KeyT(c)
          tv = new ValueT(value[c])
        }
        p[tk.keyOf()] = { tk, tv }
        return p
      }, {})
    }
    static get TYPE_ID () {
      return TYPE_IDS.MAP
    }
    static readFrom (is, tBuffer) {
      let size = is.readInt32(0, true)
      if (size < 0) {
        throw new Error(`invalid map size ${size}`)
      }
      let map = new TMap()
      for (let i = 0; i < size; i++) {
        let key = KeyT.read(is, 0, true)
        let value = ValueT.read(is, 1, true)
        map.put(key, value)
      }
      return map.valueOf()
    }
    writeTo (os, tBuffer) {
      let size = Object.keys(this._value).length
      os.writeInt32(0, size)
      Object.keys(this._value).forEach(_key => {
        let { tk, tv } = this._value[_key]
        tk.write(os, 0)
        tv.write(os, 1)
      })
    }
    put (k, v) {
      let tk = new KeyT(k)
      let tv = new ValueT(v)
      if (this._value[tk.keyOf()]) {
        this._value[tk.keyOf()].tv = tv
      } else {
        this._value[tk.keyOf()] = { tk, tv }
      }
    }
    get (k) {
      let tk = k instanceof TBase ? k : new KeyT(k)
      return this._value[tk.keyOf()].valueOf()
    }
    size () {
      return Object.keys(this._value).length
    }
    valueOf () {
      return Object.keys(this._value).reduce((p, c) => {
        let k = this._value[c].tk.valueOf()
        let v = this._value[c].tv.valueOf()

        if (typeof k === 'object') {
          p[c] = { _key: k, _value: v }
        } else {
          p[k] = v
        }

        return p
      }, {})
    }
    keyOf () {
      return md5(Object.keys(this._value).map(_key => {
        return this._value[_key].tk.keyOf() + '__key__' + this._value[_key].tv.keyOf()
      }).join('__key__'))
    }
  }

  return TMap
}
