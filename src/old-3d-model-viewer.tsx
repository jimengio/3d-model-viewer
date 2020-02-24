import React from "react";
import { css, cx } from "emotion";

import * as Three from "three";
window.THREE = Three;

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function toRadians(angle: number) {
  return angle * (Math.PI / 180);
}

interface IProps {
  url: string;

  size: {
    width: number;
    height: number;
  };
  backgroundColor: string;

  radius: number;
  maxRadius: number;
  minRadius: number;
  onRadiusChange: (z: number) => void;

  polarAngle: number;
  equatorAngle: number;
  onAnglesChange: (polarAngle: number, equatorAngle: number) => void;
}

interface IState {}

export default class ThreeDModelViewer extends React.Component<IProps, IState> {
  containerElement: Element;
  object: Three.Object3D;
  camera: Three.PerspectiveCamera;
  renderer: Three.WebGLRenderer;

  isDragging: boolean;
  previousPosition: {
    x: number;
    y: number;
  };

  rerenderScene: () => void;

  constructor(props) {
    super(props);

    this.previousPosition = {
      x: 0,
      y: 0,
    };

    this.rerenderScene = () => {
      // doing nothing at first
    };
  }

  render() {
    return (
      <div
        className={styleContainer}
        style={{ width: "100%", height: "100%", backgroundColor: this.props.backgroundColor }}
        ref={(el) => {
          this.containerElement = el;
        }}
        onWheel={this.onWheel}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
      />
    );
  }

  async componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps: IProps, prevState: IState, snapshot) {
    if (this.props.size.width !== prevProps.size.width || this.props.size.height !== prevProps.size.height) {
      this.onContainerResize();
    }

    if (this.props.radius !== prevProps.radius || this.props.polarAngle !== prevProps.polarAngle || this.props.equatorAngle !== prevProps.equatorAngle) {
      this.onCameraUpdate();
      this.rerenderScene();
    }
  }

  onContainerResize = () => {
    let { width, height } = this.props.size;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    this.rerenderScene();
  };

  async onCameraUpdate() {
    this.camera.position.set(
      this.props.radius * Math.sin(toRadians(this.props.polarAngle)) * Math.cos(toRadians(this.props.equatorAngle)),
      this.props.radius * Math.cos(toRadians(this.props.polarAngle)),
      this.props.radius * Math.sin(toRadians(this.props.polarAngle)) * Math.sin(toRadians(this.props.equatorAngle))
    );

    // console.log(`camera ${this.props.radius}, ${this.props.polarAngle}, ${this.props.equatorAngle}`, this.camera.position);
    this.camera.lookAt(new Three.Vector3(0, 0, 0));
  }

  async draw() {
    let gltfLoader = new GLTFLoader();

    let scene = new Three.Scene();
    let renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer = renderer;

    let { width, height } = this.props.size;

    renderer.setSize(width, height);
    this.containerElement.appendChild(renderer.domElement);

    let camera = new Three.PerspectiveCamera(45, width / height, 0.1, 20000);
    this.camera = camera;
    this.onCameraUpdate();
    scene.add(camera);

    renderer.setClearColor(0x000000, 0);
    var light = new Three.AmbientLight(0xffffff);
    scene.add(light);

    let pointerLight = new Three.PointLight(0xffffff);
    pointerLight.position.set(-1, 1, 2);
    pointerLight.decay = 0.1;
    pointerLight.intensity = 2;
    scene.add(pointerLight);

    // let geometry = new Three.BoxGeometry(0.4, 0.4, 0.4);
    // let material = new Three.MeshLambertMaterial({ color: 0x00ff00 });
    // let cube = new Three.Mesh(geometry, material);
    // cube.position.set(3, 0, 0);
    // scene.add(cube);

    renderer.render(scene, camera);

    if (this.props.url == null) {
      console.error("URL is empty and no GLTF model to render!");
      return;
    }

    gltfLoader.load(this.props.url, (gltf) => {
      let gltfScene = gltf.scene.clone();

      this.object = new Three.Object3D();
      (window as any).myObject = this.object;

      // https://github.com/donmccurdy/three-gltf-viewer/blob/master/src/viewer.js#L215
      let containerBox = new Three.Box3().setFromObject(gltfScene);
      let center = containerBox.getCenter(new Three.Vector3());
      let centerShift = center.clone().negate();

      let boxSize = containerBox.getSize(new Three.Vector3());
      let maxLength = Math.max(boxSize.x, boxSize.y, boxSize.z);
      let ratio = 2 / maxLength; // 2 by experience

      // hard code scaling ratio currently
      gltfScene.scale.set(ratio, ratio, ratio);
      // hard code position shift in here. should refactor code when more features extended
      gltfScene.position.x += ratio * centerShift.x;
      gltfScene.position.y += ratio * centerShift.y;
      gltfScene.position.z += ratio * centerShift.z;

      this.object.add(gltfScene);

      scene.add(this.object);

      renderer.render(scene, camera);
    });

    this.rerenderScene = () => {
      renderer.render(scene, camera);
    };

    (window as any).forceRender = this.rerenderScene;
  }

  onWheel = (event) => {
    let move = event.deltaY / 10;
    if (move < 0) {
      this.props.onRadiusChange(Math.max(this.props.minRadius, this.props.radius - 0.2 * Math.abs(move)));
    } else {
      this.props.onRadiusChange(Math.min(this.props.maxRadius, this.props.radius + 0.2 * Math.abs(move)));
    }
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  onMouseDown = (event) => {
    this.isDragging = true;
    event.stopPropagation();
  };

  onMouseUp = () => {
    this.isDragging = false;
    event.stopPropagation();
  };

  onMouseMove = (event) => {
    event.stopPropagation();
    let deltaMove: { x: number; y: number } = {
      x: event.clientX - this.previousPosition.x,
      y: event.clientY - this.previousPosition.y,
    };

    if (this.isDragging) {
      if (this.object != null) {
        let moveRatio = 0.5;

        let polarAngle = this.props.polarAngle - deltaMove.y * moveRatio;
        if (polarAngle <= 0) {
          polarAngle = 0.01;
        } else if (polarAngle >= 180) {
          polarAngle = 180 - 0.01;
        }

        let equatorAngle = this.props.equatorAngle + deltaMove.x * moveRatio;
        if (equatorAngle <= 0) {
          equatorAngle = 360 - 0.01;
        }
        if (equatorAngle >= 360) {
          equatorAngle = 0.01;
        }

        this.props.onAnglesChange(polarAngle, equatorAngle);
      }
    }
    this.previousPosition = {
      x: event.clientX,
      y: event.clientY,
    };
  };
}

const styleContainer = null;
