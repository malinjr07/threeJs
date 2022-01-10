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
  particleSize: 0.035,
  color: '#ffffff',
  attenuation: true,
};

const count = 500;

const clock = new THREE.Clock();

// TextureLoader

const textureLoader = new THREE.TextureLoader();

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

const geometry = new THREE.BufferGeometry();
const position = new Float32Array(count * 3);

for (let index = 0; index < position * 3; index++) {
  position[index] = (Math.random() - 0.5) * 2;
}

geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

const material = new THREE.PointsMaterial();
material.size = obj.particleSize;
material.sizeAttenuation = obj.attenuation;
const mesh = new THREE.Points(geometry, material);
view.add(mesh);

// Debugers

const particle = gui.addFolder('Particle');

particle.add(material, 'size').min(0.01).max(0.1).step(0.01).name('Size');
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
