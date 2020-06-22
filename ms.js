let ms = 23400000

function msToHoursMins(ms) {
    hrs = Math.floor((ms / 3600000) % 24)
    min = Math.floor((ms  / 60000) % 60)
    
    formattedString = `${hrs}hr ${min}mins`
    return formattedString
}

msToHoursMins(ms);