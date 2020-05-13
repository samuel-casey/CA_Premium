function checkDecimals(lat, lon) {
    // make sure that all coordinates have 3 decimals
    //positive double digits//
    console.log(`inputs: ${lat}, ${lon}`)

    //lat
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
    
    coords = [lat, lat.length, lon]

    return coords
  }

console.log(checkDecimals('45.62', '-122.02'));