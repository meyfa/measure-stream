'use strict'

const { Transform } = require('stream')

/**
 * Duplex (Transform) stream that emits a 'measure' event on every chunk of data.
 *
 * The data itself is pushed through as-is.
 *
 * The event consists of an object with the following properties:
 * - chunks: the number of processed chunks, including the current one
 * - totalLength: the length of all processed chunks added up
 */
class MeasureStream extends Transform {
  /**
   * Constructs a new measure stream.
   *
   * @param {Object} options Stream options.
   */
  constructor (options) {
    super(options)

    this._chunkCount = 0
    this._totalLength = 0
  }

  /**
   * Measurements object, containing number of chunks (`chunks`) and total
   * number of processed bytes (`totalLength`).
   *
   * @type {Object}
   */
  get measurements () {
    return {
      chunks: this._chunkCount,
      totalLength: this._totalLength
    }
  }

  /**
   * @override
   */
  _transform (chunk, encoding, cb) {
    ++this._chunkCount
    if (chunk && chunk.length) {
      this._totalLength += chunk.length
    }
    this.emit('measure', this.measurements)

    cb(null, chunk)
  }

  /**
   * @override
   */
  _flush (cb) {
    // make sure 'measure' was emitted at least once before closing
    if (this._chunkCount === 0) {
      this.emit('measure', this.measurements)
    }
    cb()
  }
}

module.exports = MeasureStream
