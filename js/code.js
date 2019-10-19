import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var camera, scene, renderer, controls;
var lon = 0, lat = 0, phi = 0, theta = 0;

init();
animate();

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
    var geometry = new THREE.SphereGeometry( 50, 60, 40 );
    geometry.scale( - 1, 1, 1 );
    var texture = new THREE.TextureLoader().load( 'img/eight.jpg' )
    var material = new THREE.MeshBasicMaterial({map: texture});
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    for(var index = 0; index < 20; index++) {
        let width = 2;
        let humanMass = index + 1 /3
        let plasticMass = index + 1

        let year = generateYear(width, index, humanMass, plasticMass);
        year.position.set(-20 + (width + 2 * index), -30, 0)
        scene.add(year)

    }
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    controls.update()
    //update();
}

function update() {
    lon += 0.1;
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );

    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    camera.target.y = 500 * Math.cos( phi );
    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( camera.target );
    renderer.render( scene, camera );
}

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


