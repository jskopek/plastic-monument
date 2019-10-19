import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {Monument, scaleGroupChildren} from './monument.js';


function init(containerEl) {
    let renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    containerEl.appendChild( renderer.domElement );

    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    //camera.target = new THREE.Vector3( 0, 0, 0 );
    camera.position.x = -50;
    camera.position.y = -47;
    camera.position.z = -50;
    camera.lookAt(0,-50,0);

    let controls = new OrbitControls(camera);
    controls.autoRotate = true;

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
    let monument = new Monument(10);
    let monumentGroup = monument.generateGroup()
    monumentGroup.position.set(0,-50,0);
    scene.add(monumentGroup);

    return {renderer, controls, monument, scene, camera, monumentGroup}
}

function animate(initVals) {
    requestAnimationFrame(() => { animate(initVals); });

    initVals.renderer.render( initVals.scene, initVals.camera );
    initVals.controls.update()
    initVals.monument.update();

    if(initVals.scale) {
        initVals.scale();
    }
}

let initVals = init(document.getElementById( 'container' ));
initVals.scale = scaleGroupChildren(initVals.monumentGroup, 100, 2);
animate(initVals);


window.initVals = initVals
window.scaleGroupChildren = scaleGroupChildren
