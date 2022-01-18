import * as THREE from 'three';
import './style.css';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Dom

const canvas = document.getElementById('artBoard');

// Global Properties

const obj = {
  width: window.innerWidth,
  height: window.innerHeight,
  color: '#ffffff',
};

const clock = new THREE.Clock();

// TextureLoader

const textureLoader = new THREE.TextureLoader();

console.log(textureLoader);

// Debugger

const gui = new dat.GUI();

// Scene

const view = new THREE.Scene();

// Light

const light = new THREE.AmbientLight(0xffffff, 1);
view.add(light);

// Camera

const camera = new THREE.PerspectiveCamera(
  75,
  obj.width / obj.height,
  0.1,
  1000
);
camera.position.z = 4;
view.add(camera);

// Controller

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Model

const material = new THREE.MeshStandardMaterial({ color: obj.color });
const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, material);
view.add(cube);

// Responsive

window.addEventListener('resize', () => {
  obj.width = window.innerWidth;
  obj.height = window.innerHeight;

  camera.aspect = obj.width / obj.height;
  camera.updateProjectionMatrix();
  renderer.setSize(obj.width, obj.height);
  renderer.setPixelRatio = Math.min(window.devicePixelRatio, 2);
});

// render

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(obj.width, obj.height);

const action = () => {
  requestAnimationFrame(action);
  controls.update();
  renderer.render(view, camera);
};
action();
