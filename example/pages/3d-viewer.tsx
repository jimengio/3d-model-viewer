import React, { FC } from "react";
import { css } from "emotion";
import { genRouter } from "controller/generated-router";
import { ThreeDViewer } from "../../src";
import { DocDemo, DocSnippet, DocBlock } from "@jimengio/doc-frame";
import { useImmer } from "use-immer";

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

interface IState {
  zoomValue?: number;
  realTimeCameraPosition?: number[];
}

let ThreeDViewerDemo: FC<{}> = React.memo((props) => {
  const [state, setState] = useImmer<IState>({ zoomValue: 7, realTimeCameraPosition: [0, 0, 400] });

  return (
    <div>
      <DocDemo title="基础展示" link="https://github.com/jimengio/3d-model-viewer/blob/master/src/3d-viewer.tsx">
        <ThreeDViewer
          url={objDemo}
          renderSize={{
            width: 500,
            height: 500,
          }}
          initPostion={{ cameraPosition: [0, 0, 7] }}
        />

        <DocBlock content={baseContent} />
        <DocSnippet code={baseCode} />
      </DocDemo>
      <DocDemo title="操作展示" link="https://github.com/jimengio/3d-model-viewer/blob/master/src/3d-viewer.tsx">
        <ThreeDViewer
          url={gltfDemo}
          isDragging
          isRotate
          isZoom
          renderSize={{
            width: 500,
            height: 500,
          }}
          onListen={(e) => {
            setState((draft) => {
              draft.realTimeCameraPosition = e.cameraPosition;
            });
          }}
        />
        <DocBlock
          content={"`x:" + state.realTimeCameraPosition[0] + "` `y:" + state.realTimeCameraPosition[1] + "` `z:" + state.realTimeCameraPosition[2] + "`"}
        />
        <DocBlock content={operateContent} />
        <DocSnippet code={operateCode} />
      </DocDemo>
    </div>
  );
});

export default ThreeDViewerDemo;

const style = {
  operateContainer: css`
    padding: 20px;
  `,
};

const baseContent = `支持stl、obj格式3D模型加载。`;
const baseCode = `
<ThreeDViewer
  url="xxx.obj"
  renderSize={{
    width: 500,
    height: 500,
  }}
  initPostion={{ cameraPosition: [0, 0, 7] }}
/>`;

const operateContent = `支持旋转、缩放、平移操作，可扩展。`;
const operateCode = `
<ThreeDViewer
  url={xxx.stl}
  isDragging
  isRotate
  isZoom
  renderSize={{
    width: 500,
    height: 500,
  }}
  initPostion={{ cameraPosition: [0, 0, 400] }}
  onListen={(listenValue)=>{
  }}
/>
`;
