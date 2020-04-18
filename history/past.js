import * as THREE from './three.module.js';
import { APP } from './app.js';
import { VRButton } from './VRButton.js';
import _ from 'lodash';
var d3 = require('d3-scale');
var scrollMonitor = require('scrollmonitor');
var appJSON = require('./app.json')
require('./past.scss')

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
let yearRangeMin = 1952;
let yearRangeMax = 2020;
let activeYear = yearRangeMin;
let speedScale = d3.scalePow().exponent(5).domain([yearRangeMin,yearRangeMax - 20]).range([0.1,0.3])
let sizeScale = d3.scaleSqrt().domain([yearRangeMin, yearRangeMax]).range([0.7, 0.2])
let addItemDelayScale = d3.scaleLinear().domain([yearRangeMin, yearRangeMin + 20, yearRangeMax - 20]).range([2000, 300, 1])

addItemRecursively(); // start

// Monitoring scroll for wordpress history of plastic page
document.querySelectorAll('.past-timeline h2').forEach((el) => {
    var watcher = scrollMonitor.create(el);
    watcher.enterViewport(() => { yearSelected(parseInt(el.innerText)) })
});


// FUNCTIONS
function randomCoord(range) { return (Math.random() * 2 - 1) * range }

function yearSelected(year) {
    activeYear = year
    
    // scene becomes more transparent as it becomes more chaotic; makes it easier to read text
    sceneEl.classList.toggle('transparent-1', year > 1954)
    sceneEl.classList.toggle('transparent-2', year > 1970)
}

function addItemRecursively() {
    let key = returnRandomKey(activeYear)
    let options = {speed: speedScale(activeYear), scale: sizeScale(activeYear), x: randomCoord(15), y: 15, z: randomCoord(15)}
    if(key && document.hasFocus()) {
        fallingMonument.addItem(key, options);
    }
    setTimeout(addItemRecursively, addItemDelayScale(activeYear));
}

function returnRandomKey(year) {
    if(year < 1960) { return 'bottle' }
    else if(year < 1970) { return  Math.random() < 0.5 ? 'bottle' : 'bottle-simple'}
    else if(year < 1980) { return  Math.random() < 0.2 ? 'bottle' : 'bottle-simple'}
    else { return 'bottle-simple' }
}
// END FUNCTIONS