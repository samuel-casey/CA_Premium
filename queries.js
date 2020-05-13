const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tidal_data',
  password: 'dataBoi',
  port: 5432,
})

function timeToNumber(timeString) {
  let number = 0;
  for (let i = 0; i < timeString.length; i++) {
    if (timeString[i] != ':') {number += timeString[i]};
  }
  number -= 0;
  return number;
}

const stations_table = "station_metadata"
let station_data = 8443970; // boston as test value

async function getStationByGeocode(coordinates) {
    let {lat, lon} = await coordinates;
    
    if (lat[0] != '-' && lat[2] == '.' && lat.length == 4){
      lat += '00';
    }
    
    if (lat[0] != '-' && lat[2] == '.' && lat.length == 5){
      lat += '0';
    }
  
    //lon
    if (lon[0] != '-' && lon[2] == '.' && lon.length == 4){
      lon += '00';
    }
    
    if (lon[0] != '-' && lon[2] == '.' &&lon.length == 5){
      lon += '0';
    }
  
    //positive triple digits//
  
    //lat
    if (lat[0] != '-' && lat[3] == '.' && lat.length == 5){
      lat += '00';
    }
  
    if (lat[0] != '-' && lat[3] == '.' && lat.length == 6){
      lat += '0';
    }
  
    //lon
    if (lon[0] != '-' && lon[3] == '.' && lon.length == 5){
      lon += '00';
    }
  
    if (lon[0] != '-' && lon[3] == '.' && lon.length == 6){
      lon += '0';
    }
  
    //negative double digits//
  
    //lat
    if (lat[0] == '-' && lat[3] == '.' && lat.length == 5) {
      lat += '00';
    }
  
    if (lat[0] == '-' && lat[3] == '.' && lat.length == 6) {
      lat += '0';
    }
  
    //lon
    if (lon[0] == '-' && lon[3] == '.' && lon.length == 5) {
      lon += '00';
    }
  
    if (lon[0] == '-' && lon[3] == '.' && lon.length == 6) {
      lon += '0';
    }

    //negative triple digits//
  
    //lat
    if (lat[0] == '-' && lat[4] == '.' && lat.length == 6) {
      lat += '00';
    }
  
    if (lat[0] == '-' && lat[4] == '.' && lat.length == 7) {
      lat += '0';
    }
  
    //lon
  
    if (lon[0] == '-' && lon[4] == '.' && lon.length == 6) {
      lon += '00';
    }
  
    if (lon[0] == '-' && lon[4] == '.' && lon.length == 7) {
      lon += '0';
    }

    return pool.query(`SELECT * FROM ${stations_table} WHERE lat = $1 AND lon = $2`, [lat, lon])
    .then(results => results.rows[0]['station_id'].trim())
    .catch(error => console.log(error));
};

function getStationData(stationId, timeAtStation) {
  const dt = timeAtStation.toString()
  const today = dt.slice(0,11)
  const timeNow = dt.slice(today.length - 1).trim()
  const timeNowNum = timeToNumber(timeNow)

  let daysTides = []
  return pool.query(`SELECT * FROM _${stationId}_2020 WHERE date_time LIKE '${today}%'`)
  .then( (results) => {

    console.log(`results length: ${results.rows.length}`)

    let firstTide = results.rows[0]['date_time'].trim()
    let firstTideTime = firstTide.slice(firstTide.length - 5)
    let firstTideTimeNum = timeToNumber(firstTideTime);
    console.log(`first tide: ${firstTideTime}`)

    let secondTide = results.rows[1]['date_time'].trim()
    let secondTideTime = secondTide.slice(secondTide.length - 5)
    let secondTideTimeNum = timeToNumber(secondTideTime);
    console.log(`second tide: ${secondTideTime}`)

    let thirdTide = results.rows[2]['date_time'].trim()
    let thirdTideTime = thirdTide.slice(thirdTide.length - 5)
    let thirdTideTimeNum = timeToNumber(thirdTideTime);
    console.log(`third tide: ${thirdTideTime}`)

    let fourthTide = results.rows[3]['date_time'].trim()
    let fourthTideTime = fourthTide.slice(fourthTide.length - 5)
    let fourthTideTimeNum = timeToNumber(fourthTideTime);
    console.log(`fourth tide: ${fourthTideTime}`)

    let tideTimeNums = [firstTideTimeNum, secondTideTimeNum, thirdTideTimeNum, fourthTideTimeNum]
    let closestPrevious = 0 
    let closestNext = 0

    for (let n = 0; n < tideTimeNums.length; n++) {
      let difference = timeNowNum - tideTimeNums[n]
      if (difference <= 0 && difference > -601) {
        closestNext = tideTimeNums[n]
      }

      if (difference >= 0 && difference < 600) {
        closestPrevious = tideTimeNums[n]
      }
    }
    
    console.log(closestNext)
    console.log(closestPrevious)

    let lastNext = {
      'last': closestPrevious,
      'next': closestNext
    }

    return lastNext
  }
  )
  .catch(error => console.log(error))
  
};

  
module.exports = { getStationByGeocode, getStationData }
