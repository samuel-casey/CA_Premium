var latLon

var closestStation = ""

function handleSubmit() {
  
    var userLocation = document.querySelector('#locationInput').value
    
    locationParams = {
        address:`${userLocation}`,
        // need to hide this on the server
        key:"AIzaSyDxknbsdX9jiMi-hSM6hl2ntApxiDvZZ84"
    }

    $.get('https://maps.googleapis.com/maps/api/geocode/json', locationParams, function (response, textStatus, jqXHR) {
        lat = response['results'][0]['geometry']['location'].lat
        lon = response['results'][0]['geometry']['location'].lng
        $("#geocode").html(`(${lat}, ${lon})`)
        latLon = {
            'lat': ( Math.floor(lat * 1000) / 1000 ),
            'lon': ( Math.floor(lon * 1000) / 1000 )
        }
    })
 
}
