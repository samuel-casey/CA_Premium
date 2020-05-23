const axios = require("axios");

function calcTimeAtStation(coordinates) {
    const currentDate = new Date(); // current date/time of user's computer
    const timestampCalc = currentDate.getTime()/1000 + currentDate.getTimezoneOffset() * 60

    const params = {
        locationLat: coordinates.lat, // comes from getStationByGeocode function
        locationLon:  coordinates.lon, // comes from getStationByGeocode function
        timestamp: timestampCalc, // 1478880000 -- Nov 4th, 2016
        key: 'AIzaSyDxknbsdX9jiMi-hSM6hl2ntApxiDvZZ84'
    }

    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${params.locationLat}, ${params.locationLon}&timestamp=${params.timestamp}&key=${params.key}`;

    return axios.get(url)
    .then(response => {

        function appendLeadingZeroes(n){
            if(n <= 9){
              return "0" + n;
            }
            return n
          }

        const offsets = response.data.dstOffset * 1000 + response.data.rawOffset * 1000;

        const localDate = new Date(timestampCalc * 1000 + offsets);

        const localTime = localDate.getFullYear() + "-" + appendLeadingZeroes(localDate.getMonth() + 1) + "-" + appendLeadingZeroes(localDate.getDate()) + " " + appendLeadingZeroes(localDate.getHours()) + ":" + appendLeadingZeroes(localDate.getMinutes());

        return localTime;
    })
    .catch(error => {
        console.log(error);
    });
  
}

function calcRealtime(stationId) {
    console.log(`realtime stationId ${stationId}`)
    stationId = stationId * 2;
    return stationId
}

module.exports = { calcTimeAtStation, calcRealtime }
