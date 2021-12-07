import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as debug from 'dat.gui';
// DOM Elements

const dom = document.getElementById('artBoard');

// Size

const size = {
  width: window.innerWidth - 200,
  height: window.innerHeight - 200,
};

// Cube Properties

const cubeProps = {
  x: 0,
  y: 0,
  z: 0,
  color: 0xff0000,
};

// Matrial Properties

const matProps = {
  color: 0xffffff,
};

// Scene

const screen = new THREE.Scene();

// Geo

const geo = new THREE.BoxBufferGeometry(1, 1, 1);

// mat

const mat = new THREE.MeshBasicMaterial({ color: cubeProps.color });
// mat.wireframe = true;

// cube

const cube = new THREE.Mesh(geo, mat);

// Camera

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  1000
);

camera.position.z = 3;

screen.add(cube, camera);

// Orbit

const control = new OrbitControls(camera, dom);

control.enableDamping = true;

// Renderer

const polish = new THREE.WebGLRenderer({ canvas: dom });

polish.setSize(size.width, size.height);

// console.log('Mesh Data: ', cube);
// console.log('Camera Data: ', camera);
console.log('Material Data: ', mat);

// Debugger

const dui = new debug.GUI();

// Mesh Debugger

dui.add(cube.position, 'x').min(-5).max(5).step(0.01).name('X-Axis');
dui.add(cube.position, 'y').min(-5).max(5).step(0.01).name('Y-Axis');
dui.add(cube.position, 'z').min(-5).max(5).step(0.01).name('Z-Axis');
dui.add(mat, 'wireframe').name('Wireframes');
dui
  .addColor(cubeProps, 'color')
  .onChange(() => {
    mat.color.set(cubeProps.color);
  })
  .name('Color');

// Final Render

const anim = () => {
  control.update();
  polish.render(screen, camera);
  requestAnimationFrame(anim);
};

anim();
