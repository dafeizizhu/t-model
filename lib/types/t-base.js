const md5 = require('md5')
const assert = require('assert')

class TBase {
  constructor (value) {
    assert(this.constructor.isValid(value), `value ${value} for ${this.constructor.name} is not valid`)
    this._value = this.constructor.parse(value)
  }

  static isValid (value) {
    throw new Error('not implemented')
  }

  static parse (value) {
    throw new Error('not implemented')
  }

  valueOf () {
    return this._value
  }

  static get TYPE_ID () {
    throw new Error('not implemented')
  }

  static skipField (is, tBuffer) {
    throw new Error('not implemented in ' + this.name)
  }

  static read (is, tag, isRequire, defaultValue) {
    if (!is.skipToTag(tag, isRequire)) {
      return defaultValue
    }
    return this.readWithHead(is, is.readHead())
  }

  static readWithHead (is, head) {
    if (head.typeId !== this.TYPE_ID) {
      throw new Error('type mismatch')
    }
    return this.readFrom(is, is.tBuffer)
  }

  static readFrom (is, tBuffer) {
    throw new Error('not implemented')
  }

  write (os, tag) {
    os.writeHead(this.constructor.TYPE_ID, tag)
    this.writeTo(os, os.tBuffer)
  }

  writeTo (os, tBuffer) {
    throw new Error('not implemented')
  }

  equal (item) {
    return this.valueOf() === item.valueOf()
  }

  keyOf () {
    if (typeof this.valueOf() === 'object') {
      if (!this._key) {
        this._key = md5(String(new Date().valueOf() + Math.random()))
      }
      return this._key
    } else {
      return this.valueOf()
    }
  }
}

module.exports = TBase
