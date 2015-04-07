var width = window.innerWidth,
	height = window.innerHeight;

// //delay to ensure viewport size correctness
// var t = setTimeout(function() {
// 	width = window.innerWidth,
// 	height = window.innerHeight;

// 	// console.log(width + ":" + height);
// 	// var node = document.createElement("p");
// 	// var stringNode = document.createTextNode((width + ":" + height).toString());
// 	// node.appendChild(stringNode);

// 	// document.getElementById("console").appendChild(node);

// 	onWindowResize();

// }, 1000);

var container;
var camera, scene, renderer;
var cameraMoving = false;

var cubeArray1 = [];
var cubeArray2 = [];

var treeCount = 100;
var treeArray = [];

var cloudCount = 20;
var cloudArray = [];

var geometries = [];
var defaultMaterial;

var x = 100, y = 100, z = 100, shape, yAngle, zAngle = 100;

//terrain
var grass, river, moutain;
var grassOrig = [], riverOrig = [], moutainOrig = [];

//things in the sky
var sunMesh, moonMesh;
var sunGroup;
var skyAngle = 0;

var pointLight;

var directionalLight;

//floor
var SEPARATION = 10;
var AMOUNTX = 40;
var AMOUNTY = 40;
var particleArray = [];

//mouse val
var mouseX = 0, mouseY = 0;

var incrementalVal = 0.1;

var xSize = 4,
	ySize = 4,
	zSize = 4;

var pos = new THREE.Vector3(0, -5, -30);

var terrainDanceBool = false;
var treeDanceBool = false;

//initialize three.js
function init() {
	container = document.getElementById( 'cont' );

	camera = new THREE.PerspectiveCamera(70, (width) / height, 1, 1000);
	camera.position.set(0, 5, 50);

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0xffffff );
				renderer.setSize ( width, height );
				renderer.domElement.style.cssFloat = "left";

	container.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );

	var ambientLight = new THREE.AmbientLight( 0x606060 ); // soft white light
	scene.add( ambientLight );

	sunGroup = new THREE.Group();

	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0, 1, -1 );
	scene.add( directionalLight );

	pointLight = new THREE.PointLight(0xffffff, 1.0);
	pointLight.position = new THREE.Vector3(0, 400, -650);
	scene.add(pointLight);
-
	// initCubes(cubeArray1);
	// initCubes(cubeArray2);

	//initGeometry();

	initClouds();

	//sand
	//initTerrain(0x855C33, 25, 300, 150, -100, 0);
	// //grass
	initTerrain("grass", 0x78A95C, 50, 50, 1.5, 0, 0, 100);
	// //river
	initTerrain("river", 0x9BA6EE, 15, 15, 1.0, 0, 0, 100);
	// //mountain
	//initTerrain(0x66FF66, 10, 10, 20, -10, -50, 200);
	grass = scene.getObjectByName( "grass", true );
	river = scene.getObjectByName( "river", true );
	
	initTerrainSalehen();

	initOrigZArray(grassOrig, grass);
	initOrigZArray(riverOrig, river);
	initOrigZArray(moutainOrig, terrain);

	initTrees();

	initSky();

	//initFloor();

	//add mouse
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onMouseDown, false);
	document.addEventListener( 'mouseup', onMouseUp, false);

	document.addEventListener( 'touchmove', onDocumentTouchMove, false);
	document.addEventListener( 'touchend', onDocumentTouchEnd, false);


	draw();
}

//initialize trees
function initTrees() {

	for (var i = 0; i < treeCount; i++)
	{
		var treeGreenGeo = new THREE.DodecahedronGeometry(0.5, 0); //new THREE.CylinderGeometry( 0.1, 1, 2, 3, 3 );
		var treeGreenMat = new THREE.MeshPhongMaterial( {color: 0x4CAF50, shininess: 0, shading: THREE.FlatShading} );
		var treeGreenMesh = new THREE.Mesh(treeGreenGeo, treeGreenMat);
		treeGreenMesh.position.y = 1.2 + Math.random() * 0.5;
		treeGreenMesh.rotation.x = Math.random() * Math.PI * 2;
		treeGreenMesh.rotation.y = Math.random() * Math.PI * 2;

		var treeTrunkGeo = new THREE.BoxGeometry(0.2, 3, 0.2);
		var treeTrunkMat = new THREE.MeshPhongMaterial( {color: 0x2B1600, shininess: 0, shading: THREE.FlatShading} );
		var treeTrunkMesh = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
		treeTrunkMesh.position.y = 0;

		var randomX = Math.random() * 50 - 25;
		var randomZ = Math.random() * 100 - 19;

		treeGreenMesh.position.x = randomX;
		treeGreenMesh.position.z = randomZ;
		treeTrunkMesh.position.x = randomX;
		treeTrunkMesh.position.z = randomZ;

		scene.add(treeGreenMesh), scene.add(treeTrunkMesh);

		treeArray.push(treeGreenMesh);
	}


}

