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
    .then( (results) => 
    {
      
      stationData = {
        'station_id': results.rows[0]['station_id'].trim(),
        'station_name': results.rows[0]['station_name'].trim()
      }
      
      return stationData
    }
    )
    .catch(error => console.log(error));
};

function getStationNextData(stationId, timeAtStation) {
  const today = timeAtStation.toString()
  return pool.query(`SELECT * FROM _${stationId}_2020 WHERE date_time > '${today}' LIMIT 1`)
  .then( (results) => results.rows[0]['date_time'].trim())
  .catch(error => console.log(error))
  
};

function getStationLastData(stationId, timeAtStation) {
  const today = timeAtStation.toString()
  return pool.query(`SELECT * FROM _${stationId}_2020 WHERE date_time < '${today}' ORDER BY date_time DESC LIMIT 1`)
  .then( (results) => results.rows[0]['date_time'].trim())
  .catch(error => console.log(error))
};

  
module.exports = { getStationByGeocode, getStationNextData, getStationLastData}
