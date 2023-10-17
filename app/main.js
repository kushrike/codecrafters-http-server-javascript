const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const request = data.toString().split("\r\n");
        const requestLine = request[0].split(" ");
        const path = requestLine[1];

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