//initialize clouds in the sky
function initClouds() {

	for (var i = 0; i < cloudCount; i++)
	{
		var cloudGeo1 = new THREE.DodecahedronGeometry(0.5, 0);
		var cloudGeo2 = new THREE.DodecahedronGeometry(0.8, 0);
		var cloudGeo3 = new THREE.DodecahedronGeometry(0.5, 0);
		var cloudMat = new THREE.MeshPhongMaterial( {color: 0xffffff, shininess: 0, transparent:true, opacity:0.8, shading: THREE.FlatShading} );
		
		var cloudMesh1 = new THREE.Mesh(cloudGeo1, cloudMat);
		var cloudMesh2 = new THREE.Mesh(cloudGeo2, cloudMat);
		var cloudMesh3 = new THREE.Mesh(cloudGeo3, cloudMat);

		var randomX = Math.random() * 200 - 100;
		var randomY = Math.random() * 5 + 10;
		var randomZ = Math.random() * 50;

		var pos1 = new THREE.Vector3(randomX - 0.7, randomY, randomZ);

		var scaleNum = 1.5;

		cloudMesh1.position.set(randomX - 0.7 * scaleNum, randomY, randomZ);
		cloudMesh2.position.set(randomX, randomY, randomZ);
		cloudMesh3.position.set(randomX + 0.7 * scaleNum, randomY, randomZ);

		cloudMesh1.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
		cloudMesh2.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
		cloudMesh3.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);


		cloudMesh1.scale.set(scaleNum, scaleNum, scaleNum);
		cloudMesh2.scale.set(scaleNum, scaleNum, scaleNum);
		cloudMesh3.scale.set(scaleNum, scaleNum, scaleNum);

		scene.add(cloudMesh1);
		scene.add(cloudMesh2);
		scene.add(cloudMesh3);

		cloudArray.push(cloudMesh1, cloudMesh2, cloudMesh3);
	}


}

//initialize sun, moon, sun beams
function initSky() {

	var sunGeo = new THREE.SphereGeometry( 5, 5, 5 );
	var material = new THREE.MeshPhongMaterial( {color: 0xffff00, vertexColors: THREE.FaceColors, shininess: 0, shading: THREE.FlatShading, transparent: true, opacity: 0.8} );
	
	//sun color
	for (var i = 0; i < sunGeo.faces.length; i++)
	{
		var randomNum = Math.random() * 0.3 + 0.7;
		sunGeo.faces[i].color = new THREE.Color( randomNum, randomNum, randomNum - 0.2 );
	}

	sunMesh = new THREE.Mesh( sunGeo, material );
	sunMesh.scale.set(20, 20, 20);
	//sunMesh.position.z = -700;
	sunMesh.lookAt(camera.position);
	sunGroup.add(sunMesh);

	for (var i = 0; i < 10; i++)
	{
		var sunBeamGeo = new THREE.CylinderGeometry( 1, 20, 50, 3, 3 );
		var material = new THREE.MeshPhongMaterial( {color: 0xffff00, shininess: 0, shading: THREE.FlatShading, transparent: true, opacity: 0.8} );
		var sunBeamMesh = new THREE.Mesh(sunBeamGeo, material);
		sunBeamMesh.position.x = Math.cos(Math.PI / 5 * i) * 100;
		sunBeamMesh.position.y = Math.sin(Math.PI / 5 * i) * 100;
		sunBeamMesh.rotation.z = Math.PI/5 * i + Math.PI * (3/2);
		sunGroup.add(sunBeamMesh);

	}

	sunGroup.position.z = -700;

	sunGroup.scale.set(0.7, 0.7, 0.7);

	scene.add( sunGroup );



	var moonGeo = new THREE.SphereGeometry( 5, 10, 10 );

	var moonMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, vertexColors: THREE.FaceColors, transparent: true, opacity: 0.7, shininess: 0, shading: THREE.FlatShading});

	//moon color
	for (var i = 0; i < moonGeo.faces.length; i++)
	{
		var randomNum = Math.random() * 0.1 + 0.7;
		moonGeo.faces[i].color = new THREE.Color( randomNum, randomNum, randomNum );
	}

	//jfmsu
	for (var i = 0; i < moonGeo.vertices.length; i++)
	{
		moonGeo.vertices[i].x += Math.random() * 0.5;
		moonGeo.vertices[i].y += Math.random() * 0.5;
		moonGeo.vertices[i].z += Math.random() * 0.5;
	}

	moonMesh = new THREE.Mesh(moonGeo, moonMaterial);
	moonMesh.scale.set(6, 6, 6);
	moonMesh.position.z = -700;
	moonMesh.lookAt(camera.position);
	scene.add(moonMesh);
}

