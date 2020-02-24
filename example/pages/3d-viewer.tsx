import React from "react";
import { css } from "emotion";
import { genRouter } from "controller/generated-router";
import { ThreeDViewer } from "../../src";

let gltfDemo: string;
let objDemo: string;
declare const __DEV__: boolean;

if (__DEV__) {
  gltfDemo = "./data/out.stl";
  objDemo = "./data/patrick.obj";
} else {
  gltfDemo = "./out.stl";
  objDemo = "./patrick.obj";
}

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>stl</h1>
        <ThreeDViewer
          url={gltfDemo}
          isDragging
          renderSize={{
            width: 500,
            height: 500,
          }}
        />
        <h1>obj</h1>
        <ThreeDViewer
          url={objDemo}
          isDragging
          initPostion={{ cameraPosition: [0, 0, 7] }}
          renderSize={{
            width: 500,
            height: 500,
          }}
        />
      </div>
    );
  }
}

const styleButton = css`
  margin: 8px;
  cursor: pointer;
  color: blue;
`;
