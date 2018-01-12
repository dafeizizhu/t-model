const {
  TZero,
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
  TString,
  TString1,
  TString4
} = require('../types')

const { TYPE_IDS } = require('../constants')

const T_MAP = [
  TZero,
  TInt8,
  TInt16,
  TInt32,
  TInt64,
  TFloat,
  TDouble,
  TString1,
  TString4
].reduce((p, c) => {
  p[c.TYPE_ID] = c
  return p
}, {})

class TInputStream {
  constructor (tBuffer) {
    this._tBuffer = tBuffer
    this._tBuffer.position = 0
  }
  get tBuffer () {
    return this._tBuffer
  }
  skipToTag (tag, isRequire) {
    while (this._tBuffer.position < this._tBuffer.length) {
      let head = this._peekHead()
      if (tag <= head.tag || head.tag === TYPE_IDS.STRUCT_END) {
        if (head.typeId !== TYPE_IDS.STRUCT_END && tag === head.tag) {
          return true
        }
        break
      }
      this._tBuffer.position += head.size
      this._skipField(head.typeId)
    }
    if (isRequire) throw new Error(`require field not exist, tag ${tag}`)
    return false
  }
  skipToStructEnd () {
    while (this._tBuffer.position < this._tBuffer.length) {
      let head = this.readHead()
      this._skipField(head.typeId)
      if (head.typeId === TYPE_IDS.STRUCT_END) break
    }
  }
  _peekHead () {
    let pos = this._tBuffer.position
    let head = this.readHead()
    this._tBuffer.position = pos
    return Object.assign(head, { size: head.tag >= 15 ? 2 : 1 })
  }
  readHead () {
    let temp = this._tBuffer.readUInt8()
    let tag = (temp & 0xf0) >> 4
    let typeId = (temp & 0x0f)

    if (tag >= 15) tag = this._tBuffer.readUInt8()
    return { tag, typeId }
  }
  _skipField (typeId) {
    if (T_MAP[typeId]) {
      T_MAP[typeId].skipField(this, this._tBuffer)
    } else {
      let size, i
      switch (typeId) {
        case TYPE_IDS.LIST:
          size = this.readInt32(0, true)
          for (i = 0; i < size; i++) {
            let head = this.readHead()
            this._skipField(head.typeId)
          }
          break
        case TYPE_IDS.MAP:
          size = this.readInt32(0, true)
          for (i = 0; i < size * 2; i++) {
            let head = this.readHead()
            this._skipField(head.typeId)
          }
          break
        case TYPE_IDS.STRUCT_BEGIN:
          this.skipToStructEnd()
          break
        case TYPE_IDS.STRUCT_END:
          break
        case TYPE_IDS.SIMPLELIST:
          let head = this.readHead()
          if (head.typeId !== TYPE_IDS.INT8) throw new Error('typemismatch')
          let length = this.readInt32(0, true)
          this._tBuffer.position += length
          break
        default:
          throw new Error(`type mismatch typeId ${typeId}`)
      }
    }
  }
  _readTBase (tag, isRequire, T, defaultValue) {
    return T.read(this, tag, isRequire, defaultValue)
  }
  readBool (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TBool, defaultValue)
  }
  readInt8 (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TInt8, defaultValue)
  }
  readInt16 (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TInt16, defaultValue)
  }
  readInt32 (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TInt32, defaultValue)
  }
  readInt64 (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TInt64, defaultValue)
  }
  readUInt8 (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TUInt8, defaultValue)
  }
  readUInt16 (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TUInt16, defaultValue)
  }
  readUInt32 (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TUInt32, defaultValue)
  }
  readFloat (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TFloat, defaultValue)
  }
  readDouble (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TDouble, defaultValue)
  }
  readString (tag, isRequire, defaultValue) {
    return this._readTBase(tag, isRequire, TString, defaultValue)
  }
  readList (tag, isRequire, ListT, defaultValue) {
    return this._readTBase(tag, isRequire, ListT, defaultValue)
  }
  readMap (tag, isRequire, MapT, defaultValue) {
    return this._readTBase(tag, isRequire, MapT, defaultValue)
  }
  readStruct (tag, isRequire, StructT, defaultValue) {
    return this._readTBase(tag, isRequire, StructT, defaultValue)
  }
}

module.exports = TInputStream