//original vertices position for terrains to go back to
function initOrigZArray(origZArray, mesh)
{
	for (var i = 0; i < mesh.geometry.vertices.length; i++)
	{
		origZArray[i] = mesh.geometry.vertices[i].z;
	}
}

//initialize terrain
function initTerrain(planeName, color, detail, noiseDiv, height, yPos, zPos, size)
{

	var geometry = new THREE.PlaneGeometry(100, 100, detail, detail);

	geometry.verticesNeedUpdate = true;
	geometry.normalsNeedUpdate = true;
	geometry.dynamic = true;

	for (var i = 0; i < geometry.vertices.length; i++)
	{
		geometry.vertices[i].z = Math.random() * height;
	}

	var material = new THREE.MeshPhongMaterial( { color: color, shininess: 0, shading: THREE.FlatShading } );
	//var material = new THREE.MeshBasicMaterial({color: color, opacity: 0.5, wireframe: false});


	var plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = Math.PI/2;
	plane.rotation.y = Math.PI;

	plane.name = planeName;

	plane.position.y = yPos;
	plane.position.z = zPos;

	scene.add(plane);

}

//not being used. Using Salehen's.
function initMountain()
{
	
	
}

//not being used in this.
function initFloor()
{
	var material = new THREE.SpriteMaterial({color: 0xff0000});

	for ( var ix = 0; ix < AMOUNTX; ix++ ) {

		for ( var iy = 0; iy < AMOUNTY; iy++ ) {

			particle = new THREE.Sprite( material );
			particle.scale.y = 20;
			particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
			particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
			scene.add( particle );
			particleArray.push(particle);
		}

	}

}

//for testing
function initCubes(cubeArray)
{
	for (var ix = 0; ix < xSize; ix++)
	{
		for (var iy = 0; iy < ySize; iy++)
		{
			for (var iz = 0; iz < zSize; iz++)
			{
				var geometry = new THREE.SphereGeometry( 2, 2, 2 );
				//opacity 0.6
				defaultMaterial = new THREE.MeshPhongMaterial({color: 0xff00ff * Math.random(), opacity: 0.6, transparent: true, wireframe: false, shading: THREE.FlatShading});
				cube = new THREE.Mesh( geometry, defaultMaterial );
				cube.position.set(ix * 5 - ix * 1, iy * 1.2, iz * 1.2);

				cubeArray.push(cube);
				scene.add(cube);

			}

		}
	}

	

}

//for testing
function positionCubes(cubeArrayDef, xVal, yVal, zVal)
{
	var i = 0;

	for (var a = 0; a < xSize; a++)
	{
		for (var b = 0; b < ySize; b++)
		{
			for (var c = 0; c < zSize; c++)
			{
				cubeArrayDef[i].position.set(a * xVal - xVal/2, b * yVal - yVal/2, c * zVal - zVal/2);

				i++;
			}

		}
	}
}

