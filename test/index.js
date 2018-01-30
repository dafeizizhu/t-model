/* global describe, it */

const assert = require('assert')
const util = require('util')
const md5 = require('md5')

const TModel = require('../index')

const randomInt = e => Math.floor(Math.random() * Math.pow(2, e) - Math.pow(2, e - 1))
const randomUInt = e => Math.floor(Math.random() * (Math.pow(2, e) - 1))
const randomFloat = () => (Math.random() * 6.8e38 - 3.4e38).toPrecision(TModel.TFloat.PRECISION)
const randomDouble = () => (Math.random() * Number.MAX_VALUE - Number.MAX_VALUE / 2).toPrecision(TModel.TFloat.PRECISION)
const randomString = length => {
  let ret = Math.random().toString(36).substr(2)
  while (ret.length < length) {
    ret += Math.random().toString(36).substr(2)
  }
  return ret
}

class DemoStruct extends TModel.TStruct {
  static parse (value) {
    return Object.assign({}, { i: 0, str: '' }, value)
  }
  static readFrom (is, tBuffer) {
    let i = TModel.TInt32.read(is, 0, true)
    let str = TModel.TString.read(is, 1, true)
    return new DemoStruct({ i, str }).valueOf()
  }
  constructor (value) {
    super(value)

    this.t_i = new TModel.TInt32(this._value.i)
    this.t_str = new TModel.TString(this._value.str)
  }
  writeTo (os, tBuffer) {
    this.t_i.write(os, 0)
    this.t_str.write(os, 1)
  }
  valueOf () {
    return {
      i: this.t_i.valueOf(),
      str: this.t_str.valueOf()
    }
  }
  keyOf () {
    return md5(this.t_i.keyOf() + '__key__' + this.t_str.keyOf())
  }
}

