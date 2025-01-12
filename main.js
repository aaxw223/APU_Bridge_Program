import * as e from "three";
import {
    PointerLockControls as t
} from "three/addons/controls/PointerLockControls.js";
import {
    GLTFLoader as o
} from "three/addons/loaders/GLTFLoader.js";
import {
    initializeFastTravelMenu as i
} from "./fastTravel.js";
import {
    initializeTouchLook as a
} from "./touchLook.js";
let canvas = document.querySelector("#three-canvas"),
    renderer = new e.WebGLRenderer({
        canvas,
        antialias: !0
    });
renderer.setSize(window.innerWidth, window.innerHeight), renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
let scene = new e.Scene;
scene.background = new e.Color("white");
let camera = new e.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1e3);
camera.position.set(-7, 20, 124), scene.add(camera), i(camera);
let updateCameraRotation = a(camera, renderer),
    ambientLight = new e.AmbientLight("white", .01);
scene.add(ambientLight), renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Get references to menu and side menu elements
let menu = document.getElementById("fast-travel-menu");
menu.style.display = "block";
menu.style.visibility = "visible";

let controls = new t(camera, renderer.domElement);

// Handle pointer unlock event
controls.addEventListener("unlock", () => {
    console.log("Pointer unlocked");
});

// Consolidated click event listener
document.addEventListener("click", (e) => {
    const excludedSelectors = [
        "#menu-btn",
        "#side-menu",
        "#fast-travel-menu",
        "#fast-travel-select",
        "#fast-travel-button",
        "#control-container"
    ];

    // Check if the clicked element matches any excluded selectors
    const isExcluded = excludedSelectors.some((selector) => e.target.closest(selector));
    if (isExcluded) {
        console.log("Pointer lock prevented on excluded element.");
        return;
    }

    // Lock pointer if not already locked
    if (!controls.isLocked) {
        controls.lock();
        console.log("Pointer locked for scene.");
    }
});

// Handle side menu toggling
let sideMenu = document.getElementById("side-menu");
let menuBtn = document.getElementById("menu-btn");
let closeBtn = document.getElementById("close-btn");

// Open side menu and disable pointer lock
menuBtn.addEventListener("click", () => {
    sideMenu.style.width = "250px";
    menuBtn.style.display = "none";
    closeBtn.style.display = "block";
    controls.unlock(); // Unlock pointer
    console.log("Pointer lock disabled for side menu");
});

// Close side menu and allow pointer lock
closeBtn.addEventListener("click", () => {
    sideMenu.style.width = "0";
    menuBtn.style.display = "block";
    closeBtn.style.display = "none";
    console.log("Pointer lock can be re-enabled");
});
// Get a reference to the ESC note element
const escNote = document.getElementById("esc-note");

// Pointer lock event listeners
controls.addEventListener("lock", () => {
    console.log("Pointer locked");
    escNote.style.display = "block"; // Show the ESC note
});

controls.addEventListener("unlock", () => {
    console.log("Pointer unlocked");
    escNote.style.display = "none"; // Hide the ESC note
});

// Initialize with the element hidden
escNote.style.display = "none";

let velocity = new e.Vector3,
    direction = new e.Vector3,
    move = {
        forward: !1,
        backward: !1,
        left: !1,
        right: !1
    };

function animateModels(e) {
    if (!controls.isLocked) return;
    let t = calculateMovement(e, 50);
    velocity.lerp(t, 20 * e);
    let o = camera.position.clone().add(velocity.clone().multiplyScalar(e));
    isOnWalkableArea(o) ? camera.position.copy(o) : (console.log("Blocked! Stay within walkable path."), velocity.set(0, 0, 0)), velocity.multiplyScalar(.85)
}

function calculateMovement(t, o) {
    let i = new e.Vector3;
    camera.getWorldDirection(i), i.y = 0, i.normalize();
    let a = new e.Vector3;
    a.crossVectors(i, camera.up).normalize(), new e.Vector3;
    let r = new e.Vector3;
    return move.forward && r.add(i.multiplyScalar(o)), move.backward && r.add(i.multiplyScalar(-o)), move.left && r.add(a.multiplyScalar(-o)), move.right && r.add(a.multiplyScalar(o)), r
}
document.addEventListener("keydown", e => {
    switch (e.code) {
        case "KeyW":
            move.forward = !0;
            break;
        case "KeyS":
            move.backward = !0;
            break;
        case "KeyA":
            move.left = !0;
            break;
        case "KeyD":
            move.right = !0
    }
}), document.addEventListener("keyup", e => {
    switch (e.code) {
        case "KeyW":
            move.forward = !1;
            break;
        case "KeyS":
            move.backward = !1;
            break;
        case "KeyA":
            move.left = !1;
            break;
        case "KeyD":
            move.right = !1
    }
});
let gltfLoader = new o,
    animationMixers = [];

