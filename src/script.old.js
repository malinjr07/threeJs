import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Dom Element

const dom = document.getElementById('artBoard')
const main = document.getElementById('mainBox')
const clck = new THREE.Clock()

const wid = parseFloat(getComputedStyle(main).width)

// Event Listener

const cursor = {
    x: 0,
    y: 0
}

dom.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / size.w - 1
    cursor.y = -(e.clientY / size.h - 0.5)
})

// ThreeJs Scene
const artboard = new THREE.Scene()

// Custom Sizes

const size = {
    w: wid,
    h: 800
}

const ratio = size.w / size.h

// Camera
const cam = new THREE.PerspectiveCamera(70, size.w / size.h, 0.1, 100)
artboard.add(cam)
const controller= new OrbitControls(cam,dom)
controller.enableDamping=true
controller.update()
// const cam = new THREE.OrthographicCamera(1*ratio,-1*ratio,1,-1, 0.1, 100)

cam.position.z = 2

// Renderer
const render = new THREE.WebGLRenderer({canvas: dom});

// geometry

const geo = new THREE.BoxGeometry(); // First Argument of Mesh
const materials = new THREE.MeshBasicMaterial({color: 0x0000ff}) //Second Argument of Mesh

const mesh = new THREE.Mesh(geo, materials) // Mesh Take the GEO and Fill the Materials and make the Model

artboard.add(mesh) // add the Model into Artboard

render.setSize(size.w, size.h)

// Controls


const done = () => {
    // const timer = clck.getElapsedTime()
    // cam.position.x = Math.sin(cursor.x*Math.PI*2)*5
    // cam.position.z = Math.cos(cursor.x*Math.PI*2)*5
    // cam.position.y=cursor.y*10
    // cam.lookAt(mesh.position)
    render.render(artboard, cam)
    requestAnimationFrame(done)
}
done()
