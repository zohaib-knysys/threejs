import * as THREE from "https://cdn.skypack.dev/three@0.126.1";

import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerHeight / innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const { array } = planeMesh.geometry.attributes.position;

for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i + 2] = z + Math.random();
}

const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.color; i++) {
  colors.push(1, 0, 0);
}

planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const mouse = {
  x: undefined,
  y: undefined,
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    
    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, 0);

    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b, 0);
    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c, 0);

    intersects[0].object.geometry.attributes.color.needsUpdate = true;
  }
}

animate();

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
