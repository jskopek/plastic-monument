import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Monument from './monument.js';

var camera, scene, renderer, controls;
var lon = 0, lat = 0, phi = 0, theta = 0;


init();
animate();


var monument
function init() {

    var container, mesh;

    container = document.getElementById( 'container' );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );


    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    //camera.target = new THREE.Vector3( 0, 0, 0 );
    camera.position.x = -2;
    camera.position.y = 0;
    camera.position.z = 1;

    controls = new OrbitControls(camera);
    controls.autoRotate = true;

    scene = new THREE.Scene();

    // loading background sphere
    var geometry = new THREE.SphereGeometry( 100, 60, 40 );
    geometry.scale( - 1, 1, 1 );
    var texture = new THREE.TextureLoader().load( 'img/one.jpg' )
    var material = new THREE.MeshBasicMaterial({map: texture});
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    monument = new Monument(scene, 10);
    window.monument = monument;

    // set up floor
    var floorGeometry = new THREE.BoxGeometry(200,1,200);
    var floorMaterial = new THREE.MeshBasicMaterial({color:0x000000})
    var floorCube = new THREE.Mesh(floorGeometry, floorMaterial);
    floorCube.position.set(0,-50,0);
    scene.add(floorCube);
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    controls.update()
    monument.update();
}
