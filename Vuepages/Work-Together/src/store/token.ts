//将Authorazion存到localstorage
import { createGlobalState, useStorage } from "@vueuse/core"
export const Authorization = createGlobalState(() => useStorage("Authorization", ""))