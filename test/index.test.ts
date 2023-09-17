import assert from 'node:assert'
import { PassThrough } from 'node:stream'
import MeasureStream from '../src/index.js'

describe('MeasureStream', function () {
  it('should pass through all chunks unmodified', function () {
    const obj = new MeasureStream()

    const source = new PassThrough()
    const target = new PassThrough()

    source.pipe(obj).pipe(target)

    source.write('hello ', 'utf8')
    source.write('world', 'utf8')
    source.end('!', 'utf8')

    const expected = Buffer.from('hello world!', 'utf8')
    assert.ok(expected.equals(target.read()))
  })

  it("should emit 'measure' events", function (done) {
    const obj = new MeasureStream()

    obj.on('measure', function (event) {
      assert.deepStrictEqual(event, {
        chunks: 1,
        totalLength: 42
      })
      done()
    })

    const data = new PassThrough()
    data.pipe(obj)

    data.end(Buffer.alloc(42))
  })

  it('should emit an event even for empty streams', function (done) {
    const obj = new MeasureStream()

    obj.on('measure', function (event) {
      assert.deepStrictEqual(event, {
        chunks: 0,
        totalLength: 0
      })
      done()
    })

    const data = new PassThrough()
    data.pipe(obj)

    data.end()
  })

  it("should have a 'measurements' property", function () {
    const obj = new MeasureStream()

    assert.deepStrictEqual(obj.measurements, {
      chunks: 0,
      totalLength: 0
    })
  })

  it("should update the 'measurements' property", function () {
    const obj = new MeasureStream()

    const data = new PassThrough()
    data.pipe(obj)

    data.write(Buffer.alloc(21))
    data.end(Buffer.alloc(21))

    assert.deepStrictEqual(obj.measurements, {
      chunks: 2,
      totalLength: 42
    })
  })

  it('should not have measurements setter', function () {
    const obj = new MeasureStream()
    assert.throws(() => {
      (obj as any).measurements = {}
    })
  })

  it("should use object copy in 'measure' event", function (done) {
    const obj = new MeasureStream()

    obj.on('measure', function (event) {
      event.chunks = 5
      event.totalLength = 30
      assert.deepStrictEqual(obj.measurements, {
        chunks: 1,
        totalLength: 42
      })
      done()
    })

    const data = new PassThrough()
    data.pipe(obj)

    data.end(Buffer.alloc(42))
  })
})
