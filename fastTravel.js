import * as THREE from 'three';

// Define Fast Travel Locations
const fastTravelLocations = [
    { name: "Left Wall", position: { x: -38, y: 20, z: 0 } },
    { name: "Right wall ", position: { x: 50, y: 20, z: 0 } },
    { name: "Statue", position: { x: 3, y: 20, z: 20 } },
    { name: "Forward", position: { x: 0, y: 20, z: -35 } },
    { name: "Entrence Door", position: { x: -6, y: 20, z: 82 } },
];

/**
 * Initializes the Fast Travel Menu
 * @param {THREE.PerspectiveCamera} camera - The Three.js camera
 */
function initializeFastTravelMenu(camera) {
    const menu = document.getElementById('fast-travel-menu');
    const select = document.getElementById('fast-travel-select');
    const button = document.getElementById('fast-travel-button');

    // Populate the dropdown menu with locations
    fastTravelLocations.forEach((location, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = location.name;
        select.appendChild(option);
    });

    // Handle travel button click
    button.addEventListener('click', () => {
        const selectedIndex = select.value;

        if (selectedIndex === "") {
            alert("Please select a location!");
            return;
        }

        const destination = fastTravelLocations[selectedIndex].position;

        // Smoothly move the camera to the selected destination
        smoothCameraMove(camera, destination);
    });
}

/**
 * Smoothly moves the camera to a target position
 * @param {THREE.PerspectiveCamera} camera - The Three.js camera
 * @param {Object} targetPosition - Target position {x, y, z}
 */
function smoothCameraMove(camera, targetPosition) {
    const duration = 1; // Duration in seconds
    const startTime = performance.now();
    const startPosition = camera.position.clone();

    function animate() {
        const elapsed = (performance.now() - startTime) / 1000;
        const t = Math.min(elapsed / duration, 1); // Progress (0 to 1)

        // Interpolate camera position
        camera.position.lerpVectors(
            startPosition,
            new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
            t
        );

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// Export the function to initialize the fast travel menu
export { initializeFastTravelMenu };
