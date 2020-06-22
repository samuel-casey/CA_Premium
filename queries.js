const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

const stations_table = "station_metadata"

async function getStationByGeocode(coordinates) {
    
    const coords = await addZeroes(coordinates.lat, coordinates.lon)

    return pool.query(`SELECT * FROM ${stations_table} WHERE lat = $1 AND lon = $2`, [coords.latitude, coords.longitude])
    .then( (results) => 
    {

      stationData = {
        'station_id': results.rows[0]['station_id'].trim(),
        'station_name': results.rows[0]['station_name'].trim(),
        'range_size': results.rows[0]['range_size']
      }
      
      return stationData
    }
    )
    .catch(error => console.log(error));
};

function addZeroes(lat, lon) {
  lat = lat.toString()
  lon = lon.toString()

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

  return new Promise((resolve, reject) => {
    try{

      if (lat) {

        coords = {latitude: lat, longitude: lon}
        
        resolve(coords)
      } else {
        reject("didn't add zeroes")
      }
      } catch (err) {
        throw err
      }
  })
}
  
module.exports = { getStationByGeocode }
