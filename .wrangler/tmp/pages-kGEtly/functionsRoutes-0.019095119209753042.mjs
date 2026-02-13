import { onRequestGet as __api_kv__key__ts_onRequestGet } from "/Users/andernet/Documents/GitHub/jonah/functions/api/kv/[key].ts"
import { onRequestOptions as __api_kv__key__ts_onRequestOptions } from "/Users/andernet/Documents/GitHub/jonah/functions/api/kv/[key].ts"
import { onRequestPut as __api_kv__key__ts_onRequestPut } from "/Users/andernet/Documents/GitHub/jonah/functions/api/kv/[key].ts"

export const routes = [
    {
      routePath: "/api/kv/:key",
      mountPath: "/api/kv",
      method: "GET",
      middlewares: [],
      modules: [__api_kv__key__ts_onRequestGet],
    },
  {
      routePath: "/api/kv/:key",
      mountPath: "/api/kv",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_kv__key__ts_onRequestOptions],
    },
  {
      routePath: "/api/kv/:key",
      mountPath: "/api/kv",
      method: "PUT",
      middlewares: [],
      modules: [__api_kv__key__ts_onRequestPut],
    },
  ]