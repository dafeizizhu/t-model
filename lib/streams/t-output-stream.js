const {
  TBuffer,
  TBase,
  TBool,
  TInt8,
  TInt16,
  TInt32,
  TInt64,
  TUInt8,
  TUInt16,
  TUInt32,
  TFloat,
  TDouble,
  TString
} = require('../types')

class TOutputStream {
  constructor () {
    this._tBuffer = new TBuffer()
  }
  get tBuffer () {
    return this._tBuffer
  }

  setHeaderLength (value) {
    let position = this._tBuffer.position === 0 ? 4 : this._tBuffer.position
    let length = this._tBuffer.position === 0 ? 4 : this._tBuffer.length

    this._tBuffer.position = 0
    this._tBuffer.writeInt32(value)
    this._tBuffer.position = position
    this._tBuffer.length = length
  }

  _writeTBase (tag, value, T) {
    value = value instanceof TBase ? value : new T(value)
    value.write(this, tag)
  }
  writeHead (typeId, tag) {
    if (tag < 15) {
      this._tBuffer.writeUInt8((tag << 4 & 0xf0) | typeId)
    } else {
      this._tBuffer.writeUInt16((0xf0 | typeId) << 8 | tag)
    }
  }
  writeBool (tag, value) {
    this._writeTBase(tag, value, TBool)
  }
  writeInt8 (tag, value) {
    this._writeTBase(tag, value, TInt8)
  }
  writeInt16 (tag, value) {
    this._writeTBase(tag, value, TInt16)
  }
  writeInt32 (tag, value) {
    this._writeTBase(tag, value, TInt32)
  }
  writeInt64 (tag, value) {
    this._writeTBase(tag, value, TInt64)
  }
  writeUInt8 (tag, value) {
    this._writeTBase(tag, value, TUInt8)
  }
  writeUInt16 (tag, value) {
    this._writeTBase(tag, value, TUInt16)
  }
  writeUInt32 (tag, value) {
    this._writeTBase(tag, value, TUInt32)
  }
  writeFloat (tag, value) {
    this._writeTBase(tag, value, TFloat)
  }
  writeDouble (tag, value) {
    this._writeTBase(tag, value, TDouble)
  }
  writeString (tag, value) {
    this._writeTBase(tag, value, TString)
  }
  writeList (tag, value, ListT) {
    this._writeTBase(tag, value, ListT)
  }
  writeMap (tag, value, MapT) {
    this._writeTBase(tag, value, MapT)
  }
  writeStruct (tag, value, StructT) {
    this._writeTBase(tag, value, StructT)
  }
}

module.exports = TOutputStream
