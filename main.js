// Import Three.js and other modules
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Initialize Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Initialize Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

// Initialize Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-7, 20, 82);
scene.add(camera);

// Add Lights
const ambientLight = new THREE.AmbientLight('white', 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight('white', 0.5);
directionalLight.position.set(1, 5, 2);
scene.add(directionalLight);

// PointerLockControls setup
const controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', (event) => {
    // Prevent locking when clicking on side menu buttons or menu area
    if (event.target.closest('#menu-btn') || event.target.closest('#side-menu')) {
        return;
    }
    controls.lock();
});

// Log unlock events for debugging
controls.addEventListener('unlock', () => console.log('Pointer unlocked'));

// Side menu elements
const sideMenu = document.getElementById('side-menu');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
// Select the close button
const closeButton = document.getElementById('close-instructions');

// Add a click event listener to hide the instructions
closeButton.addEventListener('click', function () {
  document.getElementById('instructions').style.display = 'none';
});

// Optional: Add a timeout to hide the instructions after a certain time
setTimeout(() => {
  const instructions = document.getElementById('instructions');
  if (instructions) {
    instructions.style.opacity = '0';
    setTimeout(() => instructions.style.display = 'none', 500); // Allow for fade-out effect
  }
}, 15000); // 15 seconds

// Open side menu
menuBtn.addEventListener('click', () => {
    sideMenu.style.width = '250px'; // Show the side menu
    controls.unlock(); // Release pointer lock when menu opens
    console.log('Pointer lock disabled for side menu');
});

// Close side menu
closeBtn.addEventListener('click', () => {
    sideMenu.style.width = '0'; // Hide the side menu
    console.log('Pointer lock can be re-enabled');
});

// Movement variables
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const move = { forward: false, backward: false, left: false, right: false };

// Event listeners for movement
document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW': move.forward = true; break;
    case 'KeyS': move.backward = true; break;
    case 'KeyA': move.left = true; break;
    case 'KeyD': move.right = true; break;
  }
});
document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW': move.forward = false; break;
    case 'KeyS': move.backward = false; break;
    case 'KeyA': move.left = false; break;
    case 'KeyD': move.right = false; break;
  }
});

// Initialize GLTFLoader
const gltfLoader = new GLTFLoader();

// Array for animation mixers
const animationMixers = [];

// Function to load animated characters
function loadAnimatedCharacter(path, position, scale, rotation = { x: 0, y: 0, z: 0 }) {
  gltfLoader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      
      // Set position, scale, and rotation
      model.position.set(position.x, position.y, position.z);
      model.scale.set(scale, scale, scale);
      model.rotation.set(rotation.x, rotation.y, rotation.z); // Apply rotation
      
      scene.add(model);

      // Create and store animation mixer
      const mixer = new THREE.AnimationMixer(model);
      animationMixers.push(mixer);

      // Play animations
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });

      console.log(`Character loaded: ${path}`);
    },
    undefined,
    (error) => console.error(`Error loading ${path}:`, error)
  );
}


// Load models
loadAnimatedCharacter('./models/character1/scene.gltf', { x: -83, y: 0, z: -5 }, 5,{ x: 0, y: Math.PI / .27, z: 0 });
loadAnimatedCharacter('./models/character2/scene.gltf', { x: -10, y: 0, z: -15 }, 5);
loadAnimatedCharacter('./models/character3/scene.gltf', { x: -2.7, y: 2, z: -13 }, 4, { x: 0, y: Math.PI / 2, z: 0 } ); // rotation
loadAnimatedCharacter('./models/character4/scene.gltf', { x: -16, y: 0, z: -8 }, 5,{ x: 0, y: Math.PI / 1.5, z: 0 });
loadAnimatedCharacter('./models/population/scene.gltf', { x: -10, y: 0, z: -30 }, 8);
loadAnimatedCharacter('./models/character2/scene.gltf', { x: -90, y: 0, z: 5 }, 5);

// Load GLTF scene
gltfLoader.load('./vr_gallery.glb', (gltf) => {
  const shopScene = gltf.scene;
  shopScene.scale.set(8, 8, 8);
  shopScene.position.set(0, 0.01, 0);
  scene.add(shopScene);
  console.log('Shop scene loaded.');
});

// Load GLTF scene
gltfLoader.load('./cow.glb', (gltf) => {
  const shopScene = gltf.scene;
  shopScene.scale.set(1, 1, 1);
  shopScene.position.set(0, -1, 0);
  scene.add(shopScene);
  console.log('Shop scene loaded.');
});

