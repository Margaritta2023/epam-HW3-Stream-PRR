// 3. Implementing Basic Back Pressure
// Task: Implement a readable and a writable stream where the writable stream deliberately
// writes data slower than the readable reads it, demonstrating how back pressure is managed.
const { Readable, Writable } = require('stream');

// CUSTOM READABLE CLASS
class MyReadableFast extends Readable {
  constructor() {
    super();
    this.currIndex = 0;
  }

  read(size) {
    if (this.currIndex < 100) {
      const chunk = `Chunk ${this.currIndex++}\n`;
      console.log(`Pushing: ${chunk}`);
      this.push(chunk);
    } else {
      this.push(null); 
    }
  }
}

// CUSTOM WRITABLE CLASS
class MyWritableSlow extends Writable {
  constructor() {
    super();
  }

  write(chunk, coding, callback) {
    console.log(`Writing: ${chunk.toString()}`);
    setTimeout(callback, 500); 
  }
}

const fastReadable = new MyReadableFast();
const slowWritable = new MyWritableSlow();


fastReadable.pipe(slowWritable);

slowWritable.on('finish', () => {
  console.log('All chunks written.');
});

fastReadable.on('error', (err) => {
  console.error('Can not read the stream', err.message);
});

slowWritable.on('error', (err) => {
  console.error('Can not write the stream ', err.message);
});

