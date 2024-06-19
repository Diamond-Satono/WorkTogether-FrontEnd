<template>
  <div class="overlay">
    <div class="modal">
      <div class="title">
        <div class="ifreviewed">
          <img src="@/assets/weekly/notreviewed.png">
          {{ statusText }}
        </div>
        <div class="separator"></div>
        <span class="titleword">我的周报</span>
        <button class="clicktoreview" v-if="isneed" @click="confirmReview">评审</button>
        <div class="imgcontainer"><img src="@/assets/weekly/closedetail.png" @click="closemodal"></div>
      </div>
      <div class="devider"></div>
      <div class="reporttitle">
        {{ submitterName }}的周报-第{{ props.report.weekNum }}周
        <img src="">
        <span class="assessor">评审人</span>
      </div>
      <div class="statusandsubmitter">
        <div class="status">
          <img :src="statusImageSrc">
          <div class="container1">
            <span class="statusword">{{ statusText }}</span>
            <span class="currentstatus">当前状态</span>
          </div>
        </div>
        <div class="submittercontainer">
          <img src="">
          <span class="submitter">提交人</span>
        </div>
      </div>
      <div class="mainreport">
        <div class="part1">
          <div class="title1">
            1. 本周你完成了哪些工作？最有成就感的是什么
            <pre class="text1">{{ props.report.text1 }}</pre>
          </div>
        </div>
        <div class="devider2"></div>
        <div class="part2">
          <div class="title2">
            2. 下周你计划做什么？要完成什么目标？
            <pre class="text2">{{ props.report.text2 }}</pre>
          </div>
        </div>
        <div class="devider2"></div>
        <div class="part3">
          <div class="title3">
            3. 本周工作你遇到的困难是什么？希望得到哪些帮助？
            <pre class="text3">{{ props.report.text3 }}</pre>
          </div>
        </div>
        <div class="devider2"></div>
        <div class="part4">
          <div class="title4">
            4. 本周工作中，有什么想要与团队分享的？
            <pre class="text4">{{ props.report.text4 }}</pre>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="smallmodal" v-if="showConfirmModal">
        <div class="modal-content">
          <p>确认评审此周报？</p>
          <div class="button-container">
            <button class="confirm-button" @click="handleConfirm">确认</button>
            <button class="cancel-button" @click="cancelReview">取消</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';
import { Authorization } from '@/store/token'; // 导入 Authorization 函数
import { UserInfo } from '@/store/userinfo';
const token = Authorization(); // 获取 token
const userInfo = UserInfo();
const props = defineProps({
  report: {
    type: Object,
    default: null
  },
  isneed: {
    type: Boolean
  }
});

const emit = defineEmits(["close-modal", "refresh-table"]);

function closemodal() {
  emit('close-modal');
}

// 响应式变量来存储图片路径和状态文字
const statusText = ref("");
// 使用 watchEffect 监听 props.report 的变化
watchEffect(() => {
  // 确保 props.report 存在且包含 status 字段
  if (props.report && 'status' in props.report) {
    // 根据 props.report.status 的值动态设置图片路径和状态文字
    if (props.report.status === 0) {
      statusText.value = "待评审";
    } else if (props.report.status === 1) {
      statusText.value = "已评审";
    }
  }
});

// 计算属性，根据 props.report.status 的值返回不同的图片路径
const statusImageSrc = computed(() => {

  if (props.report && 'status' in props.report) {
    if (props.report.status === 0) {
      return "src/assets/weekly/tobereview.png";
    } else if (props.report.status === 1) {
      return "src/assets/weekly/reviewed.png";
    }
  }
  // 如果没有匹配到任何条件，可以返回一个默认的图片路径或者空字符串
  return "@/assets/weekly/default.png";
});

async function fetchUserData(id: any) {
  const url = `http://localhost:8080/api/user/${id}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': token.value // Assuming token.value contains the JWT token
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user data for id ${id}`);
  }

  return await response.json();
}


watchEffect(() => {
  if (props.report) {
    const { userId, reviewerId } = props.report;

    if (userId) {
      fetchUserData(userId).then(data => {
        const submitterAvatar = data.avatar;
        submitterName.value = data.name;
        const submitterImg = document.querySelector('.submittercontainer img') as HTMLImageElement;
        if (submitterImg) {
          submitterImg.src = submitterAvatar;
          submitterImg.title = submitterName.value;
        }
      }).catch(error => {
        console.error(error);
      });
    }

    if (reviewerId) {
      fetchUserData(reviewerId).then(data => {
        const reviewerAvatar = data.avatar;
        const reviewerName = data.name;
        const reviewerImg = document.querySelector('.reporttitle img') as HTMLImageElement;
        if (reviewerImg) {
          reviewerImg.src = reviewerAvatar;
          reviewerImg.title = reviewerName;
        }
      }).catch(error => {
        console.error(error);
      });
    }
  }
});

const submitterName = ref("");

// 控制确认弹窗显示与隐藏的变量
const showConfirmModal = ref(false);

function confirmReview() {
  showConfirmModal.value = true;
}

function cancelReview() {
  showConfirmModal.value = false;
}

