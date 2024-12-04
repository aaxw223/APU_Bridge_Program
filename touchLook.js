export function initializeTouchLook(camera, renderer) {
    // Variables to track touch movement
    let isTouching = false;
    let lastTouchX = 0;
    let lastTouchY = 0;

    // Sensitivity for touch controls
    const rotationSpeed = 0.002; // Adjust for smoother or faster movement

    // Detect if the device is a mobile device
    function isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /Android|iPhone|iPad|iPod/i.test(userAgent);
    }

    // If not mobile, return a no-op function
    if (!isMobileDevice()) {
        console.log('Touch-based look is disabled for non-mobile devices.');
        return () => {}; // No operation
    }

    console.log('Facebook-like touch movement enabled for mobile devices.');

    // Add event listeners for touch
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
            const deltaX = touch.clientX - lastTouchX;
            const deltaY = touch.clientY - lastTouchY;

            // Rotate the camera in the opposite direction of the swipe
            camera.rotation.y += deltaX * rotationSpeed; // Horizontal rotation (Y-axis)
            camera.rotation.x += deltaY * rotationSpeed; // Vertical rotation (X-axis)

            // Clamp vertical rotation to prevent flipping
            camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

            // Update last touch position
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
        }
    });

    renderer.domElement.addEventListener('touchend', () => {
        isTouching = false; // Stop tracking touch on interaction end
    });

    // Return a no-op function as all logic is handled in touchmove
    return () => {};
}
