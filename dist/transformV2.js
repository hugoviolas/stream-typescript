"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const stream_1 = require("stream");
const JSONStream = require("JSONStream");
class Modify extends stream_1.Transform {
    _transform(chunk, encoding, callback) {
        const data = {
            id: chunk.id,
            first_name: chunk.first_name,
            last_name: chunk.last_name,
        };
        this.push(data);
        callback();
    }
}
const read = (0, fs_1.createReadStream)("countries.json");
const write = (0, fs_1.createWriteStream)("copy.json");
const modify = new Modify({ objectMode: true });
const parser = JSONStream.parse("*");
const stringify = JSONStream.stringify();
//read.pipe(parser).pipe(modify).pipe(stringify).pipe(write);
// Count users with France as country
let count = 0;
const obj = {};
read.pipe(parser).on("data", (chunk) => {
    if (chunk.country in obj) {
        obj[chunk.country] += 1;
    }
    else {
        obj[chunk.country] = 1;
    }
    if (chunk.country === "France") {
        count += 1;
    }
});
read.on("end", () => {
    console.log(`There are ${count} french people here`);
    console.log(obj);
});
