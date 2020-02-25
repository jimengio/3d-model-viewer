## 3D Model Viewer

> threejs based on 3D model component used in JimengIO

### Usages

![](https://img.shields.io/npm/v/@jimengio/3d-model-viewer.svg?style=flat-square)

```bash
yarn add @jimengio/3d-model-viewer
```

```ts
import { ThreeDViewer, Old3dModelViewer } from "@jimengio/3d-model-viewer";
```

- `ThreeDViewer` 支持stl、obj格式的3D模型展示组件
- `Old3dModelViewer` 老版本显示 GLTF 格式的组件, 使用的是极坐标.

#### `ThreeDViewer`

```jsx
<ThreeDViewer
  url={gltfDemo}
  renderSize={{
    width: 500,
    height: 500,
  }}
  backgroundColor="#000"
  isDragging
  isZoom
  isRotate
  materialColor="#fff"
  initPostion={
    cameraPosition:[0,0,0]
  }
  style={{}}
  onLoadComplete={()=>{}}
  onListen={(listenParam)=>{}}
/>
```

#### `Old3dModelViewer`

```jsx
let [radius, setRadius] = useState(2.4);
let [polarAngle, setPolarAngle] = useState(90);
let [equatorAngle, setEquatorAngle] = useState(90);

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
/>;
```

### Building

Dev:

```bash
yarn dll
yarn dev
```

Compile library:

```bash
yarn compile
```

Release:

```bash
yarn release
# yarn serve
```

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
