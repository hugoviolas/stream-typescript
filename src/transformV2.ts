import { createReadStream, createWriteStream } from "fs";
import { Transform, TransformCallback } from "stream";
const JSONStream = require("JSONStream");

interface Countries {
  id: number;
  first_name: string;
  last_name: string;
  country: string;
}

// interface for chunk argument in _transform method from Modify class
interface Model {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
}

//check chunk type validity ???
class Modify extends Transform {
  _transform(
    chunk: Model,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    const data = {
      id: chunk.id,
      first_name: chunk.first_name,
      last_name: chunk.last_name,
    };
    this.push(data);
    callback();
  }
}

const read = createReadStream("countries.json");
const write = createWriteStream("copy.json");
const modify = new Modify({ objectMode: true });
const parser = JSONStream.parse("*");
const stringify = JSONStream.stringify();

read.pipe(parser).pipe(modify).pipe(stringify).pipe(write);

// Count users with France as country
// let count: number = 0;
// const obj: { [key: string]: number } = {};

// read.pipe(parser).on("data", (chunk: Countries) => {
//   if (chunk.country in obj) {
//     obj[chunk.country] += 1;
//   } else {
//     obj[chunk.country] = 1;
//   }
//   if (chunk.country === "France") {
//     count += 1;
//   }
// });

// read.on("end", () => {
//   console.log(`There are ${count} french people here`);
//   console.log(obj);
// });