//make geometries
function initGeometry() {
	
	var cubeGeo = new THREE.BoxGeometry( 1, 1, 1 );
	var cylGeo = new THREE.CylinderGeometry( 1, 1, 1, 3 );
	var torusGeo = new THREE.TorusGeometry( 0.5, 0.25, 16, 50 );
	var sphereGeo = new THREE.SphereGeometry( 1, 32, 32 );

	geometries.push(cubeGeo, cylGeo, torusGeo, sphereGeo);
}

//mouse update
function onDocumentMouseMove( event ) {

	mouseX = event.clientX - width/2;
	mouseY = event.clientY - height/2;

}

//touch update. was used for camera
function onDocumentTouchMove( event ) {

	//event.preventDefault();

	mouseX = event.targetTouches[0].pageX;
	mouseY = event.targetTouches[0].pageY;

	if (event.targetTouches.length == 2)
	{
		cameraMoving = true;
	}

}

function onDocumentTouchEnd(event) {
	cameraMoving = false;

}

function onMouseDown(event) {
	cameraMoving = true;
	
}

function onMouseUp(event) {
	cameraMoving = false;

}


function swapGeo(cube) {

	scene.remove(cube);

	switch (shape) {

		case "Cube":
			cube.geometry = geometries[0];
			break;
		case "Cylinder":
			cube.geometry = geometries[1];
			break;
		case "Torus":
			cube.geometry = geometries[2];
			break;
		case "Sphere":
			cube.geometry = geometries[3];
			break;
	}

	scene.add(cube);

}

//fetch slider values, set them.
//redundant. Some of these are being set inside Angular Controller.
//but I have them here in case there are errors.
function setVariables(){
	//slider values
	try {
		x = parseInt( document.getElementById('xScale').value );
		y = parseInt( document.getElementById('yScale').value );
		z = parseInt( document.getElementById('zScale').value );
		yAngle = parseInt( document.getElementById('yAngle').value );
		zAngle =  parseInt( document.getElementById('zAngle').value );
	}

	catch(err)
	{
		x = parseInt(data.red);
		y = parseInt(data.green);
		z = parseInt(data.blue);
		yAngle = 100;
		zAngle = parseInt(data.fov);
	}

	if (isNaN(x) || isNaN(y) || isNaN(z) || isNaN(yAngle) || isNaN(zAngle) )
	{
		x = parseInt(data.red);
		y = parseInt(data.green);
		z = parseInt(data.blue);
		yAngle = 100;
		zAngle = parseInt(data.fov);
	}
	
}

var test = document.getElementById("selector");
//was used for something else
function whatClicked(evt) {
	try {
		shape = document.getElementById("select_label_001").getElementsByTagName("span")[0].innerHTML;
		//console.log(shape);
	}
	catch(err) {
		console.log("shape is null");
		shape = "Cube";
	}

	for (var i = 0; i < cubeArray1.length; i++)
	{
		swapGeo(cubeArray1[i]);
	}

	for (var i = 0; i < cubeArray2.length; i++)
	{
		swapGeo(cubeArray2[i]);
	}
	
}

//make terrain dance by changing vertices
function dancingTerrain(index, terrainName, musicArray, origZArray, movementAmount, threshold) {


	if (musicArray[index] == 1)
	{
		//console.log("1");

		for (var i = 0; i < terrainName.geometry.vertices.length; i+=1)
		{
			if ( Math.abs(origZArray[i] - terrainName.geometry.vertices[i].z) > threshold )
			{
				terrainName.geometry.vertices[i].z = origZArray[i] + threshold;
			}
			else
			{
				terrainName.geometry.vertices[i].z += Math.random() * movementAmount;
			}
		}
	}

	else
	{
		//console.log("0");

		for (var i = 0; i < terrainName.geometry.vertices.length; i+=1)
		{
			if ( Math.abs(origZArray[i] - terrainName.geometry.vertices[i].z) > threshold )
			{
				terrainName.geometry.vertices[i].z = origZArray[i] - threshold;
			}
			else
			{
				terrainName.geometry.vertices[i].z -= Math.random() * movementAmount;
			}
		}
	}

	// for (var i = 0; i < terrain.geometry.vertices.length; i+=1)
	// {
	// 	terrain.geometry.vertices[i].z -= 0.05;
	// }

	terrainName.geometry.verticesNeedUpdate = true;
	terrainName.geometry.normalsNeedUpdate = true;
}

