import * as THREE from 'three';
import TWEEN from 'tween';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Monument from './monument.js';
import Pillar from './pillar.js';
import Scroller from './scroller.js'
import { CountUp } from 'countup.js'
import _ from 'lodash';
const pillarData = require('../data.csv')
require('../main.scss')
// import ScaleGroupChildren from './scalegroupchildren.js';


var yearScroller = new Scroller(document.getElementById('year-scroller'));
pillarData.forEach((pillarRow) => { yearScroller.add(pillarRow.year, 0.05, false); })
yearScroller.on('scroll', (year, index) => {
    var timelineIndex = parseInt((year - pillarData[0].year) / 10)
    timeline.el.querySelectorAll('div').forEach((el, index) => {
        el.dataset['activeDistance'] = index - timelineIndex;
    });

    console.log(year, timelineIndex)
    setActivePillar(index);
});

var timeline = new Scroller(document.getElementById('timeline'));
var timelineValues = ['Past', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', 'Today', 'Future', '2020s', '2030s', '2040s', '2050s']
timelineValues.forEach((index) => { timeline.add(index, .04, true); })

timeline.on('click', (year, index) => {
    let yearScrollerIndex = yearScroller.indexOfId(String(year))
    yearScroller.scrollTo(yearScrollerIndex == -1 ? 0 : yearScrollerIndex);
    // timeline.el.querySelectorAll('div').forEach((el, index) => {
    //     console.log(el, index);
    // });
    // console.log('timeline.index', index)
});


// initialize renderer
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

// add renderer to dom
let containerEl = document.getElementById('monument')
containerEl.appendChild( renderer.domElement );

// initialize camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
var lookAt = new THREE.Vector3( 0, -50, 0 );
camera.position.x = -10;
camera.position.y = -47;
camera.position.z = -10;

//camera.position.x = -50
//camera.position.y = -48
//camera.position.z = 50

camera.lookAt(lookAt)

//// initialize orbital rotation
let controls = new OrbitControls(camera, containerEl);
controls.autoRotate = false;
controls.enableZoom = false;
controls.enableRotate = false;
//camera.zoom = 20;
controls.rotateSpeed = 2.0
controls.zoomSpeed = 5
controls.panSpeed = 2
//controls.enableZoom = true

// initialize scene
let scene = new THREE.Scene();

// create background sphere
let geometry = new THREE.SphereGeometry( 1000, 60, 40 );
geometry.scale( - 1, 1, 1 );
let texture = new THREE.TextureLoader().load( 'img/four.jpg' )
let material = new THREE.MeshBasicMaterial({map: texture});
let mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

// create floor
let floorGeometry = new THREE.BoxGeometry(200,1,200);
let floorMaterial = new THREE.MeshBasicMaterial({color:0x000000})
let floorCube = new THREE.Mesh(floorGeometry, floorMaterial);
floorCube.position.set(0,-2,0);
//scene.add(floorCube);

// generate a monument
let monument = new Monument(0);
pillarData.forEach((pillarRow) => {
    monument.addPillar(pillarRow.humanMass, pillarRow.plasticMass, pillarRow.year, pillarRow.notes)
});

let monumentGroup = monument.render()
monumentGroup.position.set(0,0,10);
scene.add(monumentGroup);

// run scaler
// let scale = new ScaleGroupChildren(monumentGroup);
// scale.animate(1);

// looping animation method
function animate() {
    requestAnimationFrame(animate);

    renderer.render( scene, camera );
    TWEEN.update();
    controls.update()
}
animate();

// animation helper functions
function setActivePillar(index) {
    if(!monument.pillars[index]) { return; }

    window.activePillarIndex = index;

    let pillar = monument.pillars[index];

    monument.pillars.forEach((pillar) => { pillar.disable(); })
    pillar.enable()

    // remove existing animations
    TWEEN.removeAll();

    let tweenDuration = 2000;

    // stop autorotate camera - transitions back from rotating to panning mode
    controls.autoRotate = false;

    // animate target change
    let targetNewPos = monument.getCameraTargetPosition(index)
    targetNewPos = {x : targetNewPos.x, y : targetNewPos.y, z : targetNewPos.z};
    var targetTween = new TWEEN.Tween(controls.target).to(targetNewPos, tweenDuration).easing(TWEEN.Easing.Back.Out).start();

    // animate camera change
    let targetNewCamPos = monument.getCameraPosition(index)
    targetNewCamPos = {x : targetNewCamPos.x, y : targetNewCamPos.y, z : targetNewCamPos.z};
    var targetTween = new TWEEN.Tween(camera.position).to(targetNewCamPos, tweenDuration).easing(TWEEN.Easing.Quadratic.Out).start();

    // update interactive lights
    //fetch(`http://localhost:3000/leds/${index + 1}`).then(response => {});

}
function getActivePillarIndex() { return window.activePillarIndex || 0; }
// end animation helper functions

// // handling prev/next
// let playStepInterval = 6000

// function play()  {
//     window.playInterval = setInterval(() => {
//         if(getActivePillarIndex() < (monument.pillars.length - 1)) {
//             setActivePillar(getActivePillarIndex() + 1)
//         } else {
//             setActivePillar(0)
//         }
//     }, playStepInterval);
// }
// function pause()  {
//     clearInterval(window.playInterval);
//     window.playInterval = undefined
// }
// play();

// DEBUG VALUES
//window.debug = {renderer, monument, scene, camera, monumentGroup, THREE, scroller}
