# measure-stream

[![Build Status](https://travis-ci.org/meyfa/measure-stream.svg?branch=master)](https://travis-ci.org/meyfa/measure-stream)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8a458e83d62bf8a2c619/test_coverage)](https://codeclimate.com/github/meyfa/measure-stream/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/8a458e83d62bf8a2c619/maintainability)](https://codeclimate.com/github/meyfa/measure-stream/maintainability)

A duplex (Transform) stream for Node that measures the data passing through it
and emits that info accordingly. The following properties are available:

* **chunks** - The number of processed chunks up until and including the one
    that triggered the event.
* **totalLength** - The sum of all chunk lengths. Will be 0 if the chunks are
    something other than strings or buffers.



## Install

```
npm install --save measure-stream
```



## Usage

```javascript
var MeasureStream = require("measure-stream");

var stream = new MeasureStream();
stream.on("measure", function (info) {
    console.log("chunk count:", info.chunks);
    console.log("total length:", info.totalLength);
});

// You can then use 'stream' as you normally would, e.g.
// ('source' is readable and 'target' is writable):
source.pipe(stream).pipe(target);
```

As you can see, just one additional `.pipe()` call required to make it work!

Additionally, the last `measurement` is always available as a stream property.
For example, if all you need is the total size after a stream has been
processed:

```javascript
stream.on("finish", function () {
    var bytes = stream.measurements.totalLength;
});
```



## License

MIT License

Copyright (c) 2016 - 2018 Fabian Meyer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