describe('dev', () => {
  const normal = (write, read, invalidValues, values, defaultValues) => {
    let os = new TModel.TOutputStream()
    tags.forEach((tag, i) => {
      if (requires[i]) {
        write.call(os, tag, values[i])
      }
    })
    let is = new TModel.TInputStream(os.tBuffer)
    tags.forEach((tag, i) => {
      if (i % 2 === 0) {
        let actual = read.call(is, tag, requires[i], defaultValues[i])
        let expected = requires[i] ? values[i] : defaultValues[i]
        assert.equal(actual, expected, util.format('actual %s, expected %s, i %s, tag %s, require %s, defaultValue %s', actual, expected, i, tag, requires[i], defaultValues[i]))
      }
    })

    is = new TModel.TInputStream(os.tBuffer)
    tags.forEach((tag, i) => {
      if (!requires[i]) {
        assert.throws(() => read.call(is, tag, true))
      }
    })

    invalidValues.forEach(v => {
      assert.throws(() => write.call(os, 0, v), err => !!err, util.format('os.%s with value %s should throw an error', write.name, v))
    })
  }

  let tags = Array.apply(null, { length: 100 }).map(Number.call, Number)
  let requires = tags.map(tag => tag % 3 === 0)

  let boolInvalidValues = []
  let boolValues = tags.map(tag => Math.random() > 0.5)
  let boolDefaultValues = tags.map(tag => Math.random() > 0.5)

  let int8InvalidValues = [0 - Math.pow(2, 7) - 1, Math.pow(2, 7), 'a', null, undefined, {}, () => {}]
  let int8Values = tags.map(tag => tag === 0 ? 0 : randomInt(8))
  let int8DefaultValues = tags.map(tag => randomInt(8))

  let int16InvalidValues = [0 - Math.pow(2, 15) - 1, Math.pow(2, 15), 'a', null, undefined, {}, () => {}]
  let int16Values = tags.map(tag => {
    if (tag === 0) return 0
    if (tag < tags.length / 2) return randomInt(8)
    if (tag >= tags.length / 2) return randomInt(16)
  })
  let int16DefaultValues = tags.map(tag => randomInt(16))

  let int32InvalidValues = [0 - Math.pow(2, 31) - 1, Math.pow(2, 31), 'a', null, undefined, {}, () => {}]
  let int32Values = tags.map(tag => {
    if (tag === 0) return 0
    if (tag < tags.length / 3) return randomInt(8)
    if (tag >= tags.length / 3 && tag < tags.length / 3 * 2) return randomInt(16)
    if (tag >= tags.length / 3 * 2) return randomInt(32)
  })
  let int32DefaultValues = tags.map(tag => randomInt(32))

  let int64InvalidValues = ['a', undefined, {}, () => {}]
  let int64Values = tags.map(tag => {
    if (tag === 0) return 0
    if (tag < tags.length / 4) return randomInt(8)
    if (tag >= tags.length / 4 && tag < tags.length / 2) return randomInt(16)
    if (tag >= tags.length / 2 && tag < tags.length / 4 * 3) return randomInt(32)
    if (tag >= tags.length / 4 * 3) return randomInt(64)
  })
  let int64DefaultValues = tags.map(tag => randomInt(64))

  let uint8InvalidValues = [-1, Math.pow(2, 8), 'a', null, undefined, {}, () => {}]
  let uint8Values = tags.map(tag => tag === 0 ? 0 : randomUInt(8))
  let uint8DefaultValues = tags.map(tag => randomUInt(8))

  let uint16InvalidValues = [-1, Math.pow(2, 16), 'a', null, undefined, {}, () => {}]
  let uint16Values = tags.map(tag => {
    if (tag === 0) return 0
    if (tag < tags.length / 2) return randomUInt(8)
    if (tag >= tags.length / 2) return randomUInt(16)
  })
  let uint16DefaultValues = tags.map(tag => randomInt(16))

  let uint32InvalidValues = [-1, Math.pow(2, 32), 'a', undefined, {}, () => {}]
  let uint32Values = tags.map(tag => {
    if (tag === 0) return 0
    if (tag < tags.length / 3) return randomUInt(8)
    if (tag >= tags.length / 3 && tag < tags.length / 3 * 2) return randomUInt(16)
    if (tag >= tags.length / 3 * 2) return randomUInt(32)
  })
  let uint32DefaultValues = tags.map(tag => randomUInt(32))

  let floatInvalidValues = ['a', null, undefined, {}, () => {}]
  let floatValues = tags.map(tag => tag === 0 ? 0 : randomFloat())
  let floatDefaultValues = tags.map(tag => randomFloat())

  let doubleInvalidValues = ['a', null, undefined, {}, () => {}]
  let doubleValues = tags.map(tag => tag === 0 ? 0 : randomDouble())
  let doubleDefaultValues = tags.map(tag => randomDouble())

  let stringInvalidValues = [] // just invoke String on value
  let stringValues = tags.map(tag => tag < tags.length / 2 ? randomString(20) : randomString(500))
  let stringDefaultValues = tags.map(tag => randomString(20))

  let structValues = int8Values.map((i, index) => ({
    i, str: stringValues[index]
  }))

  const {
    writeBool,
    writeInt8,
    writeInt16,
    writeInt32,
    writeInt64,
    writeUInt8,
    writeUInt16,
    writeUInt32,
    writeFloat,
    writeDouble,
    writeString
  } = TModel.TOutputStream.prototype
  const {
    readBool,
    readInt8,
    readInt16,
    readInt32,
    readInt64,
    readUInt8,
    readUInt16,
    readUInt32,
    readFloat,
    readDouble,
    readString
  } = TModel.TInputStream.prototype

  it('bool', () => normal(writeBool, readBool, boolInvalidValues, boolValues, boolDefaultValues))
  it('int8', () => normal(writeInt8, readInt8, int8InvalidValues, int8Values, int8DefaultValues))
  it('int16', () => normal(writeInt16, readInt16, int16InvalidValues, int16Values, int16DefaultValues))
  it('int32', () => normal(writeInt32, readInt32, int32InvalidValues, int32Values, int32DefaultValues))
  it('int64', () => normal(writeInt64, readInt64, int64InvalidValues, int64Values, int64DefaultValues))
  it('uint8', () => normal(writeUInt8, readUInt8, uint8InvalidValues, uint8Values, uint8DefaultValues))
  it('uint16', () => normal(writeUInt16, readUInt16, uint16InvalidValues, uint16Values, uint16DefaultValues))
  it('uint32', () => normal(writeUInt32, readUInt32, uint32InvalidValues, uint32Values, uint32DefaultValues))
  it('float', () => normal(writeFloat, readFloat, floatInvalidValues, floatValues, floatDefaultValues))
  it('double', () => normal(writeDouble, readDouble, doubleInvalidValues, doubleValues, doubleDefaultValues))
  it('string', () => normal(writeString, readString, stringInvalidValues, stringValues, stringDefaultValues))
  it('list', () => {
    const { TInt8, TInt16, TInt32, TInt64, TUInt8, TUInt16, TUInt32, TFloat, TDouble, TString, TList, TMap } = TModel
    const ItemPrototypes = [TInt8, TInt16, TInt32, TInt64, TUInt8, TUInt16, TUInt32, TFloat, TDouble, TString, TList(TInt8), TMap(TString, TInt8), DemoStruct]
    const vectorValues = [
      int8Values,
      int16Values,
      int32Values,
      int64Values,
      uint8Values,
      uint16Values,
      uint32Values,
      floatValues,
      doubleValues,
      stringValues,
      int8Values.map((i, index) => ([int8Values[index], int8Values[index]])),
      stringValues.map((s, index) => {
        let ret = {}
        ret[s] = int8Values[index]
        return ret
      }),
      structValues
    ]

    let os = new TModel.TOutputStream()
    let tag = 0
    ItemPrototypes.forEach((ItemPrototype, index) => {
      let vectorValue = vectorValues[index]
      let listValue = new (TList(ItemPrototype))(vectorValue)
      assert.equal(listValue.constructor.name, 'TList<' + ItemPrototype.name + '>')
      os.writeList(tag, listValue)
      os.writeList(tag + 1, listValue)
      tag += 4
    })
    let is = new TModel.TInputStream(os.tBuffer)
    tag = 0
    ItemPrototypes.forEach((ItemPrototype, index) => {
      let listValueRequire = is.readList(tag + 1, true, TList(ItemPrototype), 'default Value')
      let listValueOptionalNotExist = is.readList(tag + 2, false, TList(ItemPrototype), 'default Value')
      assert.throws(() => is.readList(tag + 3, true, TList(ItemPrototype), 'default Value'))
      assert.deepEqual(listValueRequire.valueOf(), vectorValues[index], 'require is not equal in tag ' + (tag + 1))
      assert.deepEqual(listValueOptionalNotExist.valueOf(), 'default Value', 'optional not exist is not equal in tag ' + (tag + 2))
      tag += 4
    })
  })
  it('map', () => {
    const t = (start, end, startV, endV) => {
      const { TInt8, TInt16, TInt32, TInt64, TUInt8, TUInt16, TUInt32, TFloat, TDouble, TString, TList, TMap } = TModel
      const KeyPrototypes = ([TInt8, TInt16, TInt32, TInt64, TUInt8, TUInt16, TUInt32, TFloat, TDouble, TString, TList(TInt8), TMap(TString, TInt8), DemoStruct]).slice(start, end)
      const ValuePrototypes = ([TInt8, TInt16, TInt32, TInt64, TUInt8, TUInt16, TUInt32, TFloat, TDouble, TString, TList(TInt8), TMap(TString, TInt8), DemoStruct]).slice(startV, endV)

      const vectorValues = ([
        int8Values,
        int16Values,
        int32Values,
        int64Values,
        uint8Values,
        uint16Values,
        uint32Values,
        floatValues,
        doubleValues,
        stringValues,
        int8Values.map((i, index) => ([i, i])),
        stringValues.map((s, index) => {
          let ret = {}
          ret[s] = int8Values[index]
          return ret
        }),
        structValues
      ])
      const keyValues = vectorValues.slice(start, end)
      const valueValues = vectorValues.slice(startV, endV)

      const testCases = []

      KeyPrototypes.forEach((KeyPrototype, ki) => {
        let keys = keyValues[ki]
        ValuePrototypes.forEach((ValuePrototype, vi) => {
          let values = valueValues[vi]
          let map = new (TMap(KeyPrototype, ValuePrototype))()
          keys.forEach((k, i) => {
            if (i < values.length) {
              map.put(k, values[i])
            }
          })
          testCases.push({
            KeyPrototype,
            ValuePrototype,
            map
          })
        })
      })

      let os = new TModel.TOutputStream()
      let tag = 0
      testCases.forEach(({ map }) => {
        os.writeMap(tag, map)
        os.writeMap(tag + 1, map)
        tag += 4
      })
      tag = 0
      let is = new TModel.TInputStream(os.tBuffer)
      testCases.forEach(({ map, KeyPrototype, ValuePrototype }) => {
        let mapValueRequire = is.readMap(tag + 1, true, TMap(KeyPrototype, ValuePrototype), 'default Value')
        let mapValueOptionalNotExist = is.readMap(tag + 2, false, TMap(KeyPrototype, ValuePrototype), 'default Value')
        assert.throws(() => is.readMap(tag + 3, true, TMap(KeyPrototype, ValuePrototype), 'default Value'))
        assert.deepEqual(mapValueRequire, map.valueOf(), 'require is not equal in tag ' + (tag + 1))
        assert.deepEqual(mapValueOptionalNotExist, 'default Value', 'optional not exist is not equal in tag ' + (tag + 2))
        tag += 4
      })
    }
    t(0, 8, 0, 8)
    t(7, 14, 7, 14)
  }).timeout(10000)
  it('struct', () => {
    let os = new TModel.TOutputStream()
    structValues.forEach((v, index) => {
      if (index % 3 === 0) {
        os.writeStruct(index, v, DemoStruct)
      }
    })
    let is = new TModel.TInputStream(os.tBuffer)
    structValues.forEach((v, index) => {
      if (index % 2 === 0) {
        let isRequire = (index % 3 === 0)
        let actual = is.readStruct(index, isRequire, DemoStruct, 'default value')
        let expected = isRequire ? v : 'default value'
        assert.deepEqual(actual, expected)
      }
    })
  })
  it('bytes', () => {
    let { TBytes } = TModel
    let os = new TModel.TOutputStream()
    let bytesValues = [Buffer.from(int8Values), Buffer.from(int16Values), Buffer.from(int32Values)]
    let tag = 0
    bytesValues.forEach(bytesValue => {
      new TBytes(bytesValue).write(os, tag)
      new TBytes(bytesValue).write(os, tag + 1)
      tag += 4
    })
    tag = 0
    let is = new TModel.TInputStream(os.tBuffer)
    bytesValues.forEach(bytesValue => {
      let bytesValueRequire = TBytes.read(is, tag + 1, true, 'default value')
      let bytesValueOptionalNotExist = TBytes.read(is, tag + 2, false, 'default value')
      assert.throws(() => TBytes.read(is, tag + 3, true, 'default value'))
      assert.deepEqual(bytesValueRequire, bytesValue)
      assert.deepEqual(bytesValueOptionalNotExist, 'default value')
      tag += 4
    })
  })
})
