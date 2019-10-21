import * as THREE from 'three';
import TWEEN from 'tween';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {Monument, ScaleGroupChildren} from './monument.js';


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
controls.autoRotate = true;
//controls.enableZoom = false;
//camera.zoom = 20;
controls.rotateSpeed = 2.0
controls.zoomSpeed = 5
controls.panSpeed = 2
controls.enableZoom = true

// initialize scene
let scene = new THREE.Scene();

// create background sphere
let geometry = new THREE.SphereGeometry( 100, 60, 40 );
geometry.scale( - 1, 1, 1 );
let texture = new THREE.TextureLoader().load( 'img/four.jpg' )
let material = new THREE.MeshBasicMaterial({map: texture});
let mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

// create floor
let floorGeometry = new THREE.BoxGeometry(200,1,200);
let floorMaterial = new THREE.MeshBasicMaterial({color:0x000000})
let floorCube = new THREE.Mesh(floorGeometry, floorMaterial);
floorCube.position.set(0,-50,0);
scene.add(floorCube);

// generate a monument
let monument = new Monument(50);
let monumentGroup = monument.generateGroup()
monumentGroup.position.set(0,-50,0);
scene.add(monumentGroup);

// run scaler
let scale = new ScaleGroupChildren(monumentGroup);
//scale.animate(1);


/// ---- TESTING ANIMATED CAMERA
function panCam(xTarget,yTarget,zTarget,tweenDuration){

    TWEEN.removeAll();

    //var camNewPosition= { x : xTarget, y : yTarget, z : zTarget};
    //camNewPosition = {x: camNewPosition.x, y: camNewPosition.y, z: camNewPosition.z}
    //var camNewPosition= new THREE.Vector3(xTarget,yTarget,zTarget).addScalar(10)
    var targetNewPos = {x : xTarget, y : yTarget, z : zTarget};


    //var tst = new THREE.Vector3(xTarget,yTarget,zTarget)
    //tst.sub(controls.target);
    //console.log('tst', tst)

    //camNewPosition = camera.position.clone().add(tst)
    //camNewPosition = {x: camNewPosition.x, y: camNewPosition.y, z: camNewPosition.z}
    //console.log('camNewPosition', camera.position, tst, camNewPosition)

    //var camTween = new TWEEN.Tween(camera.position).to(camNewPosition, tweenDuration).easing(TWEEN.Easing.Quadratic.InOut).start();
    var targetTween = new TWEEN.Tween(controls.target).to(targetNewPos, tweenDuration).easing(TWEEN.Easing.Quadratic.InOut).start();
    
}

//panCam(10,-47,2, 1000);
function testCamera(index) {
    console.log('testCamera', index);
    if(index >= monumentGroup.children.length) { return }
    let panelPosition = monument.getPosition(monumentGroup, index)
    panCam(panelPosition.x, panelPosition.y, panelPosition.z, 1000);
    setTimeout(() => {
        testCamera(index + 1)
    }, 1000);
}
testCamera(0)

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


// DEBUG VALUES
window.debug = {renderer, monument, scene, camera, monumentGroup, scale, THREE}
