"use strict";

const Transform = require("stream").Transform;
const util = require("util");

/**
 * Constructs a new duplex (Transform) stream that emits a 'measure' event on
 * every chunk of data.
 *
 * The data itself is pushed through as-is.
 *
 * The event consists of an object with the following properties:
 * - chunks: the number of processed chunks, including the current one
 * - totalLength: the length of all processed chunks added up
 */
function MeasureStream(options) {
    Transform.call(this, options);

    this.measurements = {
        chunks: 0,
        totalLength: 0,
    };
}

util.inherits(MeasureStream, Transform);

MeasureStream.prototype._transform = function (chunk, encoding, cb) {

    // measure
    this.measurements.chunks++;
    if (chunk && chunk.length) {
        this.measurements.totalLength += chunk.length;
    }

    // notify
    this.emit("measure", this.measurements);

    // continue
    cb(null, chunk);

};

MeasureStream.prototype._flush = function (cb) {
    // make sure 'measure' was emitted at least once before closing
    if (this.measurements.chunks === 0) {
        this.emit("measure", this.measurements);
    }
    cb();
};

module.exports = MeasureStream;
