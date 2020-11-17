///Dependencies Webpack  and threeJS, npm install webpack webpack-cli, npm install threeJS
// npm run-script build to compile, work on this file.
// dont change package.json


//Llamada de la librerias
const THREE = require('three');
// CommonJS:
const dat = require('dat.gui');
const Stats = require('stats.js');




import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//Model loaders



// CameraControls.install( { THREE: THREE } );
const canvas = document.getElementById('canvas');
const clock = new THREE.Clock();
 // Optional: Pre-fetch Draco WASM/JS module.
// dracoLoader.preload();
//Scene and render
var renderer, scene, bgScene, camera, cameraControls;
var bgMesh;
var engine;
var controls;
var mixer, mixer2,mixerCap;
//Lights
var spotLight, light, hemisLight;
var spotLightHelper;
//Skybox
var materiall;
var Skybox;
var video;
var guiALLF4;
var guiALLF24;

//Interface
var gui;
var obj;
var stats;

function init() 
{
	
	//DAT GUI
	gui = new dat.gui.GUI();
	obj = {
		explode: function () {
		alert('Bang!');
		},
	
		//spotlight
		posX: -25, 
		posY: 8, 
		posZ: 7,
		colorL: "#ffffff", // RGB array
		penunmbra: 0.2,
		helpSpot:true,
		intSpot:1,
		
		intAmbien:1,
		color0: "#443333", 
		intHemis:1,
		colorg: "#111122", 
	};
	
	renderer = new THREE.WebGLRenderer({ canvas });
	scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0x443333, 1, 4 );
 
       var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 2, FAR = 5000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
     
		
	
	
	//Lights
	// spotLight = new THREE.SpotLight( 0xffff00 );
	light = new THREE.AmbientLight( obj.color0 ); // soft white light
	hemisLight = new THREE.HemisphereLight( obj.color0, obj.colorg, 1 );
	

	stats = new Stats();
}


function addLights() 
{
	
	//Hemisphere light
	scene.add( hemisLight );
	spotLight = new THREE.SpotLight();
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.position.set( obj.posX, obj.posY, obj.posZ );
	scene.add( spotLight );
	spotLightHelper = new THREE.SpotLightHelper( spotLight );
	//scene.add( spotLightHelper );
	//fireworklight
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
}


function main() {

	
	//Renderer
	renderer.setClearColor(0x222222);
	renderer.autoClearColor = false;
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	
    renderer.gammaFactor = 2.2;

	
	//Camera
	camera.position.x = 14;
	camera.position.y = 2;
	camera.position.z = 6;
	camera.lookAt( 0, 0.1, 0 );
    controls = new OrbitControls( camera, renderer.domElement );

	addLights();

	 
	
	

        var floorTexture = new THREE.TextureLoader().load( '../client/js/images/checkerboard.jpg' )
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	
	var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 30, 30 ),
		new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010, map: floorTexture, side: THREE.DoubleSide} )
		);
    plane.rotation.x = - Math.PI / 2;
    plane.receiveShadow = true;
	scene.add( plane );

	
	addGUIChooseSkybox();
	addGUIChooseSkyboxTime ();

	
	addSkybox(0,false);//Create animated sky

	//SkyTimeWarp(0);
	//addGUI();
	
	addGUISkyboxproperties();
	
     
	
	
}
 
        function addGUISkyboxproperties(){//Create animated sky
	
			stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
			document.body.appendChild( stats.dom );
	
	var guiSLSky = gui.addFolder('Skybox Properties');
	guiSLSky.add(materiall, 'roughness').min(0).max(1).step(0.1).onChange(function (val) {
		materiall.roughness = val;
		//materiall.update();
	});
	guiSLSky.add(materiall, 'metalness').min(0).max(1).step(0.1).onChange(function (val) {
		materiall.metalness = val;
		//materiall.update();

	});
	

}
function addGUIChooseSkybox (){
	var parameters = 
   {
		four_minutes:   function() { addSkybox( 0, true ); },
		twentyfour_minutes:   function() { addSkybox(  1, true ); },
	
   };
  var guiALL= gui.addFolder('Choose Video');
   guiALL.add( parameters, 'four_minutes'   ).name("Short Video (4)");
   guiALL.add( parameters, 'twentyfour_minutes'   ).name("Long Video (24)");
}

