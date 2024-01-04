import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Constants
const TORUS_PARAMS = { radius: 10, tubeRadius: 3, radialSegments: 16, tubularSegments: 100 };
const DIAMOND_PARAMS = { count: 200, spread: 100 };
const BOOK_SCALE = 5;
const LAPTOP_SCALE = 0.15;
const SCROLL_SPEED = 0.001;

// scene is like a container that holds all of our objects, cameras and lights
function setupScene(){
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00000d);
  return scene;
}

// in order to see inside the scene we need a camera, this one is a perspective camera
function setupCamera(){
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
  camera.position.setZ(30);
  return camera;
}

// this thing renders the graphics to the scene, it renders to the bg
function setupRenderer(){
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.render(scene, camera);
  return renderer;
}

// make everything lit up
function addLight(){
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
}

let torus;
function addTorus(){
  const geometry = new THREE.TorusGeometry(TORUS_PARAMS.radius, TORUS_PARAMS.tubeRadius, TORUS_PARAMS.radialSegments, TORUS_PARAMS.tubularSegments);
  const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
  torus = new THREE.Mesh(geometry, material);
  scene.add(torus);
}


// --Random Diamonds--
const diamondGeometry = new THREE.OctahedronGeometry(0.60, 0);
const diamondMaterial = new THREE.MeshStandardMaterial({color: 0xF08492});
function addDiamond() {
  const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(DIAMOND_PARAMS.spread) );
  diamond.position.set(x,y,z);
  scene.add(diamond)
}


let book;
let laptop;

function loadModels(){
  const loader = new GLTFLoader();

  // red book
  loader.load('./red_book.glb', function(gltf) {
    book = gltf.scene;
    book.scale.set(BOOK_SCALE, BOOK_SCALE, BOOK_SCALE);
    book.position.set(-5, 0.7, 30);
    scene.add(book);
  });

  // laptop
  loader.load('./laptop.glb', function(gltf) {
    laptop = gltf.scene;
    laptop.scale.set(LAPTOP_SCALE, LAPTOP_SCALE, LAPTOP_SCALE);
    laptop.position.set(0, 0, -5);
    scene.add(laptop);
  });

}

// scroll animation
function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  if(book){
    book.rotation.x += .005;
    book.rotation.y += .0075;
    book.rotation.z += .005;
  }

  if(laptop){
    laptop.rotation.y = t * 0.001;
    laptop.rotation.z = t * 0.001;
  }

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

}

// window resizing
function onWindowResize() {
  // Update camera and renderer
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// game loop
function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.001;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.001;
  if(book){
    book.rotation.x += 0.0075;
  }
  renderer.render(scene, camera);
}

// main

const scene = setupScene();
const camera = setupCamera();
const renderer = setupRenderer();
addLight();
addTorus();
Array(DIAMOND_PARAMS.count).fill().forEach(addDiamond);
loadModels();

document.body.onscroll = moveCamera;
window.addEventListener('resize', onWindowResize, false);

moveCamera();
animate();