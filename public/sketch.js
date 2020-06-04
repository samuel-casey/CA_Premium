// import {allStationCoordinates} from './modules/allStations.js'

let x;
let changeDirection;
const Y_AXIS = 1;
const X_AXIS = 2;
let b1, b2, c1, c2;

// for calculating x position 
let amplitude = 600;
let period = 4;

let userLocation = window.document.querySelector('#locationInput').value
let beachSize = 100;

let sketch = function (p) {
    // p5 GLOBALS //
    let x = 0;
    let lowerBound = -20;
    let y = 0;
    let x2 = 0;
    let x3 = 0;
    let x4 = 0;
    let button = $("#startSim")

    w1 = p.color(15, 67, 139, 255);
    w2 = p.color(175);
    w3 = p.color(15, 47, 129, 155);
    w4 = p.lerpColor(w1, w3, 0.2);
    b1 = p.color(227, 225, 196, 155);
    b2 = p.color(50);
    b3 = p.lerpColor(b1, b2, 0.35);

    let minWave = 150;
    let upperBound = 500;


    // let maxBound = 500;
    // let stationBound = map(0)
    // if stationBound > 

    function setGradient(x1, y1, w, h, c1, c2, axis) {
        p.noFill();

        if (axis === Y_AXIS) {
            // Top to bottom gradient
            for (let i = y; i <= y + h; i++) {
                let inter = p.map(i, y, y + h, 0, 1);
                let c = p.lerpColor(c1, c2, inter);
                p.stroke(c);
                p.line(x, i, x + w, i);
            }
        } else if (axis === X_AXIS) {
            // Left to right gradient
            for (let i = x; i <= x + w; i++) {
                let inter = p.map(i, x, x + 1.5 * w, 0, 1);
                let c = p.lerpColor(c1, c2, inter);
                p.stroke(c);
                p.line(i, y, i, y + h);
            }
        }
    }

    // end p5 GLOBALS //

    // p5 Setup //
    p.setup = function () {
        p.createCanvas(window.innerWidth / 1.25, window.innerHeight / 3 * 2);
        let x = amplitude * p.sin((p.frameCount / period) * p.TWO_PI);

        setGradient(0, 0, window.innerWidth / 1.5, window.innerHeight / 3 * 2, b2, b1, X_AXIS);

        let userLocation = p.select('#locationInput').value()
        p.simulate()
    }

    // end p5 Setup //

    p.draw = function () {

        canv2 = p.createGraphics(minWave, p.height);

        p.noStroke();

        //beach
        setGradient(0, 0, p.width, p.height, b1, b3, X_AXIS)

        //still
        p.fill(w4);
        p.rect(0, 1, minWave, 500);

        //wave
        setGradient(x2, x3, p.width / 2, p.width, w4, w3, X_AXIS)

        p.fill(225 + x3);
        p.noStroke();

        //crest
        p.bezier(x2 + p.width / p.random(1.98, 1.99), -10,
            minWave + p.random(x2, x4), x3,
            x3 + p.width / p.random(2, 2.01), x4 + p.width / 2,
            x2 + p.width / 1.98, p.height)

        if (x > upperBound) { changeDirection = true }

        //if the circle passes the right side, change the direction
        //effects of direction change happen below
        else if (x <= 0) { changeDirection = false }
        //if the circle passes the left side (or becomes equal to 0)
        //changes the direction, effects are in the next if statement below

        if (x >= lowerBound && changeDirection == false) {
            x = x + 1
            x2 = x + 2
            x3 = x3 + .15
            x4 = x + 5
        }

        //if x is greater than OR equal to 0, move right
        else if (changeDirection == true) {
            x = x - 1
            x2 = x - 2
            x3 = x3 - .15
            x4 = x - 5
        }

        //once the switch is changed, x must have been bigger than width
        //move circle back to the left

        canv2.background(w4);

        p.image(canv2, 0, 0);
        console.log(x)
    }
    
    p.simulate = function() {
    
        button.on('click', () => {console.log('clicked'); minWave = 400; beachSize = 0.5})
    }
}

new p5(sketch, window.document.getElementById('waveBox'));


let coordinates

const stationOutput = $('#stationOutput');
const currentTime = $('#currentTime');
const stationData = document.querySelector('#stationData');
const nextTide = $('#nextTide');
const lastTide = $('#lastTide');
const startSim = $('#startSim');

// function getStation (coordinates) {
//     return $.post('/station', coordinates)
// }

function addStationEl(station) {
    const stationNameEl = `<div>Showing the tide in: ${station["station_name"]}</div>`
    if (stationOutput.children().length == 0) {
        stationOutput.append(stationNameEl);
    } else {
        stationOutput.children().remove()
        stationOutput.append(stationNameEl)
    }

    const timeEl = `<div><b>Local time: ${station['current_time'].slice(11, 16)}</b></div>`
    if (currentTime.children().length == 0) {
        currentTime.append(timeEl);
    } else {
        currentTime.children().remove()
        currentTime.append(timeEl)
    }
}

