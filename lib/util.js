const createBuffer = data => {
  if (!isNaN(parseInt(data, 10))) {
    return Buffer.allocUnsafe(parseInt(data, 10))
  }
  if (Array.isArray(data) || Buffer.isBuffer(data) || typeof data === 'string' || data instanceof ArrayBuffer) {
    return Buffer.from(data)
  }
  throw new Error(`can not create buffer by ${typeof data} in nodejs`)
}

module.exports = {
  createBuffer
}
