import { createGlobalState, useStorage } from "@vueuse/core"

// 初始化 UserInfo 对象的初始值
const initiallistInfo = {
    group:1,
    department:1,
    enterprise:1
  }
  
  // 创建一个对象来存储 companyId 和 groupId，并初始化值
  export const listInfo = createGlobalState(() => useStorage("listInfo", initiallistInfo))