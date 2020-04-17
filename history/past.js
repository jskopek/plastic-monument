import * as THREE from './three.module.js';
import { APP } from './app.js';
// import { CustomApp } from './js/custom.js';
import { VRButton } from './VRButton.js';
import _ from 'lodash';
var scrollMonitor = require('scrollmonitor');
// require('../css/main.scss')
require('./past.scss')
var appJSON = require('./past.json')


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

function selectYear(year, yearRangeMin=1952, yearRangeMax=2020) {
    var yearPct = (year - yearRangeMin) / (yearRangeMax - yearRangeMin) + 0.01;
    window.fallingMonument.newItemProbability = yearPct;

    let activeItemKeys = []
    var addItem = function(minYear, itemKey, occuranceMultiplier) { if (year > minYear) _.times(occuranceMultiplier || 1, () => activeItemKeys.push(itemKey)) }
    addItem(1950, 'pen', 5)
    addItem(1952, 'pen', 5)
    addItem(1964, 'credit-card', 3)
    addItem(1969, 'bottle')
    addItem(1975, 'bottle')
    addItem(2000, 'fork-spoon', 10)
    addItem(2002, 'bottle', 4)
    addItem(2006, 'credit-card', 10)
    addItem(2010, 'bucket')
    window.fallingMonument.activeItemKeys = activeItemKeys;

    // scene becomes more transparent as it becomes more chaotic; makes it easier to read text
    sceneEl.classList.toggle('transparent-1', year > 1980)
    sceneEl.classList.toggle('transparent-2', year > 2000)

}

// Monitoring scroll for wordpress history of plastic page
document.querySelectorAll('.past-timeline h2').forEach((el) => {
    var watcher = scrollMonitor.create(el);
    watcher.enterViewport(() => { selectYear(parseInt(el.innerText)) })
});

window.fallingMonument.maxSpeed = 0.3


//TODO: 
//different speed for different items
//set opacity/color in threejs?
//benchmark different models and try to simplify
//change scale as years advance (simluate zoom out)
//change speed as years advance (start off slow and gentle, get frantic)
//switch to simpler models as the years advance
//more ambitious - try to capture each frame and turn it into a movie; then i can do collision detection and simulate filling a room