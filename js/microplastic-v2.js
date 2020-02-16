var THREE = require('three');
var fontObj = require('../fonts/helvetiker_regular.typeface.json')
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

//import Stats from './jsm/libs/stats.module.js';

// 1 micrometer to 100 billion light years in one scene, with 1 unit = 1 meter?  preposterous!  and yet...
var NEAR = 1e-6, FAR = 1e27;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var mouse = [ .5, .5 ];
var zoompos = - 100, minzoomspeed = .15;
var zoomspeed = minzoomspeed;

var container, object;

// font loader
var fontLoader = new THREE.FontLoader();
const font = fontLoader.parse(fontObj);


// Generate a number of text labels, from 1µm in size up to 100,000,000 light years
// Try to use some descriptive real-world examples of objects at each scale

var labeldata = [
    { size: .01, scale: 0.0001, label: "microscopic (1µm)" }, // FIXME - triangulating text fails at this size, so we scale instead
    { size: .01, scale: 0.1, label: "minuscule (1mm)" },
    { size: .01, scale: 1.0, label: "tiny (1cm)" }
];

init();

function init() {

    container = document.getElementById( 'container' );

    //stats = new Stats();
    //container.appendChild( stats.dom );

    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'wheel', onMouseWheel, false );


    var scene = initScene();

    // Render scene into view
    object = initView( scene, true );

    animate();
    updateRendererSizes();


    // var scrollable = document.querySelector('#container');
    // scrollable.addEventListener('wheel', function (event) {
    //     var deltaY = event.deltaY;
    //     var contentHeight = scrollable.scrollHeight;
    //     var visibleHeight = scrollable.offsetHeight;
    //     var scrollTop = scrollable.scrollTop;

    //     if (scrollTop === 0 && deltaY < 0) {
    //         event.preventDefault();
    //     } else if (visibleHeight + scrollTop === contentHeight && deltaY > 0) {
    //         event.preventDefault();
    //     }
    // });

}

function initScene() {

    var scene = new THREE.Scene();

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 100, 100, 100 );
    scene.add( light );

    var materialargs = {
        color: 0xffffff,
        specular: 0x050505,
        shininess: 70,
        emissive: 0x000000
    };

    var geometry = new THREE.SphereBufferGeometry( 0.5, 24, 12 );

    for ( var i = 0; i < labeldata.length; i ++ ) {

        var scale = labeldata[ i ].scale || 1;

        var labelgeo = new THREE.TextBufferGeometry( labeldata[ i ].label, {
            font: font,
            size: labeldata[ i ].size,
            height: labeldata[ i ].size / 2
        } );

        labelgeo.computeBoundingSphere();

        // center text
        labelgeo.translate( - labelgeo.boundingSphere.radius, 0, 0 );

        materialargs.color = new THREE.Color().setHSL( Math.random(), 0.5, 0.5 );

        var material = new THREE.MeshPhongMaterial( materialargs );

        var group = new THREE.Group();
        group.position.z = - labeldata[ i ].size * scale;
        scene.add( group );

        var textmesh = new THREE.Mesh( labelgeo, material );
        textmesh.scale.set( scale, scale, scale );
        textmesh.position.z = - labeldata[ i ].size * scale;
        textmesh.position.y = labeldata[ i ].size / 4 * scale;
        group.add( textmesh );

        var dotmesh = new THREE.Mesh( geometry, material );
        dotmesh.position.y = - labeldata[ i ].size / 4 * scale;
        dotmesh.scale.multiplyScalar( labeldata[ i ].size * scale );
        group.add( dotmesh );

    }

    // load bottle
    var loader = new ColladaLoader();
    loader.load('/models/collada/bottlecap.dae', function (collada) {
        var scale = 3
        var size = .01


        materialargs.color = new THREE.Color().setHSL( Math.random(), 0.5, 0.5 );

        var material = new THREE.MeshPhongMaterial( materialargs );

        var group = new THREE.Group();
        group.position.z = - size * scale;
        scene.add( group );

        // var dotmesh = new THREE.Mesh( geometry, material );
        var dotmesh = collada.scene;
        dotmesh.scale.set(size, size, size);
        dotmesh.position.y = - size / 4 * size;
        dotmesh.scale.multiplyScalar( size * scale );
        group.add( dotmesh );

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


function updateRendererSizes() {

    // Recalculate size for both renderers when screen size or split location changes

    // SCREEN_WIDTH = window.innerWidth;
    // SCREEN_HEIGHT = window.innerHeight;

    var framecontainer = document.getElementById( 'container' );
    SCREEN_WIDTH = framecontainer.clientWidth;
    SCREEN_HEIGHT = framecontainer.clientHeight;


    object.renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    object.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    object.camera.updateProjectionMatrix();
    object.camera.setViewOffset( SCREEN_WIDTH, SCREEN_HEIGHT, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
    // object.container.style.width = ( screensplit * 100 ) + '%';

    // objects.logzbuf.renderer.setSize( screensplit_right * SCREEN_WIDTH, SCREEN_HEIGHT );
    // objects.logzbuf.camera.aspect = screensplit_right * SCREEN_WIDTH / SCREEN_HEIGHT;
    // objects.logzbuf.camera.updateProjectionMatrix();
    // objects.logzbuf.camera.setViewOffset( SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH * screensplit, 0, SCREEN_WIDTH * screensplit_right, SCREEN_HEIGHT );
    // objects.logzbuf.container.style.width = ( screensplit_right * 100 ) + '%';

}

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    // Put some limits on zooming
    var minzoom = labeldata[ 0 ].size * labeldata[ 0 ].scale * 1;
    var maxzoom = labeldata[ labeldata.length - 1 ].size * labeldata[ labeldata.length - 1 ].scale * 10;
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

    object.camera.position.x = Math.sin( .5 * Math.PI * ( mouse[ 0 ] - .5 ) ) * zoom;
    object.camera.position.y = Math.sin( .25 * Math.PI * ( mouse[ 1 ] - .5 ) ) * zoom;
    object.camera.position.z = Math.cos( .5 * Math.PI * ( mouse[ 0 ] - .5 ) ) * zoom;
    object.camera.lookAt( object.scene.position );

    // Clone camera settings across both scenes
    // objects.logzbuf.camera.position.copy( object.camera.position );
    // objects.logzbuf.camera.quaternion.copy( object.camera.quaternion );

    // Update renderer sizes if the split has changed
    updateRendererSizes();

    object.renderer.render( object.scene, object.camera );
    // objects.logzbuf.renderer.render( objects.logzbuf.scene, objects.logzbuf.camera );

    //stats.update();

}

function onWindowResize() {

    updateRendererSizes();

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
