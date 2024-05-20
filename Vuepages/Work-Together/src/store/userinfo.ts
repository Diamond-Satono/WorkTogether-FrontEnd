import { createGlobalState, useStorage } from "@vueuse/core"

// 创建一个对象来存储 companyId 和 groupId
export const UserInfo = createGlobalState(() => useStorage("UserInfo", { companyId: "", groupId: "" }))