import { createSky } from './sky.js';


// Add sky to the scene
createSky(scene);

// Floor
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshLambertMaterial({ color: 'burlywood' })
);
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);
// Common material for walkable areas
const walkableMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, visible: false }); // Green for debugging

// Define walkable areas
const walkableArea1 = new THREE.Mesh(new THREE.PlaneGeometry(167, 80), walkableMaterial);
walkableArea1.rotation.x = -Math.PI / 2; // Horizontal
walkableArea1.position.set(0, 1, 44); // Adjust position
scene.add(walkableArea1);

const walkableArea2 = new THREE.Mesh(new THREE.PlaneGeometry(60, 125), walkableMaterial);
walkableArea2.rotation.x = -Math.PI / 2; // Horizontal
walkableArea2.position.set(47, 1, -20); // Adjust position
scene.add(walkableArea2);

const walkableArea3 = new THREE.Mesh(new THREE.PlaneGeometry(70, 125), walkableMaterial);
walkableArea3.rotation.x = -Math.PI / 2; // Horizontal
walkableArea3.position.set(-47, 1, -20); // Adjust position
scene.add(walkableArea3);
const walkableArea4 = new THREE.Mesh(new THREE.PlaneGeometry(167, 60), walkableMaterial);
walkableArea4.rotation.x = -Math.PI / 2; // Horizontal
walkableArea4.position.set(0, 1, -50); // Adjust position
scene.add(walkableArea4);

// Add all walkable areas to the array
const walkableAreas = [walkableArea1, walkableArea2, walkableArea3,walkableArea4];

const groundRaycaster = new THREE.Raycaster();
const rayDirection = new THREE.Vector3(0, -1, 0); // Cast downwards (Y-axis)

function isOnWalkableArea(position) {
  groundRaycaster.set(new THREE.Vector3(position.x, position.y + 10, position.z), rayDirection); // Cast from above
  const intersects = groundRaycaster.intersectObjects(walkableAreas);

  return intersects.length > 0; // Returns true if the position is over a walkable area
}

// Load textures for photos and videos
const textureLoader = new THREE.TextureLoader();
const photoMeshes = [];

const mediaItems = [
  { 
    type: 'image', 
    path: './images/1.png', 
    size: { width: 9, height: 5 }, 
    position: { x: -25.2, y: 16.3, z: -85 }, 
    rotation: { x: 0, y: Math.PI / .10, z: 0 }, // 45 degrees rotation around Y-axis
    url: 'http://www.yamashita-kogei.com/pdf/ecomark_bamboo.pdf' 
  },
  { 
    type: 'image', 
    path: './images/4.png', 
    size: { width: 15, height: 10 }, 
    position: { x: 2.01, y: 13, z: -85 }, 
    rotation: { x: 0, y: Math.PI / .10, z: 0 }, // 90 degrees rotation around X-axis
    url: 'http://www.example.com/photo2' 
  },
  { 
    type: 'image', 
    path: './images/3.png', 
    size: { width: 9, height: 5 }, 
    position: { x: -25.2, y: 27.5, z: -85 }, 
    rotation: { x: 0, y: 0, z: Math.PI / .10 }, // 90 degrees rotation around Z-axis
    url: 'http://www.example.com/photo3' 
  },
  { 
    type: 'video', 
    path: './video/2.mp4', 
    size: { width: 51, height: 29.3 }, 
    position: { x: -138.8, y: 39, z: -85 }, 
    rotation: { x: 0, y: Math.PI / .16, z: Math.PI / .1 }, // 60 degrees rotation around Y-axis
    url: 'http://www.example.com/video1' 
  }
  ,
  { 
    type: 'video', 
    path: './cowvid.mp4', 
    size: { width: 12, height: 6.8 }, 
    position: { x: 20, y: 12, z: 5 }, 
    rotation:{ x: Math.PI/-3.4, y: 0, z: 0 }, // 90 degrees rotation around X-axis
    url: 'https://www.canva.com/design/DAGX-XTM0jY/neLikvhpi3Sdj-L6AGIrWw/watch?utm_content=DAGX-XTM0jY&utm_campaign=share_your_design&utm_medium=link&utm_source=shareyourdesignpanel' 
  }
];

