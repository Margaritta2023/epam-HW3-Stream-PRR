// 2. Transform Streams Homework
// Task: Create a Node.js script that uses a transform stream to handle JSON objects, modifying each one by
// adding a new property timestamp and converting it back into a string before writing it to an output file.

const fs = require('fs');
const { Transform } = require('stream');

// CREATE TRANSFOR STREAM
const transformedStream = new Transform({
  objectMode: true, // fixed objectMode
  transform(chunk, coding, callback) {
    try { 
      
      chunk.timestamp = new Date().toISOString();
      this.push(chunk)
      callback();
      
    } catch (err) {
      callback(err.message);
    }
  }
});

// CREATE READ AND WRITE STREAMS
const readStream = fs.createReadStream('./task2/data.json', { encoding: 'utf8' });
const writeToStream = fs.createWriteStream('./task2/writeTo.json');

readStream.pipe(transformedStream).pipe(writeToStream);

writeToStream.on('finish', () => {
  console.log('Transformed and written to writeTo.json');
});

readStream.on('error', (err) => {
  console.error( err.message);
});

transformedStream.on('error', (err) => {
  console.error(err.message);
});

writeToStream.on('error', (err) => {
  console.error(err.message);
});
