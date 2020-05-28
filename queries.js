const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tidal_data',
  password: 'dataBoi',
  port: 5432,
})

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

async function getStationNextData(stationId, timeAtStation) {
  const client = await pool.connect()
  const today = timeAtStation.toString()
  const stationTable = 'public._' + stationId + '_2020'
  
  try {
    await client.query('BEGIN')
    const tableQuery = "CREATE TEMPORARY TABLE temp_table (date_time character(21), water_level character(7), type character(1));"

    await client.query(tableQuery)
    
    const nextTideQuery = 'INSERT INTO temp_table (date_time, water_level, type) (SELECT date_time, water_level, type FROM ' +  stationTable + ' WHERE date_time > $1 LIMIT 1)';
    const lastTideQuery = 'INSERT INTO temp_table (date_time, water_level, type) (SELECT date_time, water_level, type FROM ' +  stationTable + ' WHERE date_time < $1 ORDER BY date_time DESC LIMIT 1)';

    await client.query(nextTideQuery, [today])
    await client.query(lastTideQuery, [today])
    
    const results = await client.query("SELECT * FROM temp_table")

    await client.query('COMMIT')

    return results
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

function getStationLastData(stationId, timeAtStation) {
  const today = timeAtStation.toString()
  return pool.query(`SELECT * FROM _${stationId}_2020 WHERE date_time < '${today}' ORDER BY date_time DESC LIMIT 1`)
  .then( (results) => results.rows[0])
  .catch(error => console.log(error))
};

function getBeachSize(stationId, ) {
  
}
  
module.exports = { getStationByGeocode, getStationNextData, getStationLastData, getBeachSize}
