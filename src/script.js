import './style.css'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap';
import * as dat from 'dat.gui';

const element = document.getElementById('artBoard');

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const props={
    'color': 0x00ff00,
    'bg': 0x00ffff,
    'bgAlpha': 0.5,
    circle:()=>{
        gsap.to(cube.rotation,{duration:3,y:cube.rotation.y+20})
    }
}

const loaderMg= new THREE.LoadingManager();

const textureLoad = new THREE.TextureLoader(loaderMg);

const textures=textureLoad.load('/IMG-20200603-WA0010.jpg')

const ratio = size.width / size.height;
const threeD = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 100);
const controllers = new OrbitControls(camera, element)
camera.position.z = 5
controllers.enableDamping = true;
controllers.update()
threeD.add(camera)

// const materials = new THREE.MeshBasicMaterial({map:textures})
// const materials = new THREE.MeshNormalMaterial()
const materials = new THREE.MeshMatcapMaterial()
materials.matcap=textures

// Cube
const cubeGeo = new THREE.BoxBufferGeometry(3, 2, 4);
const cube = new THREE.Mesh(cubeGeo, materials)
cube.position.x=-1.5;

// Sphere
const sphereGeo= new THREE.SphereBufferGeometry(0.5,16,16)
const sphere = new THREE.Mesh(sphereGeo, materials)
sphere.position.x=1.5;
sphere.position.y=2.5;

// Torus
const torusGeo= new THREE.TorusBufferGeometry(0.5,0.2,10,30)
const torus = new THREE.Mesh(torusGeo, materials)
torus.position.x=3.5;


threeD.add(cube, sphere, torus)

const render = new THREE.WebGLRenderer({ canvas: element})
render.setClearColor(props.bg, props.bgAlpha);
render.setSize(size.width, size.height);

console.log(cube.geometry);

// Debugger
const debug = new dat.GUI({closed:true});

if (size.width>=1000) {
    debug.width=401
} else if (size.width <= 800) {
    debug.width=151    
}

debug.add(cube.scale, 'x', 0,5,0.1).name('Cube-Width').onChange((e)=>{
    cube.scale.x=e
})
debug.add(cube.scale, 'z', 0, 5, 0.1).name('Cube-Depth').onChange((e)=>{
    cube.scale.z=e
})
debug.add(cube.scale, 'y', 0,5,0.1).onChange((e)=>{
    cube.scale.y=e
}).name('Cube-Height')

debug.add(cube.position, 'x', -15, 15, 0.1).name('Cube X-Axis')
debug.add(cube.position, 'y', -15, 15, 0.1).name('Cube Y-Axis')
debug.add(cube.position, 'z', -15, 15, 0.1).name('Cube Z-Axis')
debug.add(sphere.position, 'x', -15, 15, 0.1).name('Sphere X-Axis')
debug.add(sphere.position, 'y', -15, 15, 0.1).name('Sphere Y-Axis')
debug.add(sphere.position, 'z', -15, 15, 0.1).name('Sphere Z-Axis')
debug.add(torus.position, 'x', -15, 15, 0.1).name('Torus X-Axis')
debug.add(torus.position, 'y', -15, 15, 0.1).name('Torus Y-Axis')
debug.add(torus.position, 'z', -15, 15, 0.1).name('Torus Z-Axis')

/* Change Properties of Torus */
/* debug.add(torus.geometry.parameters, 'radius', -15, 15, 0.1).name('Torus radius')
debug.add(torus.geometry.parameters, 'tube', -15, 15, 0.1).name('Torus tube')
debug.add(torus.geometry.parameters, 'radialSegments', -15, 15, 0.1).name('Torus radialSegments')
debug.add(torus.geometry.parameters, 'tubularSegments', -15, 15, 0.1).name('Torus tubularSegments') */

// debug.add(cube.material, 'wireframe').name('Material-Wireframe')
debug.add(props,'circle')

// debug.addColor(props,'color').onChange(()=>{
//     materials.color.set(props.color)
// }).name('box-color')
debug.addColor(props,'bg').onChange(()=>{
    render.setClearColor(props.bg, props.bgAlpha);
}).name('Background-color')
debug.add(props,'bgAlpha',0,1,0.01).onChange(()=>{
    render.setClearColor(props.bg, props.bgAlpha);
}).name('Background-Color-Alpha')

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
    render.setSize(window.innerWidth, window.innerHeight);
})

element.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        element.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})

// Complete Render
const done = () => {
    requestAnimationFrame(done)
    render.render(threeD, camera);
}
done()
