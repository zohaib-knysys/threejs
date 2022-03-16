import * as THREE from "https://cdn.skypack.dev/three@0.126.1";

import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

const world = {
  plane: {
    width: 8,
    height: 4,
    widthSegments: 20,
    heightSegments: 20,
  },
};

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const { array } = planeMesh.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      array[i] = x + (Math.random() - 0.5) *0.3
      array[i + 1] = y + (Math.random() - 0.5) * 0.3
      array[i + 2] = z + (Math.random() - 0.5) * 0.3
    }

  }

  planeMesh.geometry.attributes.position.randomValues = randomValues
  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array

  
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 1);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
// new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;
controls.update();


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var planeNormal = new THREE.Vector3();
var point = new THREE.Vector3();

document.addEventListener("click", onMouseClick, false);

function getPoint(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, point);
}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, -1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

function setPoint() {
  var sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.15, 4, 1),
    new THREE.MeshBasicMaterial({
      color: "white",
      wireframe: true,
    })
  );
  sphere.position.copy(point);
  sphere.position.z = 0.5;
  scene.add(sphere);
}

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0x000053,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
generatePlane();

const myarrx = [];
const myarry = [];
function onMouseClick(event) {
  getPoint(event);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    if (draw.checked) {
      setPoint();
      myarrx.push(mouse.x);
      myarry.push(mouse.y);

      if (myarrx.length > 1 && myarry.length > 1) {
        for (let i = 0; i < myarrx.length; i++) {
          var dx = myarrx[i] - myarrx[i - 1];
          var dy = myarry[i] - myarry[i - 1];
        }
        var tDistance = Math.sqrt(dx * dx + dy * dy);
        console.log("Total Distance: " + tDistance);
        document.getElementById("distance").innerHTML = tDistance.toFixed(2);
      }
    }
  }
}

render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
