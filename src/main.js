import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import * as dat from 'dat.gui';

/**
 * Debugger Init
 */

const gui = new dat.GUI();

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
};

/**
 * Camera Init
 */

const camera = new THREE.PerspectiveCamera(
  75,
  props.fullWidth / props.fullHeight,
  0.1,
  1000
);
scene.add(camera);

/**
 * Controls Init
 */

const controller = new OrbitControls(camera, canvas);
controller.enableDamping = true;

/**
 * Renderer Init
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(props.fullWidth, props.fullHeight);
renderer.setPixelRatio = Math.min(window.devicePixelRatio, 2);
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
 * Texture Loader
 */

const textureLoader = new THREE.TextureLoader();

/**
 * Floor Init
 */

const base = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: '#a9c388' })
);

base.position.x = -Math.PI * 0.5;
base.position.y = 0;
scene.add(base);
