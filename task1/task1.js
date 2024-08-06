// 1. Basic Stream Operations
// Task: Write a simple Node.js script using the `fs` module to read a text file
//  and write it to another text file using streams.(Do this with and without pipes)

const fs = require('fs');

// CREATE STREAMS
const readStream = fs.createReadStream('./readStream.txt');
const writeStream = fs.createWriteStream('./writeStream.txt');


readStream.on('data', (chunk) => {
  writeStream.write(chunk);
});

readStream.on('end', () => {
  writeStream.end();
  console.log('File copied successfully!');
});

// ERROR HANDLING
readStream.on('error', (err) => {
  console.error("Can not read:",err.message);
});

writeStream.on('error', (err) => {
  console.error("Can not read:", err.message);
});
