import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

import new_style from './lib/new_style';

function App() {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);

  useEffect(() => {
    const test = new new_style("myThreeJsCanvas");
    test.initialize();

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    let loadedModel;

    const loadModel = () => {
      mtlLoader.load('src/assets/poly/poly.mtl', function (materials) {
        materials.preload();

        const floorSize = 2.5;
        const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
        const textureLoader = new THREE.TextureLoader();
        const floorTexture = textureLoader.load('src/assets/poly/background.jpg');
        const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.set(0, -0.13, 0);
        test.scene.add(floorMesh);

        objLoader.setMaterials(materials);
        objLoader.load('src/assets/poly/poly.obj', function (object) {
          object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.material.side = THREE.DoubleSide;
            }
          });

          const scaleFactor = 5 / 5;
          object.scale.set(scaleFactor, scaleFactor, scaleFactor);

          loadedModel = object;
          test.scene.add(loadedModel);

          const rulerGeometry = new THREE.BufferGeometry();
          rulerGeometry.setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(10, 0, 0),
          ]);

          const rulerMaterial = new LineMaterial({ color: 0xff0000 });
          const ruler = new LineSegments2(rulerGeometry, rulerMaterial);
          test.scene.add(ruler);

          animate();
        });
      });
    };

    const animate = () => {
      if (loadedModel) {
        // loadedModel.rotation.y += 0.01;
      }

      test.render();

      requestAnimationFrame(animate);
    };

    loadModel();
  }, []);

  useEffect(() => {
    return () => {
      const points = pointsRef.current;
      points.forEach((point) => {
        test.scene.remove(point);
      });
    };
  }, []);

  useEffect(() => {
    const loader = new THREE.GLTFLoader();
    const scene = new THREE.Scene();

    loader.load(
      'assets/shiba/scene.gltf',
      function (gltf) {
        const model = gltf.scene;
        scene.add(model);
      },
      undefined,
      function (error) {
        console.error('Error al cargar el modelo glTF', error);
      }
    );
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id="myThreeJsCanvas" />
      <div id="measurements"></div>
    </div>
  );
}

export default App;
