import React, { FC } from "react";
import { css, cx } from "emotion";
import { fullscreen, row, expand } from "@jimengio/flex-styles";

import ThreeDViewer from "./3d-viewer";
import Page3DModelViewer from "./old-3d-model-viewer";
import { HashRedirect, findRouteTarget } from "@jimengio/ruled-router/lib/dom";
import { genRouter, GenRouterTypeMain } from "controller/generated-router";
import { ISidebarEntry, DocSidebar } from "@jimengio/doc-frame";

let items: ISidebarEntry[] = [
  {
    title: "3D Model Viewer",
    path: genRouter.newViewer.name,
  },
  {
    title: "Old 3D Model Viewer",
    path: genRouter.oldViewer.name,
  },
];

const renderChildPage = (routerTree: GenRouterTypeMain) => {
  switch (routerTree?.name) {
    case "new-viewer":
      return <ThreeDViewer />;
    case "old-viewer":
      return <Page3DModelViewer />;
    default:
      return (
        <HashRedirect to={genRouter.newViewer.name} delay={2}>
          2s to redirect
        </HashRedirect>
      );
  }

  return <div>NOTHING</div>;
};

let onSwitchPage = (path: string) => {
  let target = findRouteTarget(genRouter, path);
  if (target != null) {
    target.go();
  }
};

let Container: FC<{ router: GenRouterTypeMain }> = React.memo((props) => {
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={cx(fullscreen, row, styleContainer)}>
      <DocSidebar
        title="3D Model Viewer"
        currentPath={props.router.name}
        onSwitch={(item) => {
          onSwitchPage(item.path);
        }}
        items={items}
      />
      <div className={cx(expand, styleBody)}>{renderChildPage(props.router)}</div>
    </div>
  );
});

export default Container;

const styleContainer = css``;

let styleBody = css`
  padding: 16px;
`;
