//using Salehen's example for mountain terrain generation. Slightly modified :)

var terrain;

function initTerrainSalehen() {

	// This is the geometry data that we will be using to represent our terrain.
	var geometry = new THREE.PlaneGeometry(
		// SUGGESTION: change any of the following to best suite your needs. But be
		//   careful with the segmentations: the more you add, the more expensive it
		//   gets to render to the screen.

		// Width
		80,
		// Height
		150,
		// Horziontal segmentation
		50,
		// Vertical segmentation
		50
	);

	// Below, are a bunch of variables in CamelCase, indicating they are constants.
	// These constants are used as meta information regarding on how the mountains
	// would look.

	// Represents the range that the mountains will be randomly placed, on the x
	// coordinate.
	// SUGGESTION: set this to suite your needs. It can be just about any number.
	var XRange = 80;

	// Represents a placed mountain's offset on the x-coordinate.
	// SUGGESTION: set this to suite your needs. It can be just about any number.
	var XOffset = 0;

	// Represents the range that the mountains will be randomly placed on the y
	// coordinate.
	// SUGGESTION: set this to suite your needs. It can be just about any number.
	var YRange = 50;

	// Represents a placed moutain's offset on the y-coordinate.
	// SUGGESTION: set this to suite your needs. It can be just about any number.
	var YOffset = 30;

	// Represents the range of possible values that the sigma of the Gaussian
	// function will have.
	// SUGGESTION: set this to suite your needs. It can be just about any number.
	var SigmaRange = 1.5

	// Represents the amount by which to offset the sigma value.
	// SUGGESTION: set this to suite your needs. It can be just about any number.
	var SigmaOffset = 0.7;

	// Represents the range of possible values that will represent a mountain's
	// height.
	// SUGGESTION: set this to suite your needs. It can be just about any number.
	var HeightRange = 12;

	// Represents 
	var HeightOffset = 4;

	// This is the number of mountains that we will be generating onto our terrain.
	// SUGGESTION: change this number to suite your needs. It MUST be an integer.
	var MountainCount = 12;

	// Initialize a set of metadata regarding our mountains' construction. Again,
	// the number of mountains that are generated are contingent upon the
	// `MountainCount` constant.
	var mountains = [];
	for ( var i = 0; i < MountainCount; i++ ) {

		mountains.push( {
			position: new THREE.Vector2(
				(Math.random() - 0.5)*XRange + XOffset,
				(Math.random() - 0.5)*YRange + YOffset
			),
			sigma: Math.random()*SigmaRange + SigmaOffset,
			height: Math.random()*HeightRange + HeightOffset
		} );

	}

	// SUGGESTION: the above metadata should also work out just fine for ponds and
	//   lakes. Use negative values for heights, and, for lakes, use larger sigma
	//   values.

	// Always be sure to set this to true whenever you want to modify the vertices.
	geometry.__dirtyVertices = true;

	// This is going to be used below in order to extrude parts of our terrain to
	// give it bumps, and make it look more natural.
	// TODO: change this to suite your needs.
	var TerrainBumpHeight = 1;

	// And this is where we actually modify the vertices of our terrain.
	for ( var i = 0; i < geometry.vertices.length; i++ ) {

		// Perform some random extrusion on our terrain to give it some bumps to make
		// it appear natural when rendered to the screen.
		geometry.vertices[i].z +=
			(Math.random() - 0.5) * TerrainBumpHeight;

		var relative = scene.localToWorld( geometry.vertices[i].clone() );

		for ( var j = 0; j < mountains.length; j++ ) {

			var mountain = mountains[j];
			var dist = Math.sqrt(
				Math.pow( relative.x-mountain.position.x, 2 ) +
				Math.pow( relative.y-mountain.position.y, 2 )
			);

			// Gaussian function used on the terrain, to get a mountain-like structure.
			geometry.vertices[i].z +=
				Math.exp( -dist / (2*Math.pow( mountain.sigma, 2 )) ) * mountain.height

		}

	}

	// Height-based terrain face colouring. Used as metadata by the
	// MeshPhongMaterial to override the default texturing and use the face's
	// colour, instead.
	for ( var i = 0; i < geometry.faces.length; i++ ) {

		var avg = new THREE.Vector3();
		avg.add( geometry.vertices[geometry.faces[i].a] );
		avg.add( geometry.vertices[geometry.faces[i].b] );
		avg.add( geometry.vertices[geometry.faces[i].c] );
		avg.divideScalar(3);

		var relative = scene.localToWorld( avg );

		// SUGGESTION: feel free to change the possible different heights, below. Use
		//   any height scale you want; add some, or remove some, or change the
		//   colour, or change the height cutoff. Anything. It's up to you.

		if ( relative.z < 2.9 ) {

			geometry.faces[i].color.setHex( 0x78A95C );
		
		} else if ( relative.z >= 2.9 && relative.z < 6.5 ) {

			geometry.faces[i].color.setHex( 0xFF9B65 );

		} else if ( relative.z >= 6.5 ) {

			geometry.faces[i].color.setHex( 0xFFFCC6 );
		}

	}

	// N.B. Modification of vertices, and refreshing the geometry is computationally
	// expensive. Don't do it often.

	////////////////////////////////////////////////////////////////////////////////
	// M A T E R I A L

	// This is the material that you inject into the mesh constructor. Here, we are
	// using a class that represents phong, and I believe that this is the best
	// one for the effect that you want to achieve (flat, Google KitKat look).
	var material = new THREE.MeshPhongMaterial( {
		shading: THREE.FlatShading,

		// Don't draw any texture: just use the geometry's face colour metadata for
		// applying the "texture" to the faces. This has been set for artistic
		// reasons. Nothing really technical.
		vertexColors: THREE.FaceColors,

		// An attempt at removing the Phong specular reflection.
		shininess: 0,
		wireframe: false
	} );

	////////////////////////////////////////////////////////////////////////////////
	// T E R R A I N   M E S H

	geometry.verticesNeedUpdate = true;
	geometry.normalsNeedUpdate = true;
	geometry.dynamic = true;

	// This actually represents our terrain.
	terrain = new THREE.Mesh( geometry, material );

	// Rotate the terrain by 90 degrees, clockwise, on the x-axis.
	terrain.rotation.x = -Math.PI/2;

	// Add our terrain to the scene (which is an abstract construct used by
	// Three.js).
	scene.add( terrain );

	////////////////////////////////////////////////////////////////////////////////
	// P O I N T   L I G H T

	// // And this is the light that that will be giving the flat look.
	// var pointLight = new THREE.PointLight( 0xFFFFFF, 1 );
	// pointLight.position.set( 0, 10, 0 );
	// scene.add( pointLight );

	// SUGGESTION: change the parameters on the above point light or add more point
	//   lights, depending on the effects that you want to achieve.
	//
	//   But be careful when adding more point lights. Computing lighting using
	//   point lights is expensive.

	////////////////////////////////////////////////////////////////////////////////

	// SUGGESTION: You may want to experiment arround with directional light:
	//   http://threejs.org/docs/#Reference/Lights/DirectionalLight
	//
	//   Directional light is great for mimicking the light emitted by the sun onto
	//   a location on earth, unlike point lights.
	//
	//   I used point lights because, for a simple example, they're easier to work
	//   with, but are terrible for mimicking sunlight.

	////////////////////////////////////////////////////////////////////////////////
	// A M B I E N T   L I G H T

	// This is just an ambient light. I think, but I might be wrong, that only one
	// can be on the scene at once.
	// var ambientLight = new THREE.AmbientLight( 0x303030 );
	// scene.add( ambientLight );



}