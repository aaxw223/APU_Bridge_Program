import * as t from "three";

const fastTravelLocations = [
    {
        name: "Our Artwork",
        position: { x: 0.61, y: 20, z: -45.49 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    {
        name: "Japanese Arts 1-2",
        position: { x: -57.96, y: 20, z: 71.05 },
        rotation: { x: 1.563, y: 1.462, z: -1.563 }
    },
    {
        name: "Japanese Arts 3-4",
        position: { x: -58.9, y: 20, z: -9.16 },
        rotation: { x: 1.641, y: 1.497, z: -1.641 }
    },
    {
        name: "Bangladeshi Arts",
        position: { x: -48.3, y: 20, z: -49.05 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    {
        name: "Vietnam Arts",
        position: { x: 51.85, y: 20, z: -45.19 },
        rotation: { x: 0, y: 0, z: 0  }
    },
    {
        name: "Myanmar 1-2",
        position: { x: 54.65, y: 20, z: -16.97 },
        rotation: { x: 1.408, y: -1.467, z: 1.407 }
    },
    {
        name: "Myanmar 3-4",
        position: { x: 50.23, y: 20, z: 105.75 },
        rotation: { x: 1.383, y: -1.438, z: 1.382 }
    },
    {
        name: "Statue",
        position: { x: 4.47, y: 20, z: 40.75 },
        rotation: { x: -0.086, y: 0.022, z: 0.002 }
    }
];

function initializeFastTravelMenu(camera) {
    const fastTravelMenu = document.getElementById("fast-travel-menu");
    const selectElement = document.getElementById("fast-travel-select");
    const travelButton = document.getElementById("fast-travel-button");

    // Populate the dropdown with locations
    fastTravelLocations.forEach((location, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = location.name;
        selectElement.appendChild(option);
    });

    // Add click event to the "Travel" button
    travelButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent pointer lock logic from triggering
        const selectedValue = selectElement.value;

        if (selectedValue === "") {
            alert("Please select a location!");
            return;
        }

        const location = fastTravelLocations[selectedValue];
        smoothCameraMove(camera, location);
    });

    // Prevent pointer lock when interacting with the dropdown
    selectElement.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent pointer lock logic from triggering
    });
}

// Function to smoothly move the camera to the selected location
function smoothCameraMove(camera, location) {
    const startTime = performance.now();
    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();

    // Animation loop
    (function animate() {
        const elapsedTime = (performance.now() - startTime) / 1000; // Seconds
        const progress = Math.min(elapsedTime / 1, 1); // Cap progress at 1 (100%)

        // Interpolate position and rotation
        camera.position.lerpVectors(
            startPosition,
            new t.Vector3(location.position.x, location.position.y, location.position.z),
            progress
        );

        camera.rotation.x = t.MathUtils.lerp(startRotation.x, location.rotation.x, progress);
        camera.rotation.y = t.MathUtils.lerp(startRotation.y, location.rotation.y, progress);
        camera.rotation.z = t.MathUtils.lerp(startRotation.z, location.rotation.z, progress);

        // Continue animation until complete
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    })();
}

export { initializeFastTravelMenu };
