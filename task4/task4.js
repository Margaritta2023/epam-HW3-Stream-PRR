// 4. HTTP Streaming
// Task: Create an HTTP server using the `http` module that streams a large file 
// to the client upon request instead of loading it into memory all at once.

const path = require('path');
const http = require('http');
const fs = require('fs');

const filePath = path.join(__dirname, 'bigData.txt');

// CREATE SERVER
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/bigData') {
    const readStream = fs.createReadStream(filePath);

    readStream.on('error', (err) => {
      console.error('Error while reading file:', err.message);
      res.statusCode = 500;
      res.end('Unknown Server Error');
    });

    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });

    readStream.pipe(res);

    readStream.on('end', () => {
      console.log('File streaming completed successfully!');
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

