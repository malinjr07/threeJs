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

// Group

const house = new THREE.Group();
scene.add(house);

// Walls

const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 3, 4),
  new THREE.MeshStandardMaterial({ color: '#ac8e82' })
);

walls.position.y = walls.geometry.parameters.height / 2;
house.add(walls);

// Roof

const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 2, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.position.y =
  walls.geometry.parameters.height + roof.geometry.parameters.height / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door

const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 2),
  new THREE.MeshBasicMaterial({ color: '#ffffff' })
);
door.position.z = walls.geometry.parameters.depth / 2 + 0.1;
door.position.y = door.geometry.parameters.height / 2 + 0.01;
house.add(door);

// Bushes

const bushGeo = new THREE.SphereBufferGeometry(0.5, 8, 8);
const bushMesh = new THREE.MeshStandardMaterial({ color: '#89c854' });
const bush1 = new THREE.Mesh(bushGeo, bushMesh);
const bush2 = new THREE.Mesh(bushGeo, bushMesh);
const bush3 = new THREE.Mesh(bushGeo, bushMesh);

bush1.position.z = walls.geometry.parameters.depth / 2 + 1;
bush1.position.x = walls.geometry.parameters.depth / 2 + 1;
bush2.position.z = walls.geometry.parameters.depth / 2 + 1.5;
bush2.position.x = walls.geometry.parameters.depth / 2 + 1.5;
bush3.position.z = bush2.position.z;
bush3.position.x = walls.geometry.parameters.depth / 2 + 1.8;
// bush2.position.y = bush2.geometry.parameters.widthSegments + 0.5;
console.log(bush2);
scene.add(bush1);
scene.add(bush2);
scene.add(bush3);

/**
 * Lights Init
 */

// Ambient Light

const ambient = new THREE.AmbientLight(props.ambient, props.ambientOpacity);

scene.add(ambient);

// Directional light

const moonlight = new THREE.DirectionalLight('#ffffff', 0.5);
moonlight.position.set(4, 5, -2);
scene.add(moonlight);

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
camera.position.z = 9;
scene.add(camera);

/**
 * Controls Init
 */

const controller = new OrbitControls(camera, canvas);

// Rotation Limit to Ground

// controller.maxPolarAngle = Math.PI / 2 - 0.1;
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
