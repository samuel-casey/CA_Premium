const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tidal_data',
  password: 'dataBoi',
  port: 5432,
})
// const userLocation = require('./public/user_location')

const lat = "-63.395"
const lon = "-56.995"
const table_name = "station_metadata"
let station_name

function getStationByGeocode(req, res) {

    pool.query(`SELECT * FROM ${table_name} WHERE lat = $1 AND lon = $2`, [lat, lon], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200)
      res.json(results.rows[0]['station_name'].trim())
    })
  }

module.exports = {
    getStationByGeocode
  }