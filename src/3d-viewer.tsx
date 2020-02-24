import React, { FC, useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";

interface IProps {
  url: string; // 模型url，会根据模型后缀匹配对应loader。
  renderSize: {
    // 限制canvas高宽。
    width: number;
    height: number;
  };
  onLoadComplete?: () => void; // 模型加载完回调。
  backgroundColor?: string; // 画布背景颜色。
  isDragging?: boolean; // 是否支持拖拽。
  materialColor?: string; // 材质主题颜色（目前仅支持单色）。
  initPostion?: {
    cameraPosition: number[]; // 初始相机位置。
  }; // [x,y,z]
  onListen?: (param: { cameraPosition: number[] }) => void; // 监听相机位置。
  style?: React.CSSProperties;
}

let ThreeDViewer: FC<IProps> = React.memo((props) => {
  const {
    url,
    renderSize,
    backgroundColor = "#000",
    isDragging = false,
    materialColor = "#fff",
    onLoadComplete,
    onListen,
    initPostion = { cameraPosition: [0, 0, 400] },
    style,
  } = props;

  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState(null);
  const containerElement = useRef(null);

  useEffect(() => {
    draw();

    containerElement.current.addEventListener("mouseup", callListen);
    containerElement.current.addEventListener("keydown", onKeydown);

    return () => {
      containerElement.current.removeEventListener("mouseup", callListen);
      containerElement.current.removeEventListener("keydown", onKeydown);
    };
  }, []);

  const onKeydown = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) {
      callListen();
    }
  };

  const callListen = () => {
    if (!onListen) return;
    const newCameraPosition = [camera.position.x, camera.position.y, camera.position.z];
    onListen({
      cameraPosition: newCameraPosition,
    });
  };

  let camera: THREE.PerspectiveCamera = null;
  let renderer: THREE.WebGLRenderer = null;
  let scene: THREE.Scene = null;
  let light: THREE.Light = null;
  let controls: OrbitControls = null;
  let mesh: THREE.Mesh = null;

  /**
   * 初始化渲染器
   */
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

  /**
   * 初始化模型
   */
  const initModel = () => {
    const index = url.lastIndexOf(".");
    const suffix = url.substring(index + 1);
    switch (suffix) {
      case "stl":
        return new STLLoader().load(
          url,
          (geometry) => {
            let mat = new THREE.MeshLambertMaterial({ color: materialColor });
            mesh = new THREE.Mesh(geometry, mat);
            mesh.rotation.x = -0.5 * Math.PI;
            mesh.scale.set(1, 1, 1);
            geometry.center();
            scene.add(mesh);
            if (onLoadComplete) onLoadComplete();
            setLoading(false);
          },
          () => {},
          (err) => loadError(err)
        );
      case "obj":
        return new OBJLoader2().load(
          url,
          (object3D) => {
            object3D.scale.set(1, 1, 1);
            scene.add(object3D);
            if (onLoadComplete) onLoadComplete();
            setLoading(false);
          },
          () => {},
          (err) => loadError(err)
        );
      default:
        return setHint("暂不支持的格式文件！");
    }
  };

  /**
   * 初始化相机
   */
  const initCamera = () => {
    camera = new THREE.PerspectiveCamera(45, renderSize.width / renderSize.height, 1, 2000);
    camera.position.set(initPostion.cameraPosition[0], initPostion.cameraPosition[1], initPostion.cameraPosition[2]);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  };

  /**
   * 初始化场景
   */
  const initScene = () => {
    scene = new THREE.Scene();
  };

  /**
   * 初始化灯光
   */
  const initLight = () => {
    light = new THREE.HemisphereLight(0x404040, 0xffffff, 1);
    light.position.set(3, -5, -5);
    scene.add(light);
  };

  /**
   * 初始化控制器
   */
  const initControls = () => {
    controls = new OrbitControls(camera, renderer.domElement);
    // 动画循环时，是否有阻尼即惯性
    controls.enableDamping = false;
    // 是否可以缩放
    controls.enableZoom = true;
    // 相机距离原点最小距离
    controls.minDistance = 1;
    // 相机距离原点最大距离
    controls.maxDistance = 1800;
    // 配置上下左右快捷键
    controls.keys = { LEFT: 39, UP: 38, RIGHT: 37, BOTTOM: 40 };
    // 是否开启右键拖拽
    controls.enablePan = isDragging;
  };

  /**
   * 动画循环
   */
  const animate = () => {
    requestAnimationFrame(animate);
    render();
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

  const loadError = (err) => {
    console.error(err);
    setHint("文件加载异常！");
  };

  return (
    <div
      ref={containerElement}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: backgroundColor,
        position: "relative",
        textAlign: "center",
        ...style,
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
          {hint || "加载中..."}
        </div>
      ) : null}
    </div>
  );
});

export default ThreeDViewer;
