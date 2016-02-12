//Define an Enum for use
var Enum = function () {
	for (var i in arguments) {
		this[arguments[i]] = i;
	}
}

//Define the different possible "hands" of the clock
var Hands = new Enum('SECOND', 'MINUTE', 'HOUR');
//Make them immutable
Object.freeze(Hands);

//Create a scene and camera for rendering
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
//Initialize a renderer to draw everything
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//Add to the page
document.body.appendChild( renderer.domElement );

//Define a cube for each "hand" of the clock
var geometry = new THREE.BoxGeometry( .75, .75, .75 );
//Make a green material for the seconds hand
var material = new THREE.MeshBasicMaterial( { color: 0x00B207 } );
//Second hand
var secondsCube = new THREE.Mesh( geometry, material );
//Make a material for the minutes hand
material = new THREE.MeshBasicMaterial( { color: 0x3512B2 } );
//Minute hand
var minutesCube = new THREE.Mesh( geometry, material );
//Make a material for the hour hand
material = new THREE.MeshBasicMaterial( { color: 0xFF8219 } );
//Hour hand
var hoursCube = new THREE.Mesh( geometry, material );

//Add all of the clock hands to the 
scene.add( secondsCube ); scene.add( minutesCube ); scene.add( hoursCube );

//Used to calculate delta time
var lastUpdate = Date.now();
var t = 0;

//Make everything visible by moving camera away from origin
camera.position.z = 3.5;

var twoPi = 2 * Math.PI;
var secondTheta = twoPi / 60; //Complete one full circle every second
var minuteTheta = secondTheta / 60; //Complete one full circle every minute
var hourTheta = minuteTheta / 60; //Complete one full circle every hour

//Moves all of the cubes for a given frame
var animateCubes = function () {
	secondsCube.rotation = rotateAboutZ(secondsCube.rotation, secondTheta);
	minutesCube.position = rotateAboutZ(minutesCube.position, minuteTheta);
	hoursCube.position = rotateAboutZ(hoursCube.position, hourTheta);
	
}



//Rotates the hand cubes around the center of the screen
var rotateAboutZ = function (position, theta) {
	cosTheta = Math.cos(theta); 
	sinTheta = Math.sin(theta);

	//These multiplications are analogous to a left multiplication of a matrix
	// which rotates a vector (about the  Z axis) by "theta" degrees, 
	// deltaTime is used to make motion step by real-time rather than frame-rendering-time.
	position.x = deltaTime * (position.x * cosTheta - (position.y * sinTheta));
	position.y = deltaTime * (position.x * sinTheta + position.y * cosTheta);
	//Z position stays the same
	position.z = position.z
}

//Calculates deltaTime (a global variable) between frames, allowing the clock to operate in real time.
var calcDeltaTime = function () {
	var now = Date.now();
	deltaTime = now - lastUpdate; //deltaTime is GLOBAL	
	lastUpdate = now;
}

//Performs the rendering loop 
var render = function () {
	//Turns this function into a loop called every time a frame is ready to fill
	requestAnimationFrame( render );

	//Get the new deltaTime from last frame
	calcDeltaTime();
	//Move the hands of the clock for this frame
	animateCubes();

	//Draw the new frame
	renderer.render(scene, camera);
};

render();
