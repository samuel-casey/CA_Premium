// this file creates a server using express and writes frontend code to that server using express methods
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const engines = require('consolidate')
const ejs = require('ejs')
const timeCalc = require('./times')

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


app.post('/station', async (req, res, next) => {
  const station = await db.getStationByGeocode(req.body);
  console.log(`station: ${station}`);
  res.status(200).send(station);
})

app.post('/times', async (req, res, next) => {
  const timeAtStation = await timeCalc.calcTimeAtStation(req.body);
  console.log(`timeAtStation: ${timeAtStation}`);
  res.status(200).send(timeAtStation);
})

app.post('/stationData', async (req, res, next) => {
  const stationId = await db.getStationByGeocode(req.body);
  const timeAtStation = await timeCalc.calcTimeAtStation(req.body);
  const stationLookup = await db.getStationData(stationId, timeAtStation);
  const stationData = stationLookup
  res.status(200).send(stationData);
})

app.listen(8000, () => console.log('server running'))
