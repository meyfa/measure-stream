"use strict";

const expect = require("chai").expect;
const PassThrough = require("stream").PassThrough;

const MeasureStream = require("../index.js");

describe("MeasureStream", function () {

    it("should emit 'measure' events", function (done) {
        const obj = new MeasureStream();

        obj.on("measure", function (event) {
            expect(event).to.deep.equal({
                chunks: 1,
                totalLength: 42,
            });
            done();
        });

        const data = new PassThrough();
        data.pipe(obj);

        data.end(Buffer.alloc(42));
    });

    it("should emit an event even for empty streams", function (done) {
        const obj = new MeasureStream();

        obj.on("measure", function (event) {
            expect(event).to.deep.equal({
                chunks: 0,
                totalLength: 0,
            });
            done();
        });

        const data = new PassThrough();
        data.pipe(obj);

        data.end();
    });

    it("should have a 'measurements' property", function () {
        const obj = new MeasureStream();

        expect(obj).to.have.a.property("measurements").that.deep.equals({
            chunks: 0,
            totalLength: 0,
        });
    });

    it("should update the 'measurements' property", function () {
        const obj = new MeasureStream();

        const data = new PassThrough();
        data.pipe(obj);

        data.write(Buffer.alloc(21));
        data.end(Buffer.alloc(21));

        expect(obj).to.have.a.property("measurements").that.deep.equals({
            chunks: 2,
            totalLength: 42,
        });
    });

});
