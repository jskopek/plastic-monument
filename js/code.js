import * as THREE from 'three';
import TWEEN from 'tween';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Monument from './monument.js';
import Pillar from './pillar.js';
import Scroller from './scroller.js'
import { CountUp } from 'countup.js'
const pillarData = require('../data.csv')
require('../css/main.scss')
// import ScaleGroupChildren from './scalegroupchildren.js';


// initialize renderer
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

// add renderer to dom
let containerEl = document.getElementById( 'container' )
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
let controls = new OrbitControls(camera);
controls.autoRotate = false;
controls.enableZoom = false;
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

function updatePillarDetails(pillar) {
    document.querySelector('#year').innerText = pillar.year

    var formatNum = (num) => { return parseInt(num.replace(/,/g, '')) }
    var humanValEl = document.querySelector('#humanMass h4')
    new CountUp(humanValEl, parseInt(pillar.getHumanMassDisplay()), {
        startVal: formatNum(humanValEl.innerText), 
        duration: 3
    }).start();

    var plasticValEl = document.querySelector('#plasticMass h4')
    new CountUp(plasticValEl, parseInt(pillar.getPlasticMassDisplay()), {
        startVal: formatNum(plasticValEl.innerText),
        duration: 3
    }).start();

    var ratioValEl = document.querySelector('#ratio h4')
    new CountUp(ratioValEl, pillar.getPlasticRatio(), {
        startVal: parseFloat(ratioValEl.innerText), 
        decimalPlaces: pillar.getPlasticRatio() < 1 ? 3 : pillar.getPlasticRatio() < 2 ? 2 : 1, 
        duration: 7
    }).start();
    console.log(pillar.getPlasticRatio())
    document.querySelector('#ratio h5').innerText = pillar.getPlasticRatio() < 1 ? 'as much plastic as human' : 'more plastic than human'


    //activePillar.querySelector('#ratio h4').innerText = pillar.getPlasticRatio() + 'x'
    document.querySelector('.notes').innerText = pillar.notes
}

// looping animation method
function animate() {
    requestAnimationFrame(animate);

    renderer.render( scene, camera );
    TWEEN.update();
    controls.update()
}
animate();

// animation helper functions
function toggleTitle(isShown) {
    document.querySelector('#year').classList.toggle('hidden', isShown);
    document.querySelector('.notes').classList.toggle('hidden', isShown);
    document.querySelector('.measurements').classList.toggle('hidden', isShown);
    document.querySelector('#monumentTitle').classList.toggle('hidden', !isShown);
    controls.autoRotate = isShown;
}
function setActivePillar(index) {
    if(!monument.pillars[index]) { return; }

    window.activePillarIndex = index;

    let pillar = monument.pillars[index];

    monument.pillars.forEach((pillar) => { pillar.disable(); })
    pillar.enable()

    updatePillarDetails(pillar)

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
}
function getActivePillarIndex() { return window.activePillarIndex || 0; }
// end animation helper functions

// handling prev/next
let playStepInterval = 6000

document.querySelector('#btnPrev').addEventListener('click', (e) => { pause(); toggleTitle(false); setActivePillar(getActivePillarIndex() - 1) })
document.querySelector('#btnNext').addEventListener('click', (e) => { pause(); toggleTitle(false); setActivePillar(getActivePillarIndex() + 1) })
document.querySelector('#btnPlayPause').addEventListener('click', (e) => { if(window.playInterval) { pause(); } else { play(); } });

function play()  {
    window.playInterval = setInterval(() => {
        if(getActivePillarIndex() < (monument.pillars.length - 1)) {
            toggleTitle(false);
            setActivePillar(getActivePillarIndex() + 1)
        } else {
            toggleTitle(true);
            setActivePillar(0)
        }
    }, playStepInterval);
    document.querySelector('#btnPlayPause i').classList.add('fa-pause')
    document.querySelector('#btnPlayPause i').classList.remove('fa-play')
}
function pause()  {
    clearInterval(window.playInterval);
    window.playInterval = undefined
    document.querySelector('#btnPlayPause i').classList.remove('fa-pause')
    document.querySelector('#btnPlayPause i').classList.add('fa-play')
}
toggleTitle(true);
play();

//// handling scroller
//let scroller = new Scroller(document.querySelector('.scroller'))
//scroller.add('title')
//monument.pillars.forEach((pillar) => { scroller.add(pillar, 0.2) });
//scroller.on('scroll', (scrollItem, index) => {
//
//    if(scrollItem instanceof Pillar) {
//        toggleTitle(false);
//        let pillarIndex = index - 1; //offset the initial `title` scrollItem in the scroller
//        setActivePillar(pillarIndex)
//        window.activePillarIndex = pillarIndex;
//    } else {
//        toggleTitle(true);
//        monument.pillars.forEach((pillar) => { pillar.enable(); })
//    }
//    console.log('scroller.scroll', scrollItem)
//});
//scroller.add('title', 2)


// DEBUG VALUES
//window.debug = {renderer, monument, scene, camera, monumentGroup, THREE, scroller}
