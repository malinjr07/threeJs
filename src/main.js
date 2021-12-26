import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
/**
 * Properties
 */

const props = {
  fullWidth: window.innerWidth,
  fullHeight: window.innerHeight,
  ambient: '#b9b5ff',
  floorColor: '#a9c388',
  ambientOpacity: 0.12,
  fog: '#262837',
};

/**
 * Debugger Init
 */

const gui = new dat.GUI();

/**
 * FontLoader
 */

const fontLoader = new THREE.FontLoader();

fontLoader.load('./fonts/Squids.json', (font) => {
  const textGeo = new THREE.TextBufferGeometry('My heart without Rizu', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const textMat = new THREE.MeshBasicMaterial();
  textMat.wireframe = true;
  const text = new THREE.Mesh(textGeo, textMat);
  text.position.set(-5, 10, 0);
  text.rotation.set(-Math.PI / 2, 0, 0);
  scene.add(text);
});

/**
 * Texture Loader
 */

const textureLoader = new THREE.TextureLoader();

// Grasses
const grassAO = textureLoader.load('./textures/grass/ambientOcclusion.jpg');
const grassColor = textureLoader.load('./textures/grass/color.jpg');
const grassNormal = textureLoader.load('./textures/grass/normal.jpg');
const grassRough = textureLoader.load('./textures/grass/roughness.jpg');

grassAO.repeat.set(8, 8);
grassColor.repeat.set(8, 8);
grassNormal.repeat.set(8, 8);
grassRough.repeat.set(8, 8);
grassAO.wrapS = THREE.RepeatWrapping;
grassColor.wrapS = THREE.RepeatWrapping;
grassNormal.wrapS = THREE.RepeatWrapping;
grassRough.wrapS = THREE.RepeatWrapping;
grassAO.wrapT = THREE.RepeatWrapping;
grassColor.wrapT = THREE.RepeatWrapping;
grassNormal.wrapT = THREE.RepeatWrapping;
grassRough.wrapT = THREE.RepeatWrapping;

// Door Texture

const doorNormal = textureLoader.load('./textures/door/normal.jpg');
const doorAlpha = textureLoader.load('./textures/door/alpha.jpg');
const doorColor = textureLoader.load('./textures/door/color.jpg');
const doorMetal = textureLoader.load('./textures/door/metalness.jpg');
const doorRough = textureLoader.load('./textures/door/roughness.jpg');
const doorHeight = textureLoader.load('./textures/door/height.jpg');
const doorAO = textureLoader.load('./textures/door/ambientOcclusion.jpg');

// Wall Texture
const wallAO = textureLoader.load('./textures/bricks/ambientOcclusion.jpg');
const wallColor = textureLoader.load('./textures/bricks/color.jpg');
const wallNormal = textureLoader.load('./textures/bricks/normal.jpg');
const wallRough = textureLoader.load('./textures/bricks/roughness.jpg');

/**
 * Canvas Init
 */

const canvas = document.getElementById('artBoard');

/**
 * Scene Init
 */

const scene = new THREE.Scene();

/**
 * Fog Init
 */

scene.fog = new THREE.Fog(props.fog, 3, 15);

/**
 * Materials
 */

/* Floor */

const base = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColor,
    aoMap: grassAO,
    normalMap: grassNormal,
    transparent: true,
    roughnessMap: grassRough,
  })
);

base.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(base.geometry.attributes.position.array, 2)
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
  new THREE.MeshStandardMaterial({
    transparent: true,
    aoMap: wallAO,
    map: wallColor,
    normalMap: wallNormal,
    roughnessMap: wallRough,
  })
);
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
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
roof.castShadow = false;

// Door

const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColor,
    transparent: true,
    alphaMap: doorAlpha,
    aoMap: doorAO,
    displacementMap: doorHeight,
    displacementScale: 0.1,
    metalnessMap: doorMetal,
    roughnessMap: doorRough,
    normalMap: doorNormal,
  })
);
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = walls.geometry.parameters.depth / 2 + 0.001;
door.position.y = door.geometry.parameters.height / 2;
house.add(door);

// Bushes

const bushGeo = new THREE.SphereBufferGeometry(0.5, 8, 8);
const bushMesh = new THREE.MeshStandardMaterial({ color: '#89c854' });
const bush1 = new THREE.Mesh(bushGeo, bushMesh);
const bush2 = new THREE.Mesh(bushGeo, bushMesh);
const bush3 = new THREE.Mesh(bushGeo, bushMesh);
const bush4 = new THREE.Mesh(bushGeo, bushMesh);

bush1.position.z = walls.geometry.parameters.depth / 2 + 1;
bush1.position.x = walls.geometry.parameters.depth / 2 + 1;
bush2.position.z = walls.geometry.parameters.depth / 2 + 1.5;
bush2.position.x = walls.geometry.parameters.depth / 2 + 1.5;
bush3.position.z = bush2.position.z;
bush3.position.x = walls.geometry.parameters.depth / 2 + 1.8;
bush4.position.z = bush2.position.z + 0.5;
bush4.position.x = bush3.position.x;
// bush2.position.y = bush2.geometry.parameters.widthSegments + 0.5;
scene.add(bush1);
scene.add(bush2);
scene.add(bush3);
scene.add(bush4);