//scale array of three.js objects every frame
//used for dancing trees
function scaleCube(index, cube, musicArray) {

	if (musicArray[index] == 1)
	{
		if (cube.scale.x < 1.5)
		{
			cube.scale.x += incrementalVal;
		}

		if (cube.scale.y < 1.5)
		{
			cube.scale.y += incrementalVal;
		}

		if (cube.scale.z < 1.5)
		{
			cube.scale.z += incrementalVal;
		}
	}

	else
	{
		if (cube.scale.x > 1)
		{
			cube.scale.x -= incrementalVal;
		}
		
		if (cube.scale.y > 1)
		{
			cube.scale.y -= incrementalVal;
		}

		if (cube.scale.z > 1)
		{
			cube.scale.z -= incrementalVal;
		}
	}

}

//iterate through array of objects and make them dance, spin
function iterateCubeArray(cubeArrayDef, musicArrayDef)
{
	var musicIndex = 0;

	for (var i = 0; i < cubeArrayDef.length; i++)
	{
		scaleCube(musicIndex, cubeArrayDef[i], musicArrayDef);
		cubeArrayDef[i].rotation.y += z * (Math.PI/180) / 70;
		cubeArrayDef[i].rotation.z += z * (Math.PI/180) / 70;

		musicIndex++;

		if (musicIndex > 7)
		{
			musicIndex = 0;
		}
	}

}

//make sun and moon move
function sunMove() {
	//sunMesh.rotation.y += y/10000;

	sunGroup.position.x = Math.cos(skyAngle) * 400;
	sunGroup.position.y = Math.sin(skyAngle) * 200;

	moonMesh.position.x = Math.cos(skyAngle) * -400;
	moonMesh.position.y = Math.sin(skyAngle) * -200;

	skyAngle -= z / 25000;

	if (skyAngle > Math.PI * 2)
	{
		skyAngle = 0;
	}

	pointLight.position = new THREE.Vector3(sunGroup.position.x, sunGroup.position.y, sunGroup.position.z - 100);
}

//make clouds move
function moveClouds() {

	for (var i = 0; i < cloudArray.length; i++)
	{
		cloudArray[i].position.x += z/5000;

		if(cloudArray[i].position.x > 100)
		{
			cloudArray[i].position.x = -100;
		}
	}

}


function draw() {

	moveClouds();

	setVariables();

	sunMove();

 	if (terrainDanceBool == true)
 	{
 		//dancingTerrain(index, terrain, musicArray, origZArray, movementAmount, threshold)
		dancingTerrain(4, grass, oneArray, grassOrig, 0.05, 0.5);
		dancingTerrain(4, terrain, threeArray, moutainOrig, 0.1, 1.5);
		dancingTerrain(4, river, twoArray, riverOrig, 0.01, 0.2);
 	}

 	if (treeDanceBool == true)
 	{
 		iterateCubeArray(treeArray, oneArray);
 	}


	window.requestAnimationFrame(draw);

	render();

	
}

function render() {

	// if ( cameraMoving )
	// {
	// 	camera.position.x = mouseX / 10;
	// 	camera.position.y = mouseY / 10;
	// }

	// if (camera.position.y < 0)
	// {
	// 	camera.position.y = 0;	
	// }

	//update fov
	camera.fov = zAngle;
	camera.updateProjectionMatrix();

	camera.lookAt( pos );

	//change sky color
	var color = new THREE.Color( 0x000000 );
	color.r = (93 -(Math.cos(skyAngle + Math.PI/2) * 66)) / 255 + (x / 1000);
	color.g = (100 -(Math.cos(skyAngle + Math.PI/2) * 66)) / 255  + (y / 1000);
	color.b = (172 -(Math.cos(skyAngle + Math.PI/2) * 46)) / 255 + (yAngle / 1000);

	directionalLight.intensity = (Math.cos(skyAngle + Math.PI/2)) / (-3) + 0.3;
	//pointLight.intensity = (Math.cos(skyAngle + Math.PI/2)) / (-2);

	renderer.setClearColor( color );

	renderer.render( scene, camera );
}

function onWindowResize() {

	width = window.innerWidth,
	height = window.innerHeight;

	camera.aspect = (width) / height;
	camera.updateProjectionMatrix();

	renderer.setSize ( width, height );

}
