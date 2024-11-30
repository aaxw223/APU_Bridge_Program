import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

export async function createSky(scene) {
  // Import Sky dynamically to keep the main bundle clean
  const { Sky } = await import('https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/objects/Sky.js');

  // Create the Sky object
  const sky = new Sky();
  sky.scale.setScalar(1000); // Large scale to cover the entire scene
  scene.add(sky);

  // Sky shader parameters
  const skyUniforms = sky.material.uniforms;
  skyUniforms['turbidity'].value = 10; // Adjust haziness
  skyUniforms['rayleigh'].value = 2; // Adjust blue scattering
  skyUniforms['mieCoefficient'].value = 0.005; // Adjust glare
  skyUniforms['mieDirectionalG'].value = 0.8; // Adjust sun glow

  // Add a Sun to the sky
  const sun = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(90 - 10); // Elevation angle
  const theta = THREE.MathUtils.degToRad(180); // Azimuth angle
  sun.setFromSphericalCoords(1, phi, theta);
  skyUniforms['sunPosition'].value.copy(sun);

  // Add directional light to match the sun
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(sun.x, sun.y, sun.z);
  scene.add(directionalLight);

  console.log('Sky created and added to the scene.');
}
