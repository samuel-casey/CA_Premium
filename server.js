// this file creates a server using express and writes frontend code to that server using express methods

const express = require('express')
const app = express()
app.use(express.static('C:/CA_Premium/tides_vis/public'))

app.get('/', (req, res, next) => {
    res.sendFile('C:/CA_Premium/tides_vis/public/index.html')
})

// const html = require('./public/index.html')
// console.log(html)

// create a router
// const router = express.Router()
// app.use('/', router);

// create html variable to dynamically change index.html route for testing purposes

// router.use(express.static('public'))

// router.get('/', (req, res, next) => {
//     res.send(html);
//     console.log('sent html file');
// });

app.listen(8000, () => console.log('server running'))