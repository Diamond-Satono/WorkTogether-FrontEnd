<template>
  <div class="root">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="title">
        删除部门<img
          src="@/assets/deptimgs/closeModal.png"
          class="closeModal"
          @click="$emit('close-modal')"
        />
      </div>
      <div class="cutoff"></div>
      <div class="maincontent">
        <div class="tipsword1">您确定删除部门&nbsp;&nbsp;&nbsp;{{props.row.name}}?</div>
        <div class="tipsword2">删除后不可恢复。</div>
        <div class="tipsword3">
          请输入<span class="q123">q123</span>后点击确定删除按钮进行删除
        </div>
        <input type="text" class="confirmword" placeholder="请输入确认词" v-model="inputValue"/>
        <div class="buttoncontainer">
          <button class="delete" @click="handleDeleteClick">确定删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref} from "vue"
import { Authorization } from "@/store/token";
const inputValue = ref("");
const emit = defineEmits(["close-modal"]);
const token = Authorization();
// 处理删除按钮点击事件
async function handleDeleteClick() {
  console.log(props.row.id);
  
  if (inputValue.value === "q123") {
    const deptId = props.row.id; // 获取部门 ID
    const companyId = 1; // 公司 ID，这里暂时设为 1
    try {
      const response = await fetch(`http://localhost:8080/api/dept/DeleteDept/${deptId}`, {
        method: "DELETE",
        headers: {
          Authorization: token.value,
          companyId: companyId.toString(),
        },
      });
      if (response.ok) {
        // 删除成功，触发关闭模态框事件
        emit("close-modal");
      } else {
        // 删除失败，根据实际需求处理错误
        console.error("Failed to delete department");
      }
    } catch (error) {
      // 处理异常情况
      console.error("An error occurred:", error);
    }
  }
}

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
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(229, 229, 229, 0.56);
  z-index: 1000;
}
.modal-content {
  width: 600px;
  height: 380px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  z-index: 1001;
}
.title {
  font-family: "SiYuanHeiTi";
  font-size: 25px;
  margin-left: 3%;
}
.closeModal {
  width: 30px;
  height: 30px;
  cursor: pointer;
  vertical-align: middle; /* 设置垂直居中对齐 */
  margin-top: -1%;
  margin-left: 77.4%;
}
.cutoff {
  border-top: 1px solid #bbbbbb;
  margin-top: 2%;
}
.maincontent {
  text-align: center;
}
.tipsword1 {
  font-family: "SiYuanHeiTi";
  font-size: 23px;
  margin-top: 4%;
}
.tipsword2 {
  font-family: "SiYuanHeiTi";
  font-size: 23px;
  margin-top: 1%;
}
.tipsword3 {
  font-family: "SiYuanHeiTi";
  font-size: 23px;
  margin-top: 3%;
}
.q123 {
  color: #ff6200;
  text-decoration: underline;
}
.confirmword {
  margin-top: 5%;
  width: 410px;
  height: 47px;
  border-radius: 10px;
  border: #bbbbbb solid 1px;
  font-size: 19px;
  padding-left: 1%;
}
.confirmword:focus {
  outline: none;
}
.buttoncontainer{
  margin-top: 5%;
}
.delete{
  width: 90%;
  height: 47px;
  border-radius: 10px;
  color: white;
  background-color: #ff6200;
  font-size: 20px;
  border: #ff6200 solid 1px;
  cursor: pointer;
  font-family: 'SiYuanHeiTi';
}
</style>