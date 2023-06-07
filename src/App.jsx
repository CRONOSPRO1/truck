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

        // const floorGeometry = new THREE.PlaneGeometry(3, 3);
        // const textureLoader = new THREE.TextureLoader();
        // const floorTexture = textureLoader.load('./assets/poly/background.jpg');
        // const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
        // const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        // floorMesh.rotation.x = -Math.PI / 2;
        // floorMesh.position.set(0, -0.13, 0); // Ajusta los valores según la cantidad de desplazamiento vertical deseado
        // test.scene.add(floorMesh);
    
        
        const floorSize = 2.5;
        const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
        const textureLoader = new THREE.TextureLoader();
        const floorTexture = textureLoader.load('src/assets/poly/background.jpg');
        const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.set(0, -0.13, 0);
        test.scene.add(floorMesh);
    
        // Crear las paredes
        // const wallHeight = 3;
        // const wallGeometry = new THREE.BoxGeometry(floorSize, wallHeight, 0.1);
        // const wallTexture = textureLoader.load('./assets/poly/SKY.jpg')
        // const wallMaterial = new THREE.MeshBasicMaterial({map:wallTexture})
    
        // const wallFront = new THREE.Mesh(wallGeometry, wallMaterial);
        // wallFront.position.set(0, wallHeight / 2, -floorSize / 2 + 0.05);
        // test.scene.add(wallFront);
    
        // const wallBack = new THREE.Mesh(wallGeometry, wallMaterial);
        // wallBack.position.set(0, wallHeight / 2, floorSize / 2 - 0.05);
        // test.scene.add(wallBack);
    
        // const wallLeft = new THREE.Mesh(wallGeometry, wallMaterial);
        // wallLeft.position.set(-floorSize / 2 + 0.05, wallHeight / 2, 0);
        // wallLeft.rotation.y = Math.PI / 2;
        // test.scene.add(wallLeft);
    
        // const wallRight = new THREE.Mesh(wallGeometry, wallMaterial);
        // wallRight.position.set(floorSize / 2 - 0.05, wallHeight / 2, 0);
        // wallRight.rotation.y = Math.PI / 2;
        // test.scene.add(wallRight);
    
        // // Crear el techo
        // const roofGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
        // const roofMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
        // const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
        // roofMesh.rotation.x = Math.PI / 2;
        // roofMesh.position.set(0, wallHeight, 0);
        // test.scene.add(roofMesh);
    


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

  return (
    <div>
      <canvas ref={canvasRef} id="myThreeJsCanvas" />
      <div id="measurements"></div>
    </div>
  );
}

export default App;