function addSkybox(num,	isnotfirsttime){//Create animated sky

	if (num== 0){// 4 minutes video
		video= document.createElement('video');
		video.load();
		video.autoplay= true; 
		video.needsUpdate= true;
		video.loop	= true;
		video.src	= "../client/js/images/Amanecer.mp4";
		video.volume	= 0;
		video.playbackRate=0.066;//4 minutos /60minutos = 0.066
		
		video.play();
		video.currentTime=0 ;
		
		
		guiALLF4.show();			
		guiALLF24.hide();
		guiALLF24.close();
		
	
	} 
	if (num== 1){ // 24 minutes video
		video= document.createElement('video');
		video.load();
		video.autoplay= true; 
		video.needsUpdate= true;
		video.loop	= true;
		video.src	= "../client/js/images/Sky.mp4";
		video.volume	= 0;
		video.playbackRate= 0.4;//24 minutos /60minutos = 0.4
		
		video.play();
		
			guiALLF4.hide();
			guiALLF24.show();
			guiALLF4.close();
	} 
	

	var texture;
	
	
	texture = new THREE.VideoTexture( video );
	
	

    var skyGeo;
    //add sphere
	skyGeo=	new THREE.SphereGeometry( 300, 30, 30 );
	
	//adding the video to the sphere
 	//var material = new THREE.MeshBasicMaterial({ map: texture,});
     materiall = new THREE.MeshStandardMaterial( {

    //color: 0xffffff,

    roughness: 1,
    metalness: 1,
    map: texture,

	} );
	if (isnotfirsttime){
		
	 
		scene.remove( Skybox );
	}
	
	 Skybox = new THREE.Mesh(skyGeo, materiall);
	// put the video both sides of the sphere
	Skybox.material.side = THREE.DoubleSide;
	//Skybox.Side = THREE.DoubleSide;
	//add sky
	scene.add(Skybox);
}
function SkyTimeWarp(TimeWarp,VideoTime){//Create animated sky

	//choose the video
	if (VideoTime== 0){
	
		SkyTimeWarp_4min(TimeWarp);
		 
	} 
	if (VideoTime== 1){
		SkyTimeWarp_24min(TimeWarp) ;
	} 	
}
function SkyTimeWarp_4min(num){//Create animated sky

	//choose the video
	if (num== 0){
	
		video.currentTime=0 ;
		 
	} 
	if (num== 1){
		video.currentTime=60 ;
	} 
	if (num==2){
	
		video.currentTime=120 ;
	} 
	if (num==3){
	
		video.currentTime=180 ;
	} 
	
	
}
function SkyTimeWarp_24min(num){//Create animated sky

	//choose the video
	if (num== 0){
	
		video.currentTime=0 ;
		 
	} 
	if (num== 1){
		video.currentTime=360 ;
	} 
	if (num==2){
	
		video.currentTime=720 ;
	} 
	if (num==3){
	
		video.currentTime=1080 ;
	} 
	
	
}
     


 
        

function addGUIChooseSkyboxTime (){
	
	var parameters4 = 
   {
		sunrise:   function() { SkyTimeWarp( 0, 0 ); },
		day:   function() { SkyTimeWarp(  1, 0 ); },
		sunset:   function() { SkyTimeWarp( 2, 0  ); },			
		nigth:   function() { SkyTimeWarp( 3, 0 ); }
   };
   var parameters24 = 
   {
		sunrise:   function() { SkyTimeWarp( 0, 1 ); },
		day:   function() { SkyTimeWarp(  1, 1 ); },
		sunset:   function() { SkyTimeWarp( 2, 1  ); },			
		nigth:   function() { SkyTimeWarp( 3, 1 ); }
   };
   guiALLF4= gui.addFolder('Time Warp 4');
   guiALLF4.add( parameters4, 'sunrise'   ).name("Sunrise");
   guiALLF4.add( parameters4, 'day'   ).name("Day");
   guiALLF4.add( parameters4, 'sunset'   ).name("Sunset"); 
   guiALLF4.add( parameters4, 'nigth'   ).name("Nigth");
  
   guiALLF24= gui.addFolder('Time Warp 24');
   guiALLF24.add( parameters24, 'sunrise'   ).name("Sunrise");
   guiALLF24.add( parameters24, 'day'   ).name("Day");
   guiALLF24.add( parameters24, 'sunset'   ).name("Sunset"); 
   guiALLF24.add( parameters24, 'nigth'   ).name("Nigth");
   
}

function displayWindowSize(){
	// Get width and height of the window excluding scrollbars
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	
	// Display result inside a div element
	// console.log("Width: " + w + ", " + "Height: " + h);
	renderer.setSize(w, h);
	// camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
}

// Attaching the event listener function to window's resize event
window.addEventListener("resize", displayWindowSize);
// document.addEventListener( 'keydown', onKeyDown, false );
// document.addEventListener( 'keyup', onKeyUp, false );

function animate() 
{

  requestAnimationFrame(animate);
  render();
  renderer.render(scene, camera);
  controls.update();
  stats.update();
  var dt = clock.getDelta();
  	
  //controls.update();
}


function render() 
{
	const delta = clock.getDelta();
	//Para la animacion
	if ( mixer ) mixer.update( delta );
	if ( mixer2 ) mixer2.update( delta );
	if ( mixerCap ) mixerCap.update( delta );
	
	
}

init();
main();
animate();
