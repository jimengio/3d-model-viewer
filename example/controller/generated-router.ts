import queryString from "query-string";

type Id = string;

function switchPath(x: string) {
  location.hash = `#${x}`;
}

function qsStringify(queries: { [k: string]: any }) {
  return queryString.stringify(queries, { arrayFormat: "bracket" });
}

// generated

// Generated with router-code-generator@0.2.5

export let genRouter = {
  oldViewer: {
    name: "old-viewer",
    raw: "old-viewer",
    path: () => `/old-viewer`,
    go: () => switchPath(`/old-viewer`),
  },
  newViewer: {
    name: "new-viewer",
    raw: "new-viewer",
    path: () => `/new-viewer`,
    go: () => switchPath(`/new-viewer`),
  },
  $: {
    name: "old-viewer",
    raw: "",
    path: () => `/`,
    go: () => switchPath(`/`),
  },
};

export type GenRouterTypeMain = GenRouterTypeTree["oldViewer"] | GenRouterTypeTree["newViewer"] | GenRouterTypeTree["$"];

export interface GenRouterTypeTree {
  oldViewer: {
    name: "old-viewer";
    params: {};
    query: {};
    next: null;
  };
  newViewer: {
    name: "new-viewer";
    params: {};
    query: {};
    next: null;
  };
  $: {
    name: "old-viewer";
    params: {};
    query: {};
    next: null;
  };
}
