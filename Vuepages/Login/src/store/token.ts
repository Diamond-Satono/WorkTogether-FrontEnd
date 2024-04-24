import { createGlobalState, useStorage } from "@vueuse/core"
export const Authorization = createGlobalState(() => useStorage("Authorization", ""))