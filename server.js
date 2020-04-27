// this file creates a server using express and writes frontend code to that server using express methods
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const engines = require('consolidate')
const ejs = require('ejs')

app.engine('ejs', engines.ejs)
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')


app.use(express.static('C:/CA_Premium/tides_vis/public'))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res, next) => {
    res.sendFile('C:/CA_Premium/tides_vis/public/index.html')
})


app.get('/geolocate', (req, res, next) => {
  res.render('user_location.ejs')
})


app.get('/test', db.getStationByGeocode)

app.listen(8000, () => console.log('server running'))
