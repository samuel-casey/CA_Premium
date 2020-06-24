let sketch = function (p) {

    // p5 GLOBALS //
    let stationTideData;
    let x = 0;
    let x2;
    let x3;
    let x4;
    const Y_AXIS = 1;
    const X_AXIS = 2;
    let active;

    function getStationRoute(data) {
        return new Promise((resolve, reject) => {
            if (data) {
                resolve(data)
            } else {
                reject(alert("We don't know where you are! Please enter your location before pressing the simulate button."))
            }
        })
    }

    function changeRangeSize(stationRange) {

        let rng = stationRange.trim()

        if (rng == "S") {
            let startingPosition = 500
            let newUpperBound = 100
            let newRange = {
                'startingPosition': startingPosition,
                'newUpperBound': newUpperBound,
            }
            return new Promise((resolve, reject) => {
                if (newRange) {
                    console.log("SP changed")
                    resolve(newRange)
                } else {
                    reject(console.log("sp no changey changey"))
                }
            })
        }

        if (rng == "M") {
            let startingPosition = 350
            let newUpperBound = 300
            let newRange = {
                'startingPosition': startingPosition,
                'newUpperBound': newUpperBound,
            }
            return new Promise((resolve, reject) => {
                if (newRange) {
                    console.log("SP changed")
                    resolve(newRange)
                } else {
                    reject(console.log("sp no changey changey"))
                }
            })
        }

        if (rng == "L") {
            let startingPosition = 200
            let newUpperBound = 450
            let newRange = {
                'startingPosition': startingPosition,
                'newUpperBound': newUpperBound,
            }
            return new Promise((resolve, reject) => {
                if (newRange) {
                    console.log("SP changed")
                    resolve(newRange)
                } else {
                    reject(console.log("sp no changey changey"))
                }
            })
        }

        if (rng == "XL") {
            let startingPosition = 100
            let newUpperBound = 500
            let newRange = {
                'startingPosition': startingPosition,
                'newUpperBound': newUpperBound,
            }
            return new Promise((resolve, reject) => {
                if (newRange) {
                    console.log("SP changed")
                    resolve(newRange)
                } else {
                    reject(console.log("sp no changey changey"))
                }
            })
        }
    }

    async function simulate(stationTideData) {

        await getStationRoute(stationTideData)

            .then(async function (tideData) {

                const nextTideObj = tideData.next_tide
                const lastTideObj = tideData.last_tide
                const currentTime = tideData.current_time
                const stationRange = tideData.range_size

                //next tide
                const nextDateTime = nextTideObj["t"].trim().slice(11, 16)
                const nextTideType = nextTideObj["type"].trim()
                const nextTideLevel = nextTideObj["v"]

                //last tide
                const lastDateTime = lastTideObj["t"].trim().slice(11, 16);
                const lastTideType = lastTideObj["type"].trim();
                const lastTideLevel = lastTideObj["v"];

                //calculate how far into the tide interval we are (percentage)
                const nextTimeNum = new Date(nextTideObj["t"]).getTime();
                const lastTimeNum = new Date(lastTideObj["t"]).getTime();
                const currentTimeNum = new Date(currentTime).getTime();
                const percentComplete = (currentTimeNum - lastTimeNum) / (nextTimeNum - lastTimeNum);
                const totalWaterChange = nextTideLevel - lastTideLevel;
                const currentWaterLevel = (Math.round(parseFloat((totalWaterChange * percentComplete) + lastTideLevel) * 1000) / 1000);

                // use percent complete to calculate what the starting rangeSize should be
                // use changeRangeSize() to calculate upper and lowerbounds

                newRange = await changeRangeSize(stationRange);

                newStartingPosition = newRange.startingPosition;
                newUpperBound = newRange.newUpperBound;


                return new Promise((resolve, reject) => {
                    if (newRange) {
                        console.log(`new sp: ${newStartingPosition}`)
                        console.log(newUpperBound)
                        resolve(resetSketch(startingPosition = newStartingPosition, upperBound = newUpperBound, active = true));
                    } else {
                        reject("didn't reset sketch in simulate function")
                    }
                })
            })
    }

    // for setGradient function
    let y = 0;

    let deepWater = 100;
    // let upperBound = 300;
    let lowerBound = 0;

    let changeDirection = false;
    let rangeSize = 3.5;
    let b1 = p.color(245, 225, 196, 55);
    let w1 = p.color(15, 67, 139, 255);
    let w3 = p.color(15, 47, 129, 255);
    let w4 = p.lerpColor(w1, w3, 0.2);

    function resetSketch(startingPosition, upperBound, active) {
        startingPosition = startingPosition;
        upperBound = upperBound;
        console.log(`ACTIVE: ${active}`)
        console.log(`RESET: ${upperBound}`)

        canv = p.createCanvas(window.innerWidth / 1.25, window.innerHeight / 3 * 2.5);

        if (active == true) {

            p.loop()

            if ($("#highLevelTick")) {
                $("#highLevelTick").remove()
            }

            if ($("#lowLevelTick")) {
                $("#lowLevelTick").remove()
            }
            highLevelTick = p.createDiv("|\nHighest Level\nfor interval");
            lowLevelTick = p.createDiv("|\nLowest Level\nfor interval");

            highLevelTick.id("highLevelTick");
            lowLevelTick.id("lowLevelTick");

            tickTextStyle = "font-size: 10px; font-weight: bold; text-align: center; white-space: pre;"

            highLevelTick.position(upperBound + startingPosition + p.textWidth(highLevelTick), p.height + 145)
            lowLevelTick.position(startingPosition + deepWater, p.height + 145)

            highLevelTick.style(tickTextStyle)
            lowLevelTick.style(tickTextStyle)
        } else {
            p.noLoop()
        }
    }

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
                let inter = p.map(i, x, y + h, 0, 1);
                let c = p.lerpColor(c1, c2, inter);
                p.stroke(c);
                p.line(i, y, i, y + h);
            }
        }
    }
    // end p5 GLOBALS //

    // p5 Setup //
    p.setup = function () {
        resetSketch(startingPosition = 100, upperBound = 100, active = false)
    }

    // end p5 Setup //

    p.draw = function () {
        console.log(`draw: ${startingPosition}`)

        // canv2 = p.createGraphics(p.width / rangeSize - deepWater, p.height);

        // canv2.fill(255, 0, 0)
        // canv2.rect(0, 0, 200, 200)

        p.noStroke();

        //beach
        setGradient(0, 0, p.width, p.height - 35, b1, b1, X_AXIS);

        //deepWater
        p.fill(w4);
        p.rect(0, 0, deepWater + x, p.height - 30);

        //wave
        p.fill(w4);
        sketch.wave = p.rect(0, 0, startingPosition + x, p.height - 30)

        //foam
        for (var i = 0; i < p.height - 30; i += 75) {

            p.fill(255);

            p.noStroke();

            // shaking arc p.random(rangeSize - 0.002, rangeSize + 0.002)
            p.arc(startingPosition + x, i, 10 + x, 150, p.PI / 2, 3 * p.PI / 2);

        }

        p.stroke(0);
        // p.line(upperBound + startingPosition, p.height - 30, upperBound + startingPosition, p.height - 20);
        // p.line(startingPosition, p.height - 30, startingPosition, p.height - 20);

        // change text to divs and add position and color

        if (x > upperBound) { changeDirection = true }

        //if the circle passes the right side, change the direction
        //effects of direction change happen below

        else if (x <= 0) { changeDirection = false }
        //if the circle passes the left side (or becomes equal to 0)
        //changes the direction, effects are in the next if statement below

        if (x >= 0 && changeDirection == false) {
            x = x + 1
            x2 = x + 2
            x3 = x3 + .25
            x4 = x + 5
        }

        //if x is greater than OR equal to 0, move right
        else if (changeDirection == true) {
            x = x - 1
            x2 = x - 2
            x3 = x3 - .25
            x4 = x - 5
        }

        //once the switch is changed, x must have been bigger than width
        //move circle back to the left

        // canv2.background(w4);

        // p.image(canv2, p.width, p.height);
    }

    sketch.simulate = simulate
}

