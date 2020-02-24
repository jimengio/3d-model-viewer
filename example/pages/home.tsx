import React, { FC, useState } from "react";
import { css } from "emotion";
import { genRouter } from "controller/generated-router";
import { HashLink } from "@jimengio/ruled-router/lib/dom";
import ThreeModelViewer from "../../src/old-3d-model-viewer";

let gltfDemo: string;
declare const __DEV__: boolean;

if (__DEV__) {
  gltfDemo = "./data/aircraft.gltf";
} else {
  gltfDemo = "./aircraft.gltf";
}

let PageHome: FC<{}> = React.memo((props) => {
  let [radius, setRadius] = useState(2.4);
  let [polarAngle, setPolarAngle] = useState(90);
  let [equatorAngle, setEquatorAngle] = useState(90);

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      Home Page
      <HashLink to={genRouter.content.path()} text={"Open content"} className={styleButton} />
      <a
        onClick={async () => {
          let { showTime } = await import("../util/time" /* webpackChunkName:"time" */);
          showTime();
        }}
      >
        Use
      </a>
      <ThreeModelViewer
        url={gltfDemo}
        radius={radius}
        minRadius={0.01}
        maxRadius={20}
        backgroundColor={"black"}
        polarAngle={polarAngle}
        equatorAngle={equatorAngle}
        key={gltfDemo}
        size={{ width: 800, height: 800 }}
        onRadiusChange={(z) => {
          setRadius(z);
        }}
        onAnglesChange={(polarAngle, equatorAngle) => {
          setPolarAngle(polarAngle);
          setEquatorAngle(equatorAngle);
        }}
      />
    </div>
  );
});

export default PageHome;

const styleButton = css`
  margin: 8px;
  cursor: pointer;
  color: blue;
`;
