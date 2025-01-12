import * as t from "three";
let fastTravelLocations = [{
    name: "Our Artwork",
    position: {
        x: .61,
        y: 20,
        z: -45.49
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    }
},{
    name: "Japanese Arts 1-2",
    position: {
        x: -57.96,
        y: 20,
        z: 89.05
    },
    rotation: {
        x: 1.563,
        y: 1.462,
        z: -1.563
    }
}, {
    name: "Japanese Arts 3-4",
    position: {
        x: -58.9,
        y: 20,
        z: 7.16
    },
    rotation: {
        x: 1.641,
        y: 1.497,
        z: -1.641
    }
}, {
    name: "Bangladeshi Arts",
    position: {
        x: -48.3,
        y: 20,
        z: -49.05
    },
    rotation: {
        x: .156,
        y: .868,
        z: -.12
    }
},  {
    name: "Vietnam Arts",
    position: {
        x: 51.85,
        y: 20,
        z: -45.19
    },
    rotation: {
        x: .118,
        y: -.728,
        z: .079
    }
}, {
    name: "Myanmar 1-2",
    position: {
        x: 54.65,
        y: 20,
        z: -2.97
    },
    rotation: {
        x: 1.408,
        y: -1.467,
        z: 1.407
    }
}, {
    name: "Myanmar 3-4",
    position: {
        x: 50.23,
        y: 20,
        z: 86.75
    },
    rotation: {
        x: 1.383,
        y: -1.438,
        z: 1.382
    }
}, {
    name: "Statue",
    position: {
        x: 4.47,
        y: 20,
        z: 30.75
    },
    rotation: {
        x: -.086,
        y: .022,
        z: .002
    }
}];

function initializeFastTravelMenu(t) {
    document.getElementById("fast-travel-menu");
    let o = document.getElementById("fast-travel-select"),
        e = document.getElementById("fast-travel-button");
    fastTravelLocations.forEach((t, e) => {
        let n = document.createElement("option");
        n.value = e, n.textContent = t.name, o.appendChild(n)
    }), e.addEventListener("click", () => {
        let e = o.value;
        if ("" === e) {
            alert("Please select a location!");
            return
        }
        let n = fastTravelLocations[e];
        smoothCameraMove(t, n)
    })
}

function smoothCameraMove(o, e) {
    let n = performance.now(),
        a = o.position.clone(),
        i = o.rotation.clone();
    ! function $() {
        let r = (performance.now() - n) / 1e3,
            s = Math.min(r / 1, 1);
        o.position.lerpVectors(a, new t.Vector3(e.position.x, e.position.y, e.position.z), s), o.rotation.x = t.MathUtils.lerp(i.x, e.rotation.x, s), o.rotation.y = t.MathUtils.lerp(i.y, e.rotation.y, s), o.rotation.z = t.MathUtils.lerp(i.z, e.rotation.z, s), s < 1 && requestAnimationFrame($)
    }()
}
export {
    initializeFastTravelMenu
};
