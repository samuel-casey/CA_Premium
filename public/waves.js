var sun = document.getElementById('sun')
var water = document.getElementById('movingWater')


// default wave heights
var mW0 = 1;
var mW1 = 1.1;
var mW2 = 1.2;
var mW3 = 1.3;
var mW4 = 1.4;
var mW5 = 1.48;
var mW6 = 1.4;
var mW7 = 1.3;
var mW8 = 1.2;
var mW9 = 1.1;
var mW10 = 0.98;
var mW11 = 1;

// list of wave heights for simulation
mWVarList = [mW0, mW1, mW2, mW3, mW4, mW5, mW6, mW7, mW8, mW9, mW10, mW11]

var numberOfAnimationSteps = 12

sun.addEventListener('click', simulate)

function simulate() {
    console.log('sun')

    for (var i = 0; i <= mWVarList.length; i++) {
    water.style.setProperty(`--mW${i}`, mWVarList[i])
    }
}

