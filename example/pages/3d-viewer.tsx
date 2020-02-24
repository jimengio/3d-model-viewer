import React from "react";
import { css } from "emotion";
import { genRouter } from "controller/generated-router";
import { ThreeDViewer } from "../../src";

let gltfDemo: string;
declare const __DEV__: boolean;

if (__DEV__) {
  gltfDemo = "./data/out.stl";
} else {
  gltfDemo = "./out.stl";
}

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <ThreeDViewer
          url={gltfDemo}
          renderSize={{
            width: 400,
            height: 400,
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