mediaItems.forEach((item) => {
  let material;

  if (item.type === 'image') {
    const texture = textureLoader.load(item.path);
    material = new THREE.MeshBasicMaterial({ map: texture });
  } else if (item.type === 'video') {
    const video = document.createElement('video');
    video.src = item.path;
    video.loop = true;
    video.muted = true; // Mute for autoplay
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    material = new THREE.MeshBasicMaterial({ map: videoTexture });
  }

  const geometry = new THREE.PlaneGeometry(item.size.width, item.size.height);
  const mesh = new THREE.Mesh(geometry, material);

  // Set position
  mesh.position.set(item.position.x, item.position.y, item.position.z);

  // Set rotation
  if (item.rotation) {
    mesh.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
  }

  // Add the mesh to the scene
  mesh.userData = { url: item.url };
  scene.add(mesh);
  photoMeshes.push(mesh);
});


// Photo click handler with its own raycaster
const photoRaycaster = new THREE.Raycaster(); // Separate raycaster for photo clicks
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  photoRaycaster.setFromCamera(mouse, camera); // Use photoRaycaster here
  const intersects = photoRaycaster.intersectObjects(photoMeshes);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    if (clickedObject.userData.url) {
      window.open(clickedObject.userData.url, '_blank');
    }
  }
});

function animateModels(delta) {
  if (!controls.isLocked) return;

  const speedMultiplier = 50; // Base movement speed
  const acceleration = 20; // How quickly to reach max speed
  const friction = 0.85; // Friction to slow down smoothly

  // Update velocity based on input
  const targetMovement = calculateMovement(delta, speedMultiplier);
  velocity.lerp(targetMovement, acceleration * delta); // Gradually approach target velocity

  // Predict the next position based on velocity
  const nextPosition = camera.position.clone().add(velocity.clone().multiplyScalar(delta));

  // Check if the next position is within walkable areas
  if (isOnWalkableArea(nextPosition)) {
    // Apply velocity and move the camera
    camera.position.copy(nextPosition);
  } else {
    console.log('Blocked! Stay within walkable path.');
    // Stop velocity if collision occurs
    velocity.set(0, 0, 0);
  }

  // Apply friction for smoother stopping
  velocity.multiplyScalar(friction);
}
function calculateMovement(delta, speedMultiplier) {
  // Get the camera's forward direction
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0; // Ignore vertical movement
  forward.normalize();

  // Get the camera's right direction
  const right = new THREE.Vector3();
  right.crossVectors(forward, camera.up).normalize();
  const velocity = new THREE.Vector3(); // Holds the current movement velocity

  // Calculate target velocity based on WASD input
  const movement = new THREE.Vector3();
  if (move.forward) movement.add(forward.multiplyScalar(speedMultiplier));
  if (move.backward) movement.add(forward.multiplyScalar(-speedMultiplier));
  if (move.left) movement.add(right.multiplyScalar(-speedMultiplier)); // Negative for left
  if (move.right) movement.add(right.multiplyScalar(speedMultiplier)); // Positive for right

  return movement;
}

// Main animation loop
const clock = new THREE.Clock();
function draw() {
  const delta = clock.getDelta();

  // Update animation mixers
  animationMixers.forEach((mixer) => {
    mixer.update(delta);
  });

  // Handle movement and rendering
  animateModels(delta);
  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// Create an HTML element to display camera coordinates
const cameraInfo = document.createElement('div');
cameraInfo.style.position = 'absolute';
cameraInfo.style.top = '5px';
cameraInfo.style.left = '5px';
cameraInfo.style.padding = '5px';
cameraInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
cameraInfo.style.color = 'white';
cameraInfo.style.fontFamily = 'Arial, sans-serif';
cameraInfo.style.fontSize = '8px';
cameraInfo.style.borderRadius = '3px';
cameraInfo.style.zIndex = '5';
document.body.appendChild(cameraInfo);

// Update the coordinates dynamically in the render loop
function updateCameraInfo() {
  const { x, y, z } = camera.position;
  cameraInfo.textContent = `Camera Coordinates:\nX: ${x.toFixed(2)}\nY: ${y.toFixed(2)}\nZ: ${z.toFixed(2)}`;
}

// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Example: Move camera dynamically (can be customized)
  camera.position.x += 0.0001;
  camera.position.y += 0.0001;
  camera.position.z += 0.0001;

  // Update the camera info display
  updateCameraInfo();

  // Render the scene
  renderer.render(scene, camera);
}

animate();

////********** */
// Start animation
draw();
