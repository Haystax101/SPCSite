import * as THREE from 'three';
const width = 1920, height = 1080;
const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 8000);
camera.rotation.order = 'YXZ';

const sceneState = {
  cameraX: -300, cameraY: 200, cameraZ: 500,
  rotationX: -0.25, rotationY: 0, rotationZ: 0,
  planeRotationZ: 0, heightScale: 40, panX: 0, panY: 0
};
camera.position.set(sceneState.cameraX, sceneState.cameraY, sceneState.cameraZ);
camera.rotation.set(sceneState.rotationX, sceneState.rotationY, sceneState.rotationZ);
camera.updateMatrixWorld(true);

const terrain = new THREE.Mesh();
terrain.rotation.x = -Math.PI / 2;
terrain.rotation.z = sceneState.planeRotationZ;
terrain.updateMatrixWorld(true);

const loc = new THREE.Vector3(151, -273, 0.95 * sceneState.heightScale);
terrain.localToWorld(loc);
loc.project(camera);

let left = ((loc.x * 0.5 + 0.5) * 100).toFixed(3);
let top = ((-(loc.y * 0.5) + 0.5) * 100).toFixed(3);
console.log(`left: ${left}%, top: ${top}%`);
