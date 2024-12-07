import * as THREE from 'three';

export function initializeTouchLook(camera, renderer) {
    // Variables to track touch movement
    let isTouching = false;
    let lastTouchX = 0;
    let lastTouchY = 0;

    // Sensitivity for touch controls
    const rotationSpeed = 0.002; // Adjust for smoother or faster movement

    console.log('Touch movement enabled for mobile devices.');

    // Create a target rotation quaternion
    const targetQuaternion = camera.quaternion.clone();

    renderer.domElement.addEventListener('touchstart', (event) => {
        if (event.touches.length === 1) {
            isTouching = true;
            lastTouchX = event.touches[0].clientX;
            lastTouchY = event.touches[0].clientY;
        }
    });

    renderer.domElement.addEventListener('touchmove', (event) => {
        if (isTouching && event.touches.length === 1) {
            const touch = event.touches[0];

            // Calculate deltas
            const deltaX = touch.clientX - lastTouchX; // Normal deltaX
            const deltaY = touch.clientY - lastTouchY; // Normal deltaY

            // Update last touch position
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;

            // Horizontal rotation (around world Y-axis, inverted)
            const horizontalQuaternion = new THREE.Quaternion();
            horizontalQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX * -rotationSpeed); // Inverted direction

            // Vertical rotation (around fixed right axis, inverted)
            const right = new THREE.Vector3(1, 0, 0); // Always use a fixed right axis
            const verticalQuaternion = new THREE.Quaternion();
            verticalQuaternion.setFromAxisAngle(right, deltaY * rotationSpeed); // Note: deltaY direction is intentionally normal to invert behavior

            // Apply rotations to the target quaternion
            targetQuaternion.premultiply(horizontalQuaternion); // Apply horizontal rotation
            targetQuaternion.multiply(verticalQuaternion); // Apply vertical rotation

            // Smoothly update the camera's quaternion
            camera.quaternion.slerp(targetQuaternion, 0.2); // Adjust the 0.2 factor for smoother motion
        }
    });

    renderer.domElement.addEventListener('touchend', () => {
        isTouching = false; // Stop tracking touch on interaction end
    });
}