async function handleConfirm() {
  try {
    const response = await fetch(`http://localhost:8080/api/report/reviewReport/?id=${props.report.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token.value,
        'companyId': userInfo.value.companyId.toString()
      }
    });
    
    if (response.ok) {
      console.log('评审成功');
    } else {
      console.error('评审失败');
    }
  } catch (error) {
    console.error('评审失败:', error);
  } finally {
    emit('close-modal');
    emit('refresh-table');
    showConfirmModal.value = false; // 关闭弹窗
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

.modal {
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 800px;
  height: 650px;
}

.title {
  margin-left: 4%;
  display: flex;
  margin-top: 1%;
}

.ifreviewed {
  width: 110px;
  height: 40px;
  background-color: rgba(87, 86, 215, 0.11);
  font-size: 18px;
  display: flex;
  align-items: center;
  font-family: 'alibaba';
}

.ifreviewed img {
  margin-right: 8%;
  margin-left: 4%;
}

.separator {
  width: 1px;
  height: 60px;
  background-color: #BBBBBB;
  margin: 0 10px;
  margin-left: 10%;
}

.titleword {
  margin-left: 5%;
  font-size: 18px;
  margin-top: 1%;
  font-family: 'alibaba'
}

.imgcontainer {
  margin-left: auto;
  margin-right: 16px;
}

.imgcontainer img {
  cursor: pointer;
}

.devider {
  width: 750px;
  height: 1px;
  background-color: #BBBBBB;
  margin-top: 10px;
  margin-left: 4%;
}

.reporttitle {
  margin-left: 6%;
  margin-top: 5%;
  font-size: 25px;
  font-family: 'PingFang';
  display: flex;
  justify-content: space-between;
  /* 在两端对齐内容 */
}

.reporttitle img {
  margin-left: auto;
  width: 60px;
  /* 设置所需的宽度 */
  height: 60px;
  /* 设置所需的高度 */
  object-fit: contain;
  /* 确保图片按照长宽比缩放 */
  border-radius: 50%;
  /* 使图片成为圆形 */
  object-fit: cover;
  /* 确保图片不失真 */
}

.assessor {
  font-size: 15px;
  margin-left: 10px;
  margin-top: 35px;
  color: rgba(16, 16, 16, 0.70);
  margin-right: 30px;
}

.statusandsubmitter {
  margin-left: 6%;
  display: flex;
}

.status {
  display: flex;
}

.container1 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.statusword {
  font-size: 21px;
  margin-left: 1%;
  font-family: 'PingFang';
  margin-top: 5px;
}

.currentstatus {
  margin-top: 13px;
  color: rgba(16, 16, 16, 0.70);
}

.submittercontainer {
  margin-left: 50px;
  display: flex;
}

.submittercontainer img {
  margin-top: 10px;
  width: 60px;
  /* 设置所需的宽度 */
  height: 60px;
  /* 设置所需的高度 */
  object-fit: contain;
  /* 确保图片按照长宽比缩放 */
  border-radius: 50%;
  /* 使图片成为圆形 */
  object-fit: cover;
  /* 确保图片不失真 */
}

.submitter {
  font-size: 15px;
  margin-left: 10px;
  margin-top: 45px;
  color: rgba(16, 16, 16, 0.70);
}

.mainreport {
  margin-left: 20px;
  margin-top: 20px;
  width: 730px;
  height: 360px;
  overflow-y: auto;
}

.title1,
.title2,
.title3,
.title4 {
  font-size: 20px;
  font-family: 'SiYuanHeiTi';
  margin-left: 40px;
  margin-top: 20px;
}

.text1,
.text2,
.text3,
.text4 {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-left: 10px;
  color: rgba(16, 16, 16, 0.49);
  font-family: 'SiYuanHeiTi';
  font-size: 18px;
}

.devider2 {
  width: 670px;
  height: 1px;
  background-color: #BBBBBB;
  margin-top: 30px;
  margin-left: 40px;
}

.clicktoreview {
  width: 90px;
  height: 30px;
  background-color: #FF3A30;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  border: #FF3A30 solid 1px;
  font-size: 16px;
  font-family: 'SiYuanHeiTi';
  margin-left: 200px;
  margin-top: 20px;
}

/* 弹窗淡入淡出动画 */
.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

p {
  font-size: 23px;
}

.smallmodal {
  z-index: 1001;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  /* 半透明背景 */
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 400px;
  /* 调整弹窗宽度 */
  max-width: 90%;
  /* 确保弹窗不会超出屏幕 */
  border-radius: 8px;
  text-align: center;
  transition: opacity 0.3s ease;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.confirm-button,
.cancel-button {
  flex: 1;
  height: 40px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-button {
  background-color: #3498db;
  /* 确认按钮的背景色 */
  color: #fff;
  border: #3498db;
}

.cancel-button {
  background-color: #ccc;
  /* 取消按钮的背景色 */
  color: #fff;
  margin-left: 10px;
  border: #ccc;
  /* 为了与确认按钮间隔 */
}

.confirm-button:hover,
.cancel-button:hover {
  opacity: 0.9;
}
</style>
