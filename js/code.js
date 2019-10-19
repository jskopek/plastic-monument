import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var camera, scene, renderer, controls;
var lon = 0, lat = 0, phi = 0, theta = 0;

class Monument {
    constructor(scene, numPillars) {
        this.pillars = []
        this.expandSteps = 50;
        this.expandBy = 0.02;

        for(var index = 0; index < numPillars; index++) {
            let size = 20;
            let humanMass = (index + 1 /3) * 70
            let plasticMass = index + 1

            let pillar = this.generatePillar(size, index, humanMass, plasticMass);
            pillar.position.set(size  * index, -440, 0)
            this.pillars.push(pillar);
            scene.add(pillar)
        }
    }
    generatePillar(size, index, humanMass, plasticMass) {
        var height = humanMass + plasticMass

        var humanMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var humanGeometry = new THREE.BoxGeometry( size, humanMass, size );
        var humanCube = new THREE.Mesh( humanGeometry, humanMaterial );
        //scene.add( humanCube );
        humanCube.position.set(0, humanMass/2, 0);

        var plasticMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
        var plasticGeometry = new THREE.BoxGeometry( size, plasticMass, size );
        var plasticCube = new THREE.Mesh( plasticGeometry, plasticMaterial );
        //scene.add( plasticCube );
        plasticCube.position.set(0, humanMass + 0.1 +  plasticMass/2, 0);

        var group = new THREE.Group()
        group.add(humanCube)
        group.add(plasticCube)
        return group
    }
    update() {
        if(this.expandSteps > 0) {
            this.pillars.forEach((pillar) => {
                pillar.position.x += pillar.position.x * this.expandBy;
            });
            this.expandSteps -=1 ;
        }
    }
    setExpand(numSteps, expandBy) {
        this.expandSteps = numSteps;
        this.expandBy = expandBy;
    }
}


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
    var geometry = new THREE.SphereGeometry( 800, 60, 40 );
    geometry.scale( - 1, 1, 1 );
    var texture = new THREE.TextureLoader().load( 'img/eight.jpg' )
    var material = new THREE.MeshBasicMaterial({map: texture});
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    monument = new Monument(scene, 10);
    window.monument = monument;

    // set up floor
    var floorGeometry = new THREE.BoxGeometry(1800,1,1800);
    var floorMaterial = new THREE.MeshBasicMaterial({color:0x000000})
    var floorCube = new THREE.Mesh(floorGeometry, floorMaterial);
    floorCube.position.set(0,-440,0);
    scene.add(floorCube);
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    controls.update()
    monument.update();
}
