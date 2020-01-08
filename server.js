// THIS FILE CREATES AN HTTP SERVER USING NODE \\

const http = require('http'); // dependency to create an http server
let { requestListener } = require('./nodeFileSystem.js'); // create a requestListener object that is imported from nodeFS.js

const PORT = process.env.PORT || 8000; // access the client's environment and set up a port to be used later

const server = http.createServer(requestListener)

setTimeout((handler) => { server.listen(PORT) }, 3000) // run the webserver and have it listen for a request from port 8000