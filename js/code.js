import * as THREE from 'three';
import TWEEN from 'tween';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Monument from './monument.js';
import Pillar from './pillar.js';
import ScaleGroupChildren from './scalegroupchildren.js';
import Scroller from './scroller.js'
const pillarData = require('../data.csv')
require('../css/main.scss')


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
let scale = new ScaleGroupChildren(monumentGroup);
//scale.animate(1);


//// generate text content
//let textEl = document.querySelector('#text')
//monument.pillars.forEach((pillar, index) => {
//    var pillarTextEl = document.createElement('div')
//    pillarTextEl.innerHTML = pillar.renderText();
//
//    let observer = new IntersectionObserver((entries) => {
//        if(entries[0].boundingClientRect.y < 0) {
//            console.log('past something', pillar.year, index);
//
//
//            panCam(index, 2000);
//            monument.pillars.forEach((pillar) => { pillar.disable(); })
//            monument.pillars[index].enable()
//
//            updateActivePillar(pillar)
//        }
//    })
//    observer.observe(pillarTextEl);
//    
//    textEl.appendChild(pillarTextEl);
//});

function updateActivePillar(pillar) {
    var activePillarEl = document.querySelector('#activePillar')
    activePillar.querySelector('#year').innerText = pillar.year
    activePillar.querySelector('#humanMass h4').innerText = parseInt(pillar.humanMass).toLocaleString()
    activePillar.querySelector('#plasticMass h4').innerText = parseInt(pillar.plasticMass).toLocaleString()
    activePillar.querySelector('#ratio h4').innerText = pillar.getPlasticRatio() + 'x'
    activePillar.querySelector('#ratio h5').innerText = pillar.getPlasticRatio() < 1 ? 'as much plastic as human' : 'more plastic than human'
    activePillar.querySelector('.notes').innerText = pillar.notes
}


//// observe camera-cirlce
//document.querySelectorAll('.camera-circle').forEach((el) => {
//    let cameraCircleObserver = new IntersectionObserver((el) => {
//        controls.autoRotate = true;
//        console.log('cameraCircleObserver');
//    })
//
//    cameraCircleObserver.observe(el);
//});
// 


/// ---- TESTING ANIMATED CAMERA
function panCam(index,tweenDuration){

    TWEEN.removeAll();

    //var camNewPosition= { x : xTarget, y : yTarget, z : zTarget};
    //camNewPosition = {x: camNewPosition.x, y: camNewPosition.y, z: camNewPosition.z}
    //var camNewPosition= new THREE.Vector3(xTarget,yTarget,zTarget).addScalar(10)


    //var tst = new THREE.Vector3(xTarget,yTarget,zTarget)
    //tst.sub(controls.target);
    //console.log('tst', tst)

    //camNewPosition = camera.position.clone().add(tst)
    //camNewPosition = {x: camNewPosition.x, y: camNewPosition.y, z: camNewPosition.z}
    //console.log('camNewPosition', camera.position, tst, camNewPosition)

    //var camTween = new TWEEN.Tween(camera.position).to(camNewPosition, tweenDuration).easing(TWEEN.Easing.Quadratic.InOut).start();


    // stop autorotate camera - transitions back from rotating to panning mode
    controls.autoRotate = false;

    let targetNewPos = monument.getCameraTargetPosition(index)
    targetNewPos = {x : targetNewPos.x, y : targetNewPos.y, z : targetNewPos.z};
    var targetTween = new TWEEN.Tween(controls.target).to(targetNewPos, tweenDuration).easing(TWEEN.Easing.Back.Out).start();

    let targetNewCamPos = monument.getCameraPosition(index)
    targetNewCamPos = {x : targetNewCamPos.x, y : targetNewCamPos.y, z : targetNewCamPos.z};
    var targetTween = new TWEEN.Tween(camera.position).to(targetNewCamPos, tweenDuration).easing(TWEEN.Easing.Quadratic.Out).start();


}

//panCam(10,-47,2, 1000);
function testCamera(index) {

    if(index >= monumentGroup.children.length) { return }

    panCam(index, 1000);

    monument.pillars.forEach((pillar) => { pillar.disable(); })
    monument.pillars[index].enable()

    setTimeout(() => {
        testCamera(index + 1)
        //testCamera(parseInt(Math.random() * monument.pillars.length))
    }, 2000);
}
//testCamera(0)

//setTimeout(() => {
//    panCam(-20,-37,23, 1000);
//}, 5000);
/// ---- END TESTING ANIMATED CAMERA

// looping animation method
function animate() {
    requestAnimationFrame(animate);

    renderer.render( scene, camera );
    TWEEN.update();
    controls.update()
}
animate();


// handling scroller
let scroller = new Scroller(document.querySelector('.scroller'))
scroller.add('title')
monument.pillars.forEach((pillar) => { scroller.add(pillar, 0.2) });
scroller.on('scroll', (scrollItem, index) => {

    document.querySelector('#activePillar').classList.toggle('hidden', !(scrollItem instanceof Pillar));
    document.querySelector('#monumentTitle').classList.toggle('hidden', scrollItem != 'title');
    document.querySelector('#signUp').classList.toggle('hidden', scrollItem != 'sign-up');


    controls.autoRotate = !(scrollItem instanceof Pillar);

    if(scrollItem == 'title') {
    } else if(scrollItem == 'sign-up') {
    } else if(scrollItem instanceof Pillar) {

        let pillar = scrollItem;
        let pillarIndex = index - 1; //offset the initial `title` scrollItem in the scroller
        panCam(pillarIndex, 2000);
        monument.pillars.forEach((pillar) => { pillar.disable(); })
        monument.pillars[pillarIndex].enable()

        updateActivePillar(pillar)

    }
    console.log('scroller.scroll', scrollItem)
});
scroller.add('sign-up', 2)

// DEBUG VALUES
window.debug = {renderer, monument, scene, camera, monumentGroup, scale, THREE, scroller}
