import { Transform, TransformCallback } from 'node:stream'

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
  private _chunkCount = 0
  private _totalLength = 0

  /**
   * Measurements object, containing number of chunks (`chunks`) and total
   * number of processed bytes (`totalLength`).
   *
   * @type {Object}
   */
  get measurements (): { chunks: number, totalLength: number } {
    return {
      chunks: this._chunkCount,
      totalLength: this._totalLength
    }
  }

  override _transform (chunk: any, encoding: BufferEncoding, cb: TransformCallback): void {
    ++this._chunkCount
    if (chunk != null && typeof chunk.length === 'number') {
      this._totalLength += chunk.length as number
    }
    this.emit('measure', this.measurements)

    cb(null, chunk)
  }

  override _flush (cb: TransformCallback): void {
    // make sure 'measure' was emitted at least once before closing
    if (this._chunkCount === 0) {
      this.emit('measure', this.measurements)
    }
    cb()
  }
}

export = MeasureStream
