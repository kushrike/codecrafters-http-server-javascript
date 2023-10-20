const net = require("net");
const fs = require("fs");
const paths = require('path');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const args = process.argv.slice(2);

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const request = data.toString().split("\r\n");
        const requestLine = request[0].split(" ");
        const headers = request.slice(1);
        const path = requestLine[1];
        const method = requestLine[0];

        if (path === "/") {
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
        } 

        else if(path.startsWith("/echo/")) {
          const str = path.substring(6);
          socket.write("HTTP/1.1 200 OK\r\n");
          socket.write("Content-Type: text/plain\r\n");
          socket.write(`Content-Length:${str.length}\r\n\r\n`);
          socket.write(str);
        }
        
        else if(path === "/user-agent") {
          const userAgentLine = request.filter(x => x.startsWith("User-Agent:"));
          const str = userAgentLine[0].split(": ")[1];
          socket.write("HTTP/1.1 200 OK\r\n");
          socket.write("Content-Type: text/plain\r\n");
          socket.write(`Content-Length:${str.length}\r\n\r\n`);
          socket.write(str);
        }

        else if(path.startsWith("/files/")) {
          if(method == "GET") {
            const filename = path.substring(7);
            if(fs.existsSync(paths.join(args[1], filename))) {
              const fileContent = fs.readFileSync(paths.join(args[1], filename));
              socket.write("HTTP/1.1 200 OK\r\n");
              socket.write("Content-Type: application/octet-stream\r\n");
              socket.write(`Content-Length:${fileContent.length}\r\n\r\n`);
              socket.write(fileContent);
            } else {
              socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            }
sxx          } else if(method ===  "POST") {
            const filename = path.substring(7);
            const location = paths.join(args[1], filename)
            fs.writeFileSync(location, headers[headers.length - 1]);
            socket.write("HTTP/1.1 201 Created\r\n\r\n");
          }
      }

        else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
        socket.end();
    });

    socket.on("close", () => {
      socket.end();
      // server.close();
    });
});

server.listen(4221, "localhost");