// on load
new p5(sketch, window.document.getElementById('waveBox'));

///////////////////////////////////////////////////////////////////////////////////////////////////////

let coordinates

const stationOutput = $('#stationOutput');
const currentTime = $('#clock');
const stationData = document.querySelector('#stationData');
const nextTide = $('#nextTide');
const lastTide = $('#lastTide');
const startSim = $('#startSim');

function addStationEl(station) {
    const stationNameEl = `<div>Showing the tide in: ${station["station_name"]}</div>`
    if (stationOutput.children().length == 0) {
        stationOutput.append(stationNameEl);
    } else {
        stationOutput.children().remove()
        stationOutput.append(stationNameEl)
    }

    const timeEl = `<div id="localClock" ><span id="stationOutput">${station["station_name"]}</span><br>Local time: ${station['current_time'].slice(11, 16)}</div>`
    if (currentTime.children().length == 0) {
        currentTime.append(timeEl);
    } else {
        currentTime.children().remove()
        currentTime.append(timeEl)
    }
}


function addTideEls(tideData) {

    function msToHoursMins(ms) {
        hrs = Math.floor((ms / 3600000) % 24)
        min = Math.floor((ms  / 60000) % 60)
        
        formattedString = `${hrs}hr ${min}mins`
        return formattedString
    }

    const nextTideObj = tideData.next_tide
    const lastTideObj = tideData.last_tide
    const currentTime = tideData.current_time
    const rangeSize = tideData.range_size

    const nextTideTimeString = nextTideObj["t"].trim()

    const nextDateTime = nextTideObj["t"].trim().slice(11, 16)

    // calculate time til next tide in hours
    const nextDT = new Date(nextTideTimeString)
    const currentDT = new Date(currentTime)
    const timeTil = nextDT - currentDT
    const timeTilFormatted = msToHoursMins(timeTil);

    // element with timeTilHours
    const timeTilEl = `<div id="timeTil">Approx. time until next tide: ${timeTilFormatted}</div>`

    if ($("#timeTil")) {
        $("#localClock").remove($("#timeTil"))
        $("#localClock").append(timeTilEl)
    } else {
        $("#localClock").append(timeTilEl)
    }

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

    return new Promise((resolve, reject) => {
        if (tideData) {
            resolve(tideData)
        } else {
            reject(console.log('could not add tide els'))
        }
    })
};

