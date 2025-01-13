import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import { Sky } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/objects/Sky.js';

export function createSky(scene) {
  // Add a sky object to the scene
  const sky = new Sky();
  sky.scale.set(200, 200, 200); // Cover the entire scene
  scene.add(sky);

  // Configure the sky material for a balanced blue sky
  const skyUniforms = sky.material.uniforms;
  skyUniforms['turbidity'].value = 4; // Slightly hazy sky
  skyUniforms['rayleigh'].value = 2.5; // Subtle blue scattering
  skyUniforms['mieCoefficient'].value = 0.003; // Reduce glare
  skyUniforms['mieDirectionalG'].value = 0.7; // Soften the sun glow

  // Calculate sun position for softer lighting
  const sun = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(90 - 20); // Sun elevation (20° above horizon)
  const theta = THREE.MathUtils.degToRad(180);   // Sun azimuth angle
  sun.setFromSphericalCoords(1, phi, theta);
  skyUniforms['sunPosition'].value.copy(sun);

  // Add a directional light to mimic sunlight
  const directionalLight = new THREE.DirectionalLight(0xfff1d0, 0.5); // Warm light, reduced intensity
  directionalLight.position.set(sun.x, sun.y, sun.z);
  scene.add(directionalLight);

  console.log('Balanced blue sky with softer sunlight added to the scene.');
}
