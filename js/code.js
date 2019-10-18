// Our Javascript will go here.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';



var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


function generateYear(width, index, humanMass, plasticMass) {
    var height = humanMass + plasticMass

    var humanMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var humanGeometry = new THREE.BoxGeometry( width, humanMass, 1 );
    var humanCube = new THREE.Mesh( humanGeometry, humanMaterial );
    //scene.add( humanCube );
    humanCube.position.set(0, humanMass/2, 0);

    var plasticMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    var plasticGeometry = new THREE.BoxGeometry( width, plasticMass, 1 );
    var plasticCube = new THREE.Mesh( plasticGeometry, plasticMaterial );
    //scene.add( plasticCube );
    plasticCube.position.set(0, humanMass + 0.1 +  plasticMass/2, 0);

    var group = new THREE.Group()
    group.add(humanCube)
    group.add(plasticCube)
    return group
}

for(var index = 0; index < 40; index++) {
    let width = 2;
    let humanMass = index + 1 /3
    let plasticMass = index + 1

    let year = generateYear(width, index, humanMass, plasticMass);
    year.position.set(width + 2 * index, 0, 0)
    scene.add(year)

}

//camera.position.z = 5;

var controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotate = true;

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 0, 5 );
controls.update();

function animate() {
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    controls.update();

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