function loadAnimatedCharacter(t, o, i, a = {
    x: 0,
    y: 0,
    z: 0
}) {
    gltfLoader.load(t, r => {
        let n = r.scene;
        n.position.set(o.x, o.y, o.z), n.scale.set(i, i, i), n.rotation.set(a.x, a.y, a.z), scene.add(n);
        let l = new e.AnimationMixer(n);
        animationMixers.push(l), r.animations.forEach(e => {
            l.clipAction(e).play()
        }), console.log(`Character loaded: ${t}`)
    }, void 0, e => console.error(`Error loading ${t}:`, e))
}
loadAnimatedCharacter("./man.glb", {
    x: -10,
    y: 5,
    z: 80
}, 3.5, {
    x: 0,
    y: -(Math.PI / 2.2),
    z: 0
}), loadAnimatedCharacter("./shirt.glb", {
    x: -10,
    y: 2.5,
    z: -71
}, 12, {
    x: 0,
    y: 0,
    z: 0
}),gltfLoader.load("./vr_gallery.glb", e => {
    let t = e.scene;
    t.scale.set(8, 8, 8), t.position.set(0, .5, 0), scene.add(t), console.log("Shop scene loaded.")
}), gltfLoader.load("./cow.glb", e => {
    let t = e.scene;
    t.scale.set(1, 1, 1), t.position.set(0, 2, 0), scene.add(t), console.log("cow scene loaded.")
});
import {
    createSky as r
} from "./sky.js";
r(scene);
let floorMesh = new e.Mesh(new e.PlaneGeometry(300, 300), new e.MeshLambertMaterial({
    color: "burlywood"
}));
floorMesh.rotation.x = -Math.PI / 2, scene.add(floorMesh);
let walkableMaterial = new e.MeshBasicMaterial({
        color: 65280,
        visible: !1
    }),
    walkableArea1 = new e.Mesh(new e.PlaneGeometry(167, 120), walkableMaterial);
walkableArea1.rotation.x = -Math.PI / 2, walkableArea1.position.set(0, 1, 65), scene.add(walkableArea1);
let walkableArea2 = new e.Mesh(new e.PlaneGeometry(60, 125), walkableMaterial);
walkableArea2.rotation.x = -Math.PI / 2, walkableArea2.position.set(47, 1, -20), scene.add(walkableArea2);
let walkableArea3 = new e.Mesh(new e.PlaneGeometry(70, 125), walkableMaterial);
walkableArea3.rotation.x = -Math.PI / 2, walkableArea3.position.set(-47, 1, -20), scene.add(walkableArea3);
let walkableArea4 = new e.Mesh(new e.PlaneGeometry(167, 60), walkableMaterial);
walkableArea4.rotation.x = -Math.PI / 2, walkableArea4.position.set(0, 1, -50), scene.add(walkableArea4);
let walkableAreas = [walkableArea1, walkableArea2, walkableArea3, walkableArea4],
    groundRaycaster = new e.Raycaster,
    rayDirection = new e.Vector3(0, -1, 0);

