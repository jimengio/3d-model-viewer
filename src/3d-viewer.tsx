import React, { FC, useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface IProps {
  url: string;
  renderSize: {
    width: number;
    height: number;
  };
  onLoadComplete?: () => void;
  backgroundColor?: string;
  isDragging?: boolean;
  materialColor?: string;
}

let ThreeDViewer: FC<IProps> = React.memo((props) => {
  const { url, renderSize, backgroundColor = "#9e9e9e", isDragging = false, materialColor = "#fff", onLoadComplete } = props;

  const [loading, setLoading] = useState(true);
  const containerElement = useRef(null);
  useEffect(() => {
    draw();
  }, []);

  let camera: THREE.PerspectiveCamera = null;
  let renderer: THREE.WebGLRenderer = null;
  let scene: THREE.Scene = null;
  let light: THREE.Light = null;
  let controls: OrbitControls = null;

  const initRender = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(renderSize.width, renderSize.height);
    renderer.setClearColor(backgroundColor);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerElement.current.appendChild(renderer.domElement);
  };

  const render = () => {
    renderer.render(scene, camera);
  };

  const initModel = () => {
    new STLLoader().load(url, (geometry) => {
      var mat = new THREE.MeshLambertMaterial({ color: materialColor });
      var mesh = new THREE.Mesh(geometry, mat);
      mesh.rotation.x = -0.5 * Math.PI;
      mesh.scale.set(1, 1, 1);
      geometry.center();
      scene.add(mesh);
      onLoadComplete();
      setLoading(false);
    });
  };

  const initCamera = () => {
    camera = new THREE.PerspectiveCamera(45, renderSize.width / renderSize.height, 1, 2000);
    camera.position.set(0, 0, 300);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  };

  const initScene = () => {
    scene = new THREE.Scene();
  };

  const initLight = () => {
    light = new THREE.HemisphereLight(0x404040, 0xffffff, 1);
    light.position.set(3, -5, -5);
    scene.add(light);
  };

  const initControls = () => {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enableZoom = true;
    controls.minDistance = 1;
    controls.maxDistance = 1800;

    controls.enablePan = isDragging;
  };

  const animate = () => {
    render();
    requestAnimationFrame(animate);
  };

  const onWindowResize = () => {
    camera.aspect = renderSize.width / renderSize.height;
    camera.updateProjectionMatrix();
    render();
    renderer.setSize(renderSize.width, renderSize.height);
  };

  const draw = () => {
    initRender();
    initScene();
    initCamera();
    initLight();
    initModel();
    initControls();
    animate();
    window.onresize = onWindowResize;
  };

  return (
    <div
      ref={containerElement}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: backgroundColor,
        position: "relative",
      }}
    >
      {loading ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
          }}
        >
          加载中...
        </div>
      ) : null}
    </div>
  );
});

export default ThreeDViewer;
