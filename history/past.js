import * as THREE from './three.module.js';
import { APP } from './app.js';
// import { CustomApp } from './js/custom.js';
import { VRButton } from './VRButton.js';
import _ from 'lodash';
var scrollMonitor = require('scrollmonitor');
// require('../css/main.scss')
require('./past.scss')
var appJSON = require('./app-performance.json')


window.THREE = THREE; // Used by APP Scripts.
window.VRButton = VRButton; // Used by APP Scripts.

var player = new APP.Player();
player.load( appJSON );
player.setSize( window.innerWidth, window.innerHeight );
player.play();

let sceneEl = document.querySelector('#scene')
sceneEl.appendChild( player.dom );

window.addEventListener( 'resize', function () {
    player.setSize( window.innerWidth, window.innerHeight );
} );



// periodically add items from activeKeys
let newItemProbability = 0;
let newItemTestDelay = 2;
let activeKeys = [];
let speed = 0.1;
let scale = 0.5;

setInterval(() => {
    if (Math.random() < newItemProbability) {
        let key = returnRandomKey()
        let options = {speed: speed, scale: scale, x: randomCoord(15), y: 15, z: randomCoord(15)}
        fallingMonument.addItem(key, options);
    }
}, newItemTestDelay);

function randomCoord(range) { return (Math.random() * 2 - 1) * range }
function randomPosCoord(range) { return Math.random() * range }
function returnRandomKey() { 
    var itemIndex = Math.floor(Math.random() * activeKeys.length)
    return activeKeys[itemIndex];
}
// end periodically add items from activeKeys

function selectYear(year, yearRangeMin=1952, yearRangeMax=2020) {
    var yearPct = (year - yearRangeMin) / (yearRangeMax - yearRangeMin);

    // update global properties
    speed = yearPct * .3 + 0.1;
    scale = 1 - (.5 * yearPct);
    newItemProbability = yearPct + 0.005;
    activeKeys = generateActiveKeyList(year);
    console.log({year, speed, scale})
    
    // scene becomes more transparent as it becomes more chaotic; makes it easier to read text
    sceneEl.classList.toggle('transparent-1', year > 1955)
    sceneEl.classList.toggle('transparent-2', year > 1970)
}

function generateActiveKeyList(year) {
    let activeKeys = []
    var addActiveItem = function(minYear, key, occuranceMultiplier) {
        if (year > minYear) _.times(occuranceMultiplier || 1, () => activeKeys.push(key)) 
    }
    addActiveItem(1950, 'bottle')
    addActiveItem(1970, 'bottle-simple',3)
    addActiveItem(1990, 'bottle-simple',8)
    // addActiveItem(1952, 'pen', 5)
    // addActiveItem(1964, 'credit-card', 3)
    // addActiveItem(1969, 'bottle')
    // addActiveItem(1975, 'bottle')
    // addActiveItem(2000, 'fork-spoon', 10)
    // addActiveItem(2002, 'bottle', 4)
    // addActiveItem(2006, 'credit-card', 10)
    // addActiveItem(2010, 'bucket')
    return activeKeys;
}

// Monitoring scroll for wordpress history of plastic page
document.querySelectorAll('.past-timeline h2').forEach((el) => {
    var watcher = scrollMonitor.create(el);
    watcher.enterViewport(() => { selectYear(parseInt(el.innerText)) })
});

window.fallingMonument.maxSpeed = 0.3
window.fallingMonument.newItemTestDelay = 5;


//TODO: 
//different speed for different items
//set opacity/color in threejs?
//benchmark different models and try to simplify
//change scale as years advance (simluate zoom out)
//change speed as years advance (start off slow and gentle, get frantic)
//switch to simpler models as the years advance
//more ambitious - try to capture each frame and turn it into a movie; then i can do collision detection and simulate filling a room