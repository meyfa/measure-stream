import assert from 'node:assert'
import { once } from 'node:events'
import { PassThrough } from 'node:stream'
import { describe, it } from 'node:test'
import MeasureStream from '../src/index.ts'

void describe('MeasureStream', () => {
  void it('should pass through all chunks unmodified', () => {
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

  void it('should emit \'measure\' events', async () => {
    const obj = new MeasureStream()

    const measureEvent = once(obj, 'measure')

    const data = new PassThrough()
    data.pipe(obj)

    data.end(Buffer.alloc(42))

    const [event] = await measureEvent
    assert.deepStrictEqual(event, {
      chunks: 1,
      totalLength: 42
    })
  })

  void it('should emit an event even for empty streams', async () => {
    const obj = new MeasureStream()

    const measureEvent = once(obj, 'measure')

    const data = new PassThrough()
    data.pipe(obj)

    data.end()

    const [event] = await measureEvent
    assert.deepStrictEqual(event, {
      chunks: 0,
      totalLength: 0
    })
  })

  void it('should have a \'measurements\' property', () => {
    const obj = new MeasureStream()

    assert.deepStrictEqual(obj.measurements, {
      chunks: 0,
      totalLength: 0
    })
  })

  void it('should update the \'measurements\' property', () => {
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

  void it('should not have measurements setter', () => {
    const obj = new MeasureStream()
    assert.throws(() => {
      (obj as any).measurements = {}
    })
  })

  void it('should use object copy in \'measure\' event', async () => {
    const obj = new MeasureStream()

    const measureEvent = once(obj, 'measure')

    const data = new PassThrough()
    data.pipe(obj)

    data.end(Buffer.alloc(42))

    const [event] = await measureEvent
    event.chunks = 5
    event.totalLength = 30
    assert.deepStrictEqual(obj.measurements, {
      chunks: 1,
      totalLength: 42
    })
  })
})