function addTideEls(station) {

    const nextTideObj = station.next_tide
    const lastTideObj = station.last_tide

    const nextDateTime = nextTideObj["t"].trim().slice(11, 16)

    const nextTideType = nextTideObj["type"].trim()

    const nextTideLevel = nextTideObj["v"]
    
    let nextTideEl

    if (nextTideType == 'H') {
        nextTideEl = `<div><b>Next tide:</b> ${nextTideType}igh @ ${nextDateTime} (${nextTideLevel}ft)</div>`
    } else {
        nextTideEl = `<div><b>Next tide:</b> ${nextTideType}ow @ ${nextDateTime} (${nextTideLevel}ft)</div>`
    }

    if (nextTide.children().length == 0) {
        nextTide.append(nextTideEl);
    } else {
        nextTide.children().remove()
        nextTide.append(nextTideEl)
    }

    //last tide
    const lastDateTime = lastTideObj["t"].trim().slice(11, 16)

    const lastTideType = lastTideObj["type"].trim()

    const lastTideLevel = lastTideObj["v"]

    let lastTideEl

    if (lastTideType == 'H') {
        lastTideEl = `<div><b>Last tide:</b> ${lastTideType}igh @ ${lastDateTime} (${lastTideLevel}ft)</div>`
    } else {
        lastTideEl = `<div><b>Last tide:</b> ${lastTideType}ow @ ${lastDateTime} (${lastTideLevel}ft)</div>`
    }

    if (lastTide.children().length == 0) {
        lastTide.append(lastTideEl);
    } else {
        lastTide.children().remove()
        lastTide.append(lastTideEl)
    }
};

function addSimEl() {

    const newSimEl = '<div>Simulate to next tide <br>▶️</div>'

    if (startSim.children().length == 0) {
        startSim.append(newSimEl);
    } else {
        startSim.children().remove()
        startSim.append(newSimEl)
    }
}


function handleSubmit() {
    const stationNameEl = `<div>Showing the tide in: </div>`
    if (stationOutput.children().length == 0) {
        stationOutput.append(stationNameEl);
    }

    if (nextTide.children().length == 0) {
        nextTide.append('<div><b>Next Tide:</b></div>');
    }
    if (lastTide.children().length == 0) {
        lastTide.append('<div><b>Last tide:</b></div>');
    }
    
    const userLocation = {
        address: document.querySelector('#locationInput').value
    }

    $.post('/station', userLocation)
        .then((response) => {

            station = {
                'station_name': response['station_name'], // string
                'station_id': response['station_id'], // string
                'current_time': response['current_time']
            }

            return new Promise((resolve, reject) => {
                if (station) {
                    resolve(station)
                } else {
                    reject('No station object returned from THEN following station route')
                }
            })
        })

        .then((station) => {
            addStationEl(station)

            addSimEl()

            getLastAndNext(station).then( (tideData) => addTideEls(tideData))

        })

        .catch(error => console.log(error))
};


function getLastAndNext(station) {
    const today = new Date(station.current_time)

    const yesterday = new Date(today.getTime())
    yesterday.setDate(today.getDate() - 1)

    const tomorrow = new Date(today.getTime())
    tomorrow.setDate(today.getDate() + 1)

    const yesterdaysDate = yesterday.toISOString().split("T")[0]
    const tomorrowsDate = tomorrow.toISOString().split("T")[0]

    const yesterdayFormatted = yesterdaysDate.replace(/-/g, "")
    const tomorrowFormatted = tomorrowsDate.replace(/-/g, "")

    stationApiUrl = `https://tidesandcurrents.noaa.gov/api/datagetter?product=predictions&begin_date=${yesterdayFormatted}&end_date=${tomorrowFormatted}&datum=MLLW&station=${station.station_id}&time_zone=lst_ldt&units=english&interval=hilo&format=json`


    return $.get(stationApiUrl)
    .then( (data, textStatus, jqXHR) => {
        let predictions = data.predictions

        let predPosDistance = []

        for (let i = 0; i < predictions.length; i++) {
            predictions[i].distance = Date.parse(predictions[i].t) - Date.parse(station.current_time)

            if (predictions[i].distance > 0) {
                predPosDistance.push(predictions[i])
            }
        }

        const firstPos = (obj) => obj.distance > 0;

        const lastIdx = predictions.findIndex(firstPos) - 1
        const nextIdx = predictions.findIndex(firstPos)

        const tideData = {
            "next_tide": predictions[nextIdx],
            "last_tide": predictions[lastIdx]
        }

        return tideData
    })
}

async function enterInput(event) {
    var e = window.event || event
    if (e.keyCode == 13 || e.which == 13) {
        if (nextTide.children().length == 0) {
            nextTide.append('<div><b>Next Tide:</b></div>');
        }
        if (lastTide.children().length == 0) {
            lastTide.append('<div><b>Last tide:</b></div>');
        }

        await handleSubmit();
    }
};
