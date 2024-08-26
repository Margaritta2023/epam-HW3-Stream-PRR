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
    while (this.currIndex < 100) {
      const chunk = `Chunk ${this.currIndex++}\n`;
      console.log(`Pushing: ${chunk}`);
         
      if (!this.push(chunk)) {
        console.log('Backpressure applied. Pausing readable stream.');
        return;
      }
    }
      this.push(null);
  }
}

// CUSTOM WRITABLE CLASS
class MyWritableSlow extends Writable {
  constructor() {
    super({ highWaterMark: 5 }); 
  }

  write(chunk, encoding, callback) {
    console.log(`Writing: ${chunk.toString()}`);

    setTimeout(callback, 500);
  }
}

const fastReadable = new MyReadableFast();
const slowWritable = new MyWritableSlow();

fastReadable.pipe(slowWritable);

fastReadable.on('data', (chunk) => {
 
  const canContinue = slowWritable.write(chunk);

  if (!canContinue) {
    console.log('Writable stream full, pausing readable stream.');
    fastReadable.pause();
  }
});

slowWritable.on('drain', () => {
  console.log('Drain event fired, resuming readable stream.');
  fastReadable.resume();
});

slowWritable.on('finish', () => {
  console.log('All chunks written.');
});

fastReadable.on('error', (err) => {
  console.error('Can not read the stream', err.message);
});

slowWritable.on('error', (err) => {
  console.error('Can not write the stream', err.message);
});
