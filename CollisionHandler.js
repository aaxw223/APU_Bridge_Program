import * as THREE from 'three';

export class CollisionHandler {
  constructor() {
    this.collidableObjects = [];
  }

  addCollidable(object) {
    if (object.isMesh && object.geometry) {
      object.geometry.computeBoundingBox();
      const boundingBox = new THREE.Box3().setFromObject(object);
      this.collidableObjects.push({ mesh: object, boundingBox });
    }
  }

  updateBoundingBoxes() {
    this.collidableObjects.forEach(({ mesh }) => {
      if (mesh.geometry) mesh.geometry.computeBoundingBox();
    });
  }

  checkCollisions(playerPosition, tolerance = 0.2) {
    for (const { boundingBox } of this.collidableObjects) {
      const expandedBox = boundingBox.clone().expandByScalar(tolerance);
      if (expandedBox.containsPoint(playerPosition)) return true;
    }
    return false;
  }
}