function isOnWalkableArea(t) {
    groundRaycaster.set(new e.Vector3(t.x, t.y + 10, t.z), rayDirection);
    let o = groundRaycaster.intersectObjects(walkableAreas);
    return o.length > 0
}
let textureLoader = new e.TextureLoader,
    photoMeshes = [],
    mediaItems = [{
        type: "image",
        path: "./bd1.png",
        size: {
            width: 16,
            height: 24
        },
        position: {
            x: -50,
            y: 29,
            z: -85
        },
        rotation: {
            x: 0,
            y: Math.PI / .1,
            z: 0
        }
    }, {
        type: "image",
        path: "./bd2.png",
        size: {
            width: 30,
            height: 20
        },
        position: {
            x: -84,
            y: 29,
            z: -52
        },
        rotation: {
            x: 0,
            y: Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./jp4.1.png",
        size: {
            width: 25,
            height: 10
        },
        position: {
            x: -84,
            y: 35,
            z: -10
        },
        rotation: {
            x: 0,
            y: Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./jp4.2.png",
        size: {
            width: 25,
            height: 10
        },
        position: {
            x: -84,
            y: 22,
            z: -10
        },
        rotation: {
            x: 0,
            y: Math.PI / 2,
            z: 0
        }
    }, {
        type: "video",
        path: "./jp4.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: -82,
            y: 12,
            z: -10
        },
        rotation: {
            x: -(Math.PI / .48),
            y: Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./jp3.png",
        size: {
            width: 30,
            height: 20
        },
        position: {
            x: -84,
            y: 29,
            z: 30
        },
        rotation: {
            x: 0,
            y: Math.PI / 2,
            z: 0
        }
    }, {
        type: "video",
        path: "./jp3.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: -82,
            y: 12,
            z: 30
        },
        rotation: {
            x: -(Math.PI / .48),
            y: Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./jp2.png",
        size: {
            width: 30,
            height: 20
        },
        position: {
            x: -84,
            y: 29,
            z: 68
        },
        rotation: {
            x: 0,
            y: Math.PI / 2,
            z: 0
        }
    }, {
        type: "video",
        path: "./jp2.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: -82,
            y: 12,
            z: 70
        },
        rotation: {
            x: -(Math.PI / .48),
            y: Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./jp1.png",
        size: {
            width: 30,
            height: 20
        },
        position: {
            x: -84,
            y: 29,
            z: 107
        },
        rotation: {
            x: 0,
            y: Math.PI / 2,
            z: 0
        }
    }, {
        type: "video",
        path: "./jp1.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: -82,
            y: 12,
            z: 107
        },
        rotation: {
            x: -(Math.PI / .48),
            y: Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./M1.png",
        size: {
            width: 30,
            height: 20
        },
        position: {
            x: 85,
            y: 29,
            z: 104
        },
        rotation: {
            x: 0,
            y: -Math.PI / 2,
            z: 0
        }
    }, {
        type: "video",
        path: "./MN1.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: 83,
            y: 12,
            z: 106
        },
        rotation: {
            x: -(Math.PI / .48),
            y: -Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./M2.png",
        size: {
            width: 30,
            height: 20
        },
        position: {
            x: 84,
            y: 29,
            z: 63
        },
        rotation: {
            x: 0,
            y: -Math.PI / 2,
            z: 0
        }
    }, {
        type: "video",
        path: "./M2.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: 82,
            y: 12,
            z: 62
        },
        rotation: {
            x: -(Math.PI / .48),
            y: -Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./M3.png",
        size: {
            width: 30,
            height: 20
        },
        position: {
            x: 84,
            y: 29,
            z: 20
        },
        rotation: {
            x: 0,
            y: -Math.PI / 2,
            z: 0
        }
    }, {
        type: "video",
        path: "./M3.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: 82,
            y: 12,
            z: 21
        },
        rotation: {
            x: -(Math.PI / .48),
            y: -Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./M4.png",
        size: {
            width: 30,
            height: 20
        },
        position: {
            x: 84,
            y: 29,
            z: -20
        },
        rotation: {
            x: 0,
            y: -Math.PI / 2,
            z: 0
        }
    }, {
        type: "video",
        path: "./M4.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: 82,
            y: 12,
            z: -18
        },
        rotation: {
            x: -(Math.PI / .48),
            y: -Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./VN2.png",
        size: {
            width: 30,
            height: 20
        },
        position: {
            x: 84,
            y: 29,
            z: -60
        },
        rotation: {
            x: 0,
            y: -Math.PI / 2,
            z: 0
        }
    }, {
        type: "video",
        path: "./VN2.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: 82,
            y: 12,
            z: -57
        },
        rotation: {
            x: -(Math.PI / .48),
            y: -Math.PI / 2,
            z: 0
        }
    }, {
        type: "image",
        path: "./VN1.png",
        size: {
            width: 16,
            height: 24
        },
        position: {
            x: 52,
            y: 29,
            z: -85
        },
        rotation: {
            x: 0,
            y: Math.PI / .1,
            z: 0
        }
    }, {
        type: "video",
        path: "./VN.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: 52,
            y: 12,
            z: -83
        },
        rotation: {
            x: -(Math.PI / 8),
            y: 0,
            z: 0
        }
    }, {
        type: "video",
        path: "./bd2.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: -82,
            y: 12,
            z: -52
        },
        rotation: {
            x: -(Math.PI / .48),
            y: Math.PI / 2,
            z: 0
        }
    },  {
        type: "video",
        path: "./bd1.mp4",
        size: {
            width: 13,
            height: 7
        },
        position: {
            x: -51,
            y: 12,
            z: -82
        },
        rotation: {
            x: -(Math.PI / 8),
            y: 0,
            z: 0
        }
    }, {
        type: "video",
        path: "./cowvid.mp4",
        size: {
            width: 12,
            height: 6.8
        },
        position: {
            x: 20,
            y: 15,
            z: 5
        },
        rotation: {
            x: -(Math.PI / 3.4),
            y: 0,
            z: 0
        },
        url: "https://www.canva.com/design/DAGX-XTM0jY/neLikvhpi3Sdj-L6AGIrWw/watch?utm_content=DAGX-XTM0jY&utm_campaign=share_your_design&utm_medium=link&utm_source=shareyourdesignpanel"
    }];
