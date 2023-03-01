"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const stream_1 = require("stream");
const JSONStream = require("JSONStream");
let count = 0;
class ModifyJson extends stream_1.Transform {
    _transform(chunk, encoding, callback) {
        if (chunk.name === "Hugo") {
            chunk.age = chunk.age + count;
            count += 1;
        }
        this.push(chunk);
        callback();
    }
}
class changeObjectFormat extends stream_1.Transform {
    _transform(chunk, encoding, callback) {
        const data = {
            id: chunk.id,
            first_name: chunk.first_name,
            last_name: chunk.last_name,
            ip_address: chunk.ip_address,
        };
        this.push(data);
        callback();
    }
}
const modify = new ModifyJson({ objectMode: true, highWaterMark: 1024 });
const readStream = (0, fs_1.createReadStream)("hugo.json");
const writeStream = (0, fs_1.createWriteStream)("copy-hugo.json");
const parser = JSONStream.parse("*");
const stringify = JSONStream.stringify();
readStream.pipe(parser).pipe(modify).pipe(stringify).pipe(writeStream);
let drainCount = 0;
let pauseCount = 0;
let error = 0;
modify.on("drain", () => {
    drainCount += 1;
});
modify.on("pause", () => {
    pauseCount += 1;
});
modify.on("error", () => {
    error += 1;
});
writeStream.on("finish", () => {
    console.log("Pauses: ", pauseCount);
    console.log("Drain: ", drainCount);
    console.log("Hugo.json transformed");
});
const change = new changeObjectFormat({
    objectMode: true,
    highWaterMark: 1024,
});
const dataReadStream = (0, fs_1.createReadStream)("BigData.json");
const dataWriteStream = (0, fs_1.createWriteStream)("BigData_copy.json");
const dataParser = JSONStream.parse("*");
const dataStringify = JSONStream.stringify();
const resume = (0, fs_1.createWriteStream)("resume.txt");
dataReadStream
    .pipe(dataParser)
    .pipe(change)
    .pipe(dataStringify)
    .pipe(dataWriteStream);
dataParser.on("data", (chunk) => {
    console.log("New chunk: ", chunk);
});
let dataDrain = 0;
change.on("drain", () => {
    dataDrain += 1;
});
dataWriteStream.on("finish", () => {
    console.log("Data drain: ", dataDrain);
    console.log("BigData.json transformed");
    let errorString;
    if (error === 0) {
        errorString = "No errors emitted";
    }
    else if (error === 1) {
        errorString = "1 error emitted";
    }
    else {
        errorString = `${error} errors emitted`;
    }
    resume.write(`${errorString},\nData drain: ${dataDrain},\nBigData.json transformed,\nDrain: ${drainCount},\nPause: ${pauseCount},\nHugo.json transformed.`);
});
// let data: any;
// readStream.on("data", async (chunk) => {
//   data = chunk;
//   console.log(data);
// });
// const w = async () => {
//   for (let i = 0; i < 100; i++) {
//     const overWatermark = writeStream.write();
//     if (!overWatermark) {
//       await new Promise<void>((resolve) => {
//         writeStream.once("drain", resolve);
//       });
//     }
//     console.log(overWatermark);
//   }
// };
// w();
