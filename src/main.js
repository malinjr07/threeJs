import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
/**
 * Debugger Init
 */

const gui = new dat.GUI();
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
  ambient: '#ffffff',
  ambientOpacity: 0.5,
};

/**
 * Materials
 */

/* Floor */

const base = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: props.floorColor })
);

base.rotation.x = -Math.PI * 0.5;
base.position.y = 0;
scene.add(base);

// Debugger

const floor = gui.addFolder('Floor');
// floor.add(base.position, 'x').min(-10).max(10).step(1).name('Position X');
floor
  .addColor(props, 'floorColor')
  .name('Color')
  .onChange(() => {
    base.material.color.set(props.floorColor);
  });

floor.open();

/* House */

/**
 * Lights Init
 */

// Ambient Light

const ambient = new THREE.AmbientLight(props.ambient, props.ambientOpacity);

scene.add(ambient);

// Directional light

const moonlight = new THREE.DirectionalLight('#ffffff', 0.5);
moonlight.position.set(4, 5, -2);
// Debugger
const lights = gui.addFolder('Lights');

const moonDebug = lights.addFolder('Point Light');
const ambientDebug = lights.addFolder('Ambient Light');

ambientDebug
  .add(props, 'ambientOpacity')
  .min(0)
  .max(1)
  .step(0.01)
  .name('Intensity')
  .onChange(() => {
    ambient.intensity = props.ambientOpacity;
  });

lights.open();
ambientDebug.open();

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
