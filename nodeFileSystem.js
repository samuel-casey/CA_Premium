// THIS FILE CREATES A FILE SYSTEM USING NODE \\

const fs = require('fs'); // import filesystem package from Node

let serveHTML = new Promise((data) => {
    setTimeout(() => {
        const handler = (req, res) => {
            fs.readFile('./index.html', 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`${err}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                }
            })
        };
    }, 1000);
});

let serveCSS = new Promise((data) => {
    setTimeout(() => {
        const handler = (req, res) => {
            fs.readFile('./style.css', 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.write(`${err}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.write(data);
                    res.end();
                }
            })
        };
    }, 2000);
});

let requestListener = new Promise((serveFiles) => {
    [serveHTML, serveCSS]
})


module.exports = { requestListener }