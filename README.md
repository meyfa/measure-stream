# measure-stream

[![CI](https://github.com/meyfa/measure-stream/actions/workflows/main.yml/badge.svg)](https://github.com/meyfa/measure-stream/actions/workflows/main.yml)

A duplex (Transform) stream for Node.js that measures the data passing through it
and emits that info accordingly. The following properties are available:

* **chunks** - The number of processed chunks up until and including the one
    that triggered the event.
* **totalLength** - The sum of all chunk lengths. Will be 0 if the chunks are
    something other than strings or buffers.


## Install

```
npm i measure-stream
```


## Usage

```javascript
const MeasureStream = require('measure-stream')

const stream = new MeasureStream()
stream.on('measure', function (info) {
  console.log('chunk count:', info.chunks)
  console.log('total length:', info.totalLength)
})

// You can then use 'stream' as you normally would, e.g.
// ('source' is readable and 'target' is writable):
source.pipe(stream).pipe(target)
```

As you can see, just one additional `.pipe()` call required to make it work!

Additionally, the last `measurement` is always available as a stream property.
For example, if all you need is the total size after a stream has been
processed:

```javascript
stream.on('finish', function () {
  const bytes = stream.measurements.totalLength
})
```
