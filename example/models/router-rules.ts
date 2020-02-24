import { IRouteRule } from "@jimengio/ruled-router";

export const routerRules: IRouteRule[] = [{ path: "old-viewer" }, { path: "new-viewer" }, { path: "", name: "old-viewer" }];
