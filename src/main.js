import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

/**
 * Texture Loader
 */

const textureLoader = new THREE.TextureLoader();

/**
 * Canvas Init
 */

const canvas = document.getElementById('artBoard');

/**
 * Scene Init
 */

const scene = new THREE.Scene();

/**
 * Properties
 */

const props = {
  fullWidth: window.innerWidth,
  fullHeight: window.innerHeight,
  floorColor: '#a9c388',
};

/**
 * Floor Init
 */

const base = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshBasicMaterial({ color: props.floorColor })
);

base.rotation.x = -Math.PI * 0.5;
base.position.y = 0;
scene.add(base);
/**
 * Camera Init
 */

const camera = new THREE.PerspectiveCamera(
  75,
  props.fullWidth / props.fullHeight,
  0.1,
  1000
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

/**
 * Controls Init
 */

const controller = new OrbitControls(camera, canvas);

// Rotation Limit to Ground

controller.maxPolarAngle = Math.PI / 2;
controller.enableDamping = true;

/**
 * Renderer Init
 */

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(props.fullWidth, props.fullHeight);
renderer.setPixelRatio = Math.min(window.devicePixelRatio, 2);

/**
 * Debugger Init
 */

const gui = new dat.GUI();

const floor = gui.addFolder('Floor');

floor.add(base.position, 'x').min(-10).max(10).step(1).name('Position X');
floor.add(base.position, 'y').min(-10).max(10).step(1).name('Position Y');
floor.add(base.position, 'z').min(-10).max(10).step(1).name('Position Z');
floor
  .addColor(props, 'floorColor')
  .name('Color')
  .onChange(() => {
    base.material.color.set(props.floorColor);
  });
// gui
//   .add(controller, 'minPolarAngle')
//   .min(0)
//   .max(Math.PI)
//   .step(0.01)
//   .name('Orbit limit');

// floor.open();

/**
 * Resize Responsive
 */

window.addEventListener('resize', () => {
  props.fullWidth = window.innerWidth;
  props.fullHeight = window.innerHeight;

  camera.aspect = props.fullWidth / props.fullHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(props.fullWidth, props.fullHeight);
  renderer.setPixelRatio = Math.min(window.devicePixelRatio, 2);
});

/**
 * Rendered
 */

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controller.update();
};
animate();