// Graves

const graveyard = new THREE.Group();
scene.add(graveyard);

const graveGeo = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radious = 4 + Math.random() * 4.5;
  const x = Math.sin(angle) * radious;
  const z = Math.cos(angle) * radious;
  const grave = new THREE.Mesh(graveGeo, graveMaterial);
  grave.position.set(
    x,
    grave.geometry.parameters.height / 2 - Math.random(),
    z
  );
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;
  graveyard.add(grave);
}

/**
 * Lights Init
 */

// Ambient Light

const ambient = new THREE.AmbientLight(props.ambient, props.ambientOpacity);

scene.add(ambient);

// Directional light

const moonlight = new THREE.DirectionalLight('#ffffff', 0.5);
moonlight.position.set(4, 5, -2);
// const moonHelper = new THREE.DirectionalLightHelper(moonlight, 1);
// scene.add(moonHelper);
scene.add(moonlight);

// Door Light

const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(
  0,
  walls.geometry.parameters.height,
  walls.geometry.parameters.depth / 2 + 1
);
house.add(doorLight);

// Ghost Light

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
ghost1.position.setY = 0.3;
scene.add(ghost1);

const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
ghost2.position.setY = 0.3;
scene.add(ghost2);

const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
ghost3.position.setY = 0.3;
scene.add(ghost3);

// Debugger

const lights = gui.addFolder('Lights');
const doorDebug = lights.addFolder('Point Light');
const ambientDebug = lights.addFolder('Ambient Light');
const moonDebug = lights.addFolder('Moon Light');

ambientDebug
  .add(props, 'ambientOpacity')
  .min(0)
  .max(1)
  .step(0.01)
  .name('Intensity')
  .onChange(() => {
    ambient.intensity = props.ambientOpacity;
  });
doorDebug
  .add(doorLight.position, 'x')
  .min(0)
  .max(5)
  .step(0.001)
  .name('doorLight x position');
doorDebug
  .add(doorLight.position, 'y')
  .min(0)
  .max(5)
  .step(0.001)
  .name('doorLight y position');
doorDebug
  .add(doorLight.position, 'z')
  .min(0)
  .max(5)
  .step(0.001)
  .name('doorLight z position');

moonDebug
  .add(moonlight.position, 'x')
  .min(-10)
  .max(10)
  .step(0.001)
  .name('moonlight x position');
moonDebug
  .add(moonlight.position, 'y')
  .min(-10)
  .max(10)
  .step(0.001)
  .name('moonlight x position');
moonDebug
  .add(moonlight.position, 'z')
  .min(-10)
  .max(10)
  .step(0.001)
  .name('moonlight x position');

// lights.open();
// ambientDebug.open();
moonDebug.open();

/**
 * Camera Init
 */

const camera = new THREE.PerspectiveCamera(
  75,
  props.fullWidth / props.fullHeight,
  0.1,
  1000
);
camera.position.x = 0;
camera.position.y = 5;
camera.position.z = 8;
scene.add(camera);

const camDebug = gui.addFolder('Camera');

camDebug.add(camera.position, 'x').min(-10).max(20).step(0.01).name('CameraX');
camDebug.add(camera.position, 'y').min(-10).max(20).step(0.01).name('CameraY');
camDebug.add(camera.position, 'z').min(-10).max(20).step(0.01).name('CameraZ');

camDebug.open();

/**
 * Controls Init
 */

const controller = new OrbitControls(camera, canvas);

// Rotation Limit to Ground

controller.maxPolarAngle = Math.PI / 2 - 0.15;
controller.enableDamping = true;

/**
 * Renderer Init
 */

const renderer = new THREE.WebGLRenderer({
  canvas,
});
// Shadow

doorLight.castShadow = true;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 10;

moonlight.castShadow = true;
moonlight.shadow.mapSize.width = 256;
moonlight.shadow.mapSize.height = 256;
moonlight.shadow.camera.far = 15;

ghost1.castShadow = true;
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.castShadow = true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.castShadow = true;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

walls.castShadow = true;

bush1.castShadow = true;

bush2.castShadow = true;

bush3.castShadow = true;

base.receiveShadow = true;

renderer.setClearColor(props.fog);
renderer.setSize(props.fullWidth, props.fullHeight);
renderer.setPixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.shadowMap.enabled = true;

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

const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);

  const elapse = clock.getElapsedTime();

  const ghost1Angle = elapse * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 9;
  ghost1.position.z = Math.sin(ghost1Angle) * 9;
  ghost1.position.y = Math.sin(elapse * 2);
  const ghost2Angle = -elapse * 0.5;
  ghost2.position.x = Math.cos(ghost2Angle) * 3;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapse * 1.5) + Math.sin(elapse * 0.5);

  const ghost3Angle = -elapse * 0.5;
  ghost3.position.x = Math.cos(ghost3Angle) * 6 + Math.sin(elapse * 0.5);
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y = Math.sin(elapse * 1.5);

  renderer.render(scene, camera);
  controller.update();
};
animate();
