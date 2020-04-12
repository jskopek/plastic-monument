var THREE = require('three');
var sceneObj = require('../scene.json')
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

// 1 micrometer to 100 billion light years in one scene, with 1 unit = 1 meter?  preposterous!  and yet...
var NEAR = 1e-6, FAR = 1e27;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var mouse = [ .5, .5 ];
var zoompos = - 100, minzoomspeed = .015;
var zoomspeed = minzoomspeed;

var container, object;

init();

function init() {

    container = document.getElementById( 'container' );

    // window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );
    // window.addEventListener( 'wheel', onMouseWheel, false );

    // var scene = initScene();

    // // Render scene into view
    // object = initView( scene, true );

    var sceneLoader = new THREE.ObjectLoader();
    sceneLoader.parse(sceneObj, (scene) => {
        object = initView(scene, true);
        animate();
    })

    // animate();
    // updateRendererSizes();
}

function initScene() {

    var scene = new THREE.Scene();

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 100, 100, 100 );
    scene.add( light );

    // load bottle
    var loader = new ColladaLoader();


    loader.load('/models/collada/bottle.dae', function (collada) {
        var obj = collada.scene;
        obj.position.z = 10;
        var bbox = new THREE.Box3().setFromObject(obj);
        obj.position.y = -1 * bbox.max.y / 2;
        scene.add( obj );
    });


    loader.load('/models/collada/bottlecap.dae', function (collada) {
        var obj = collada.scene;
        obj.position.z = 0;
        scene.add( obj );
    });

    return scene;
}
function initView( scene, logDepthBuf ) {

    var framecontainer = document.getElementById( 'container' );
    SCREEN_WIDTH = framecontainer.clientWidth;
    SCREEN_HEIGHT = framecontainer.clientHeight;

    var camera = new THREE.PerspectiveCamera( 50, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );
    scene.add( camera );

    var renderer = new THREE.WebGLRenderer( { antialias: true, logarithmicDepthBuffer: logDepthBuf } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.domElement.style.position = "relative";
    framecontainer.appendChild( renderer.domElement );

    return { container: framecontainer, renderer: renderer, scene: scene, camera: camera };

}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    // Put some limits on zooming
    var minzoom = 1
    var maxzoom = 100
    var damping = ( Math.abs( zoomspeed ) > minzoomspeed ? .95 : 1.0 );

    // Zoom out faster the further out you go
    var zoom = THREE.MathUtils.clamp( Math.pow( Math.E, zoompos ), minzoom, maxzoom );
    zoompos = Math.log( zoom );

    // Slow down quickly at the zoom limits
    if ( ( zoom == minzoom && zoomspeed < 0 ) || ( zoom == maxzoom && zoomspeed > 0 ) ) {
        damping = .85;
    }

    zoompos += zoomspeed;
    zoomspeed *= damping;
    // console.log(zoompos, zoomspeed);

    object.camera.position.x = Math.sin( .5 * Math.PI * ( mouse[ 0 ] - .5 ) ) * zoom;
    object.camera.position.y = Math.sin( .25 * Math.PI * ( mouse[ 1 ] - .5 ) ) * zoom;
    object.camera.position.z = Math.cos( .5 * Math.PI * ( mouse[ 0 ] - .5 ) ) * zoom;
    object.camera.lookAt( object.scene.position );

    object.renderer.render( object.scene, object.camera );
}


// not used

function onWindowResize() {

    // updateRendererSizes();

}

function onMouseMove( ev ) {

    mouse[ 0 ] = ev.clientX / window.innerWidth;
    mouse[ 1 ] = ev.clientY / window.innerHeight;

}

function onMouseWheel( ev ) {

    var amount = ev.deltaY;
    if ( amount === 0 ) return;
    var dir = amount / Math.abs( amount );
    zoomspeed = dir / 10;

    // Slow down default zoom speed after user starts zooming, to give them more control
    minzoomspeed = 0.001;

}

// function updateRendererSizes() {
//     // Recalculate size for both renderers when screen size or split location changes
//     var framecontainer = document.getElementById( 'container' );
//     SCREEN_WIDTH = framecontainer.clientWidth;
//     SCREEN_HEIGHT = framecontainer.clientHeight;

//     object.renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
//     object.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
//     object.camera.updateProjectionMatrix();
//     object.camera.setViewOffset( SCREEN_WIDTH, SCREEN_HEIGHT, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
// }

