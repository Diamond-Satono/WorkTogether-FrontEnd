<template>
  <div class="container">
    <div class="title">
      部门详情
      <img
        src="@/assets/deptimgs/closeModal.png"
        class="closeModal"
        @click="$emit('close-modal')"
      />
    </div>
    <div class="cutoff1"></div>
    <div class="depttitle">
      <img class="nameimg" src="@/assets/deptimgs/depttitle.png" />
      <span class="depttitlename">{{ props.row.name }}</span>
    </div>
    <div class="cutoff2"></div>
    <div class="detail1">
      <div class="deptbelong">部门所属</div>
      <div class="deptbelongname">深圳大学</div>
    </div>
    <div class="detail2">
      <div class="deptname">部门名称</div>
      <div class="deptdetailname">{{ props.row.name }}</div>
    </div>
    <div class="detail3">
      <div class="deptmanager">部门名称</div>
      <div class="deptdetailmanager">{{ props.row.manager }}</div>
    </div>
    <div class="detail4">
      <div class="managerphone">部门负责人联系电话</div>
      <div class="detailmanagerphone">12345678910</div>
    </div>
    <div class="buttoncontainer"><button class="edit">编辑信息</button></div>
  </div>
</template>
  
<script setup lang="ts">
//获取父组件参数
const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
});
console.log(props.row);
</script>
  
  <style scoped>
.container {
  position: fixed; /* 定位在屏幕上方 */
  top: 0;
  right: 0;
  width: 35%;
  height: 100%;
  background-color: white;
  z-index: 1000;
  border-left: 1px solid #bbbbbb;
}
.title {
  font-family: "SiYuanHeiTi";
  font-size: 25px;
  margin-left: 7%;
  margin-top: 5%;
}
.closeModal {
  width: 30px;
  height: 30px;
  cursor: pointer;
  vertical-align: middle; /* 设置垂直居中对齐 */
  margin-top: -1%;
  margin-left: 70%;
}
.cutoff1 {
  border-top: 1px solid #bbbbbb;
  margin-top: 5%;
  margin-left: 5%;
  margin-right: 5%;
}
.depttitle {
  font-size: 25px;
  margin-top: 4%;
  margin-left: 9%;
  display: flex;
}
.nameimg {
  width: 80px;
  height: 80px;
  margin-right: 7%;
}
.depttitlename {
  margin-top: 7%;
}
.cutoff2 {
  border-top: 1px solid #bbbbbb;
  margin-top: 4%;
  margin-left: 5%;
  margin-right: 5%;
}
.detail1 {
  margin-top: 12%;
  margin-left: 10%;
}
.deptbelong,
.deptname,
.deptmanager,
.managerphone {
  color: #8e8e93;
  font-size: 25px;
  font-family: "SiYuanHeiTi";
}
.deptbelongname,
.deptdetailname,
.deptdetailmanager,
.detailmanagerphone {
  margin-top: 2%;
  font-family: "alibaba";
  font-size: 22px;
}
.detail2,
.detail3,
.detail4 {
  margin-top: 5%;
  margin-left: 10%;
}
.buttoncontainer{
  margin-top: 10%;
  margin-left: 62%;
}
.edit{
  width: 195px;
  height: 52px;
  border-radius: 10px;
  color: white;
  background-color: #ff6200;
  font-size: 20px;
  border: #ff6200 solid 1px;
  cursor: pointer;
  font-family: "SiYuanHeiTi";
  font-weight: bold;
}
</style>
  