mediaItems.forEach(t => {
    let o;
    if ("image" === t.type) {
        let i = textureLoader.load(t.path);
        o = new e.ShaderMaterial({
            uniforms: {
                uTexture: {
                    value: i
                },
                uBorderColor: {
                    value: new e.Color(0)
                },
                uBorderWidth: {
                    value: .01
                }
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec3 uBorderColor;
        uniform float uBorderWidth;
        varying vec2 vUv;
        void main() {
          float border = uBorderWidth;
          if (vUv.x < border || vUv.x > 1.0 - border || vUv.y < border || vUv.y > 1.0 - border) {
            gl_FragColor = vec4(uBorderColor, 1.0); // Border color
          } else {
            gl_FragColor = texture2D(uTexture, vUv);
          }
        }
      `
        })
    } else if ("video" === t.type) {
        let a = document.createElement("video");
        a.src = t.path, a.loop = !0, a.muted = !0, a.playsInline = !0, a.crossOrigin = "anonymous", a.play();
        let r = new e.VideoTexture(a);
        o = new e.ShaderMaterial({
            uniforms: {
                uTexture: {
                    value: r
                },
                uBorderColor: {
                    value: new e.Color(0)
                },
                uBorderWidth: {
                    value: .01
                }
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec3 uBorderColor;
        uniform float uBorderWidth;
        varying vec2 vUv;
        void main() {
          float border = uBorderWidth;
          if (vUv.x < border || vUv.x > 1.0 - border || vUv.y < border || vUv.y > 1.0 - border) {
            gl_FragColor = vec4(uBorderColor, 1.0); // Border color
          } else {
            gl_FragColor = texture2D(uTexture, vUv);
          }
        }
      `
        })
    }
    let n = new e.PlaneGeometry(t.size.width, t.size.height),
        l = new e.Mesh(n, o);
    if (l.position.set(t.position.x, t.position.y, t.position.z), t.rotation) {
        let s = new e.Euler(t.rotation.x, t.rotation.y, t.rotation.z, "YXZ");
        l.quaternion.setFromEuler(s)
    }
    scene.add(l), l.userData = {
        url: t.url
    }, photoMeshes.push(l)
});
let photoRaycaster = new e.Raycaster,
    mouse = new e.Vector2;

function isMobileDevice() {
    let e = navigator.userAgent || navigator.vendor || window.opera;
    return /Android|iPhone|iPad|iPod/i.test(e)
}
window.addEventListener("click", e => {
    mouse.x = e.clientX / window.innerWidth * 2 - 1, mouse.y = -(2 * (e.clientY / window.innerHeight)) + 1, photoRaycaster.setFromCamera(mouse, camera);
    let t = photoRaycaster.intersectObjects(photoMeshes);
    if (t.length > 0) {
        let o = t[0].object;
        o.userData.url && window.open(o.userData.url, "_blank")
    }
}), isMobileDevice() ? console.log("PointerLockControls disabled for mobile devices.") : (controls.addEventListener("lock", () => {
    console.log("Pointer locked.")
}), controls.addEventListener("unlock", () => {
    console.log("Pointer unlocked.")
}), document.addEventListener("click", () => {
    controls.lock()
})), isMobileDevice() && document.addEventListener("click", e => {
    e.preventDefault(), console.log("Pointer lock prevented on mobile.")
});
let clock = new e.Clock;

function draw() {
    let e = clock.getDelta();
    animationMixers.forEach(t => {
        t.update(e)
    }), animateModels(e), renderer.render(scene, camera), renderer.setAnimationLoop(draw)
}

function hideInstructions() {
    let e = document.getElementById("instructions"),
        t = document.getElementById("show-instructions-btn");
    e && (e.classList.add("fade-out"), setTimeout(() => {
        e.style.display = "none", t && (t.style.display = "block")
    }, 500))
}

function showInstructions() {
    let e = document.getElementById("instructions"),
        t = document.getElementById("show-instructions-btn");
    e && (e.style.display = "block", setTimeout(() => {
        e.classList.remove("fade-out"), e.classList.add("fade-in")
    }, 10), t && (t.style.display = "none"))
}
draw(), window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight, camera.updateProjectionMatrix(), renderer.setSize(window.innerWidth, window.innerHeight)
}), document.addEventListener("DOMContentLoaded", () => {
    let e = document.getElementById("instructions");
    if (e) {
        let t = document.createElement("button");
        t.innerHTML = "\xd7", t.classList.add("close-button"), e.appendChild(t), t.addEventListener("click", hideInstructions), setTimeout(hideInstructions, 6e4)
    }
    let o = document.createElement("button");
    o.id = "show-instructions-btn", o.textContent = "Show Instructions", o.classList.add("show-instructions-btn"), document.body.appendChild(o), o.addEventListener("click", showInstructions), o.style.display = "none"
}), renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1), draw();
