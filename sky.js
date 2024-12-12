import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

export async function createSky(scene) {
  // Dynamically import the Sky object
  const { Sky } = await import('https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/objects/Sky.js');

  // Create and configure the Sky object
  const sky = new Sky();
  sky.scale.setScalar(500); // Scale to cover the entire scene
  scene.add(sky);

  // Configure Sky shader parameters
  const skyUniforms = sky.material.uniforms;
  skyUniforms['turbidity'].value = 12; // Increase haziness
  skyUniforms['rayleigh'].value = 3; // Enhance blue scattering
  skyUniforms['mieCoefficient'].value = 0.003; // Reduce glare
  skyUniforms['mieDirectionalG'].value = 0.6; // Soften sun glow

  // Calculate and set Sun position
  const sun = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(90 - 10); // Elevation angle
  const theta = THREE.MathUtils.degToRad(180);   // Azimuth angle
  sun.setFromSphericalCoords(1, phi, theta);
  skyUniforms['sunPosition'].value.copy(sun);

  // Add a directional light to mimic the Sun
  const directionalLight = new THREE.DirectionalLight(0xffffff, .01); // Full intensity
  directionalLight.position.set(sun.x, sun.y, sun.z);
  scene.add(directionalLight);

  console.log('Sky and Sun successfully added to the scene.');
}
