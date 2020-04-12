import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const _ = require('lodash')
require('../css/main.scss')

// initialize renderer
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

// add renderer to dom
let containerEl = document.getElementById('monument')
containerEl.appendChild( renderer.domElement );

// initialize camera
var camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 1100 );
var lookAt = new THREE.Vector3( 0, 0, 0 );
camera.position.x = 10;
camera.position.y = 17;
camera.position.z = 10;
camera.lookAt(lookAt)


//// initialize orbital rotation
let controls = new OrbitControls(camera, containerEl);
controls.autoRotate = true;
controls.enableZoom = false;
controls.enableRotate = true;
controls.rotateSpeed = 2.0
controls.zoomSpeed = 5
controls.panSpeed = 2


// load scene
var scene = undefined
var loader = new THREE.ObjectLoader();
loader.load("/js/scene-2.json", (obj) => {
    scene = obj;
    initializeScene();
    animate();
});

// looping animation method
function animate(time) {
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
    controls.update()
    updateScene({time})
}



var group;
function initializeScene() {
    group = new THREE.Group();
    group.position.x = - 10.5;
    group.position.z = - 20.5;
    scene.add( group );

    var box = scene.getObjectByName( 'Box' );
    box.geometry.translate( 0, 0.5, 0 );
    scene.remove( box );

    for ( var x = 0; x < 20; x ++ ) {

        for ( var z = 0; z < 40; z ++ ) {

            var clone = box.clone();
            clone.position.x = x;
            clone.position.z = z;
            group.add( clone );

        }

    }
}

function updateScene( event ) {
	var time = event.time * 0.006;
	var children = group.children;

	for ( var i = 0; i < children.length; i ++ ) {

		var child = children[ i ];
		var x = child.position.x;
		var z = child.position.z;
		var cycle = Math.sin( time * 0.01 ) * 0.3;

		child.scale.y = Math.sin( time + x * cycle ) * Math.cos( time * 0.5 + z * cycle ) + 2;

	}

}
