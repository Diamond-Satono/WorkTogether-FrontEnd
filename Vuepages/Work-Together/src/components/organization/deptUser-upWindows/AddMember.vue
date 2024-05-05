<template>
  <div class="root">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="title">
        添加成员<img
          src="@/assets/deptimgs/closeModal.png"
          class="closeModal"
          @click="$emit('close-modal')"
        />
      </div>
      <div class="quickinvitation">快速邀请</div>
      <div class="cutoff"></div>
      <div class="maincontent">
        <div class="emailaddress">
          <input v-if="isSingle" type="text" placeholder="请输入邮箱地址" class="emailinput" v-model="email"/>
          <textarea v-else placeholder="请输入此处粘贴Email, 每行一个" class="emailarea" v-model="email"></textarea>
          <br/>
          <div v-if="isSingle">
            <img src="@/assets/memberindept/batch-add.png" class="batchImg"><button class="batchAdd" @click="toggleAddMode">批量添加</button>
          </div>
          <div v-else>
            <img src="@/assets/memberindept/one-add.png" class="batchImg"><button class="batchAdd" @click="toggleAddMode">单个添加</button>
          </div>
        </div>
        <div class="buttoncontainer">
          <button class="create" @click="fetchEmailData()">确定添加</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {Authorization} from "@/store/token"
const tokens = Authorization();

// 定义是否为单个添加模式的响应式属性
const isSingle = ref(true);
// 邮箱地址的响应式属性
const email = ref('');
console.log("email=" + email.value);


// 切换添加模式的方法
function toggleAddMode() {
  isSingle.value = !isSingle.value;
}

function fetchEmailData() {
  const url = 'http://localhost:8080/api/email/sendInviteCode';
  const data = {
    email: email.value,
    companyId: "1"
  };
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': tokens.value, // 设置 Authorization 请求头，用于身份验证
      'companyId': 1 // 设置 companyId 请求头，用于传递公司 ID
    },
    body: JSON.stringify(data)
  })
  .then(response => {
      if (response.ok) {
          // 数据成功发送到服务器
          console.log('Data sent successfully.');
          alert("邀请码发送成功！");
          email.value = "";
          // 刷新页面
          location.reload();//刷新页面
      } else {
          // 数据发送失败
          console.error('Failed to send data to server.');
          alert("邀请码发送失败！");
      }
  })
  .catch(error => {
      // 捕获网络错误或其他错误
      console.error('Error:', error);
      alert("异常错误");
  });
}
onMounted(() => {
  //点击确定按钮
});
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
  
}
.quickinvitation {
  font-family: "SiYuanHeiTi";
  font-size: 23px;
  margin-top: 5%;
  margin-left: 6%;
  color: #FF6200;
}
.emailaddress {
  font-family: "SiYuanHeiTi";
  font-size: 23px;
  margin-top: 5%;
  margin-left: 6%;
}
.emailinput {
  margin-left: 6%;
  width: 425px;
  height: 40px;
  border-radius: 10px;
  border: #bbbbbb solid 1px;
  padding-left: 1%;
  font-size: 20px;
}
.emailinput:focus {
  outline: none;
}
.emailarea {
  margin-left: 6%;
  width: 425px;
  height: 100px;
  border-radius: 5px;
  border: #bbbbbb solid 1px;
  padding-left: 1%;
  font-size: 20px;
}
.emailarea:focus {
  outline: none;
}
.batchImg {
  margin-top: 1%;
  margin-left: 6%;
}
.batchAdd {
  margin-top: -2%;
  vertical-align: middle;
  border: none;
  font-size: 16px;
  color: #FF6200;
  background-color: white;
}
.confirmword:focus {
  outline: none;
}
.buttoncontainer {
  /* margin-top: 5%; */
  text-align: center;
}
.create {
  width: 90%;
  height: 47px;
  border-radius: 10px;
  color: white;
  background-color: #ff6200;
  font-size: 20px;
  border: #ff6200 solid 1px;
  cursor: pointer;
  font-family: "SiYuanHeiTi";
  margin-top: 4%;
}
</style>