function handleSubmit() {

    const stationNameEl = `<div class="spinner-border text-primary justify-content-center" id="spin1" role="status">
        <span class="sr-only">Loading...</span>
    </div>`
    if (stationOutput.children().length == 0) {
        stationOutput.append(stationNameEl);
    }

    if (nextTide.children().length == 0) {
        nextTide.append(`<div class="spinner-border text-primary justify-content-center" id="spin2" role="status">
        <span class="sr-only">Loading...</span>
    </div>`);
    }
    if (lastTide.children().length == 0) {
        lastTide.append(`<div class="spinner-border text-primary justify-content-center" id="spin3" role="status">
        <span class="sr-only">Loading...</span>
    </div>`);
    }

    const userLocation = {
        address: document.querySelector('#locationInput').value
    }

    $.post('/station', userLocation)
        .then((response) => {

            station = {
                'station_name': response['station_name'], // string
                'station_id': response['station_id'], // string
                'current_time': response['current_time'],
                'range_size': response['range_size']
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

            return new Promise((resolve, reject) => {
                if (station) {
                    resolve(station)
                } else {
                    reject("Couldn't add station and sim els")
                }
            })

        })

        .then((station) => {
            return new Promise((resolve, reject) => {
                if (station) {
                    resolve(getLastAndNext(station))
                } else {
                    reject("no station tide data")
                }
            })
        })

        .then((tideData) => {
            return new Promise((resolve, reject) => {
                if (tideData) {
                    resolve(addTideEls(tideData))
                } else {
                    reject('couldn\'t add tide els')
                }
            })
        })

        // TIDE TIMES
        .then((tideTimes) => {
            sketch.simulate(tideTimes);
            console.log(sketch.simulate.newStartingPosition)
        })

        .catch(error => console.log(error))
};

function getLastAndNext(station) {
    const today = new Date(station.current_time.replace(/-/g, '/'))

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
        .then((data, textStatus, jqXHR) => {
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
                "last_tide": predictions[lastIdx],
                "current_time": station.current_time,
                "range_size": station.range_size
            }

            return new Promise((resolve, reject) => {
                if (tideData) {
                    resolve(tideData)
                } else {
                    reject("no tideData")
                }
            })
        })
}

async function enterInput(event) {
    var e = window.event || event
    if (e.keyCode == 13 || e.which == 13) {

        await handleSubmit();
    }
};

function countTime(startTime, lastTime, nextTime) {

    let baseDate = new Date("1980-01-01 00:00:00");

    let cTime = new Date(baseDate.setHours(startTime.slice(0, 2), startTime.slice(3, 5))).getTime();

    let lTime = new Date(baseDate.setHours(lastTime.slice(0, 2), lastTime.slice(3, 5))).getTime();

    let nTime = new Date(baseDate.setHours(nextTime.slice(0, 2), nextTime.slice(3, 5))).getTime();

    let timeInterval = nTime - lTime
    let elapsedTime = (cTime - lTime)

    let completionPct = (elapsedTime / timeInterval).toFixed(2)
    let completionAmt = completionPct * timeInterval
    let estTimeNum = lTime + completionAmt

    let estTime = new Date(baseDate.setTime(estTimeNum))

}

// add 1 to minutes, add 1 to hours if minutes > 59 
function updateTime(timeNow, lastTide, nextTide) {

    // calc time interval, get a number of increases/decreases for time interval, return timeNowDate
    console.log(`ts t update: \n ${timeNow} \n ${lastTide} \n ${nextTide}`)

}

