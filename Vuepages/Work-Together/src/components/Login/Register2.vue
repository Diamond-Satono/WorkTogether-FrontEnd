<template>
  <div class="background">
    <!-- 左侧 -->
    <div class="RegisterTitle">注册</div>
    <!-- 步骤条 -->
    <div class="steps">
      <div class="start">我们开始吧</div>
      <!-- 第一步 -->
      <div class="step1">
        <div class="firststep">
          <img class="step1pic" src="@/assets/stepselected.svg" />邮箱验证
        </div>
        <img src="@/assets/whitelink.png" class="link1" />
      </div>
      <!--第二步 -->
      <div class="step2">
        <div class="secondstep">
          <img class="step2pic" src="@/assets/stepselecting.svg" />输入/确认密码
        </div>
        <img src="@/assets/whitelink.png" class="link2" />
      </div>
      <!-- 第三步 -->
      <div class="step3">
        <div class="thirdstep">
          <img
            class="step3pic"
            src="@/assets/stepunselected.svg"
          />创建/加入团队
        </div>
        <img src="@/assets/greylink.png" class="link3" />
      </div>
      <!-- 第四步 -->
      <div class="step4">
        <div class="fourthstep">
          <img class="step4pic" src="@/assets/stepunselected.svg" />注册成功
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="Registerbackground">
      <!-- 图标和标题 -->
      <div class="icontitle">
        <img src="@/assets/TitleIcon.svg" class="TitleIcon" />
        <div class="titlewords">
          <div class="titleChn">
            我们<span class="titleChndevide">一起工作吧</span>
          </div>
          <div class="titleEng">WorkTogether</div>
        </div>
      </div>
      <!-- 第二步内容 -->
      <div class="STEPONE">
        <div class="steptitle1">步骤2/4</div>
        <div class="stepname1">输入/确认密码</div>
        <!-- 输入密码 -->
        <div class="passwordtitle">
          <img
            src="@/assets/LoginPassword.svg"
            style="width: 19px; margin-right: 8%"
          />输入密码
        </div>
        <input
          type="password"
          class="PasswordInput"
          placeholder="请输入你的密码"
          v-model="password"
          :class="{ error: passwordError }"
        />
        <!-- 邮箱错误提示 -->
        <div v-if="confirmpasswordError" class="EmailError">
          密码不一致/未输入密码，请重新输入
        </div>
        <!-- 确认密码 -->
        <div class="confirmpasswordtitle">
          <img
            src="@/assets/lock.svg"
            style="width: 19px; margin-right: 8%"
          />确认密码
        </div>
        <input
          type="password"
          class="ConfirmPasswordInput"
          placeholder="请输入与上方相同的密码"
          v-model="confirmpassword"
          :class="{ error: confirmpasswordError }"
        />
      </div>
      <!-- 下一步按钮 -->
      <button class="nextstep" @click="CheckPassword">下一步</button>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
import { ref, computed, provide } from "vue";
import { useRouter } from "vue-router";
import useStore from "@/store/store";
import {Authorization} from "@/store/token";
const password = ref("");

// const confirmpassword = ref("");

const passwordError = ref(false);

const confirmpasswordError = ref(false);

const router = useRouter();

const token = Authorization();

//获取已经存储数据用来创建账号
const { email, code, confirmpassword} = useStore();
const requestBodyforcreate = computed(() => ({
  email: email.value,
  password: confirmpassword.value,
  verificationCode: code.value,
}));

//检查2个密码是否正确
function CheckPassword() {
  // 检查密码是否为空
  if (!password.value.trim() || !confirmpassword.value.trim()) {
    passwordError.value = !password.value.trim();
    confirmpasswordError.value = !confirmpassword.value.trim();
    return;
  }

  // 检查两个密码是否相同
  if (password.value !== confirmpassword.value) {
    passwordError.value = true;
    confirmpasswordError.value = true;
    return;
  }
  passwordError.value = false;
  confirmpasswordError.value = false;
  // 如果密码正确，则执行 register函数和goToRegister3 函数
  register();
  goToRegister3();
  console.log("success");
}
//创建账号
function register() {
  fetch("http://localhost:8080/api/user/createUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBodyforcreate.value),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(requestBodyforcreate.value);
      console.log(data.msg);
      // 在这里进行 Authorization 令牌的存储
      token.value = data.data; // 存储 Authorization
      console.log("令牌：", token.value);
    })
    .catch((error) => {
      console.error("There was a problem with the creation:", error);
    });
}

const goToRegister3 = () => {
  if (router) {
    router.push({ name: "Register3" });
  } else {
    console.error("Router is not initialized.");
  }
};
</script>
  
  <style scoped>
.background {
  height: 100vh;
  width: 100%;
  background-color: #ff8940;
  position: relative;
}
.RegisterTitle {
  display: inline-block;
  font-size: 40px;
  color: white;
  font-family: "PingFang";
  font-weight: bold;
  position: absolute;
  top: 10%;
  left: 10.5%;
}
.steps {
  position: absolute;
  /* background-color: red; */
  left: 4%;
  top: 22%;
}
.start {
  font-size: 40px;
  color: white;
  font-family: "PingFang";
  font-weight: bold;
}
.step1 {
  margin-top: 20%;
}
.step1pic {
  margin-right: 10%;
  position: relative;
  top: 5px;
}
.firststep {
  font-size: 22px;
  color: white;
  font-family: "PingFang";
  font-weight: bold;
}
.link1 {
  width: 2px;
  height: 67px;
  object-fit: fill;
  margin-left: 6%;
  margin-top: 10%;
}
.step2 {
  margin-top: 6%;
}
.step2pic {
  margin-right: 10%;
  position: relative;
  top: 5px;
}
.secondstep {
  font-size: 22px;
  color: rgba(255, 255, 255, 1);
  font-family: "PingFang";
  font-weight: bold;
}
.link2 {
  width: 2px;
  height: 67px;
  object-fit: fill;
  margin-left: 6%;
  margin-top: 10%;
}
.step3 {
  margin-top: 6%;
}
.step3pic {
  margin-right: 10%;
  position: relative;
  top: 5px;
}
.thirdstep {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.5);
  font-family: "PingFang";
  font-weight: bold;
}
.link3 {
  width: 2px;
  height: 67px;
  object-fit: fill;
  margin-left: 6%;
  margin-top: 10%;
}
.step4 {
  margin-top: 6%;
}
.step4pic {
  margin-right: 10%;
  position: relative;
  top: 5px;
}
.fourthstep {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.5);
  font-family: "PingFang";
  font-weight: bold;
}
.Registerbackground {
  position: absolute;
  top: 0;
  right: 0; /* 从屏幕右侧开始位置 */
  height: 100vh;
  width: 75%;
  border-radius: 30px 0 0 30px;
  background: white;
  display: flex;
  justify-content: center; /* 水平居中 */
}
.icontitle {
  margin-left: -65%;
  margin-top: 4%;
  display: flex;
}
.titlewords {
  flex-direction: column; /* 垂直排列子元素 */
}
.TitleIcon {
  height: 82px;
}
.titleChn {
  font-size: 32px;
  font-family: "PingFang";
  font-weight: bold;
}
.titleChndevide {
  color: rgba(255, 98, 0, 0.7);
}
.titleEng {
  font-size: 28px;
  /* font-family: "PingFang"; */
  color: #bbbbbb;
  font-weight: bold;
}
.STEPONE {
  display: flex;
  position: absolute;
  top: 10%;
  justify-content: center;
}
.steptitle1 {
  color: #ff6200;
  font-size: 22px;
  font-family: "PingFang";
  font-weight: bold;
}
.stepname1 {
  width: max-content;
  position: absolute;
  font-size: 32px;
  font-family: "PingFang";
  font-weight: bold;
  margin-top: 100%;
}
.passwordtitle {
  position: absolute;
  font-size: 24px;
  font-family: "PingFang";
  font-weight: bold;
  left: -220%;
  top: 600%;
  width: 200%;
}
.PasswordInput {
  position: absolute;
  width: 425px;
  height: 55px;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  font-size: 21px;
  top: 720%;
  box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.4);
  text-indent: 10px;
}
.PasswordInput:focus {
  border-color: #ff8940;
  outline: none;
}
.PasswordInput.error {
  border: 1.5px solid #ff0000;
}
.EmailError {
  position: absolute;
  color: #ff0000;
  font-size: 17px;
  margin-top: 340%;
  margin-left: -150%;
  width: max-content;
}
.SendCode {
  position: absolute;
  color: white;
  font-size: 16px;
  border-radius: 20px;
  background-color: rgba(255, 98, 0, 1);
  border: 1px solid #bbbbbb;
  height: 45px;
  width: 135px;
  font-family: "PingFang";
  font-weight: bold;
  top: 1000%;
  left: -215%;
  cursor: pointer;
}
.sendtips {
  position: absolute;
  width: 425px;
  height: 90px;
  background-color: rgba(255, 98, 0, 0.15);
  border-radius: 20px;
  top: 1200%;
}
.tipsimg {
  margin-left: 3%;
  margin-top: 3%;
}
.tipswords {
  position: absolute;
  font-size: 18px;
  font-family: "PingFang";
  font-weight: bold;
  color: #ff6200;
  margin-top: 8%;
  margin-left: 5%;
}
.confirmpasswordtitle {
  position: absolute;
  font-size: 24px;
  font-family: "PingFang";
  font-weight: bold;
  left: -220%;
  top: 1100%;
  width: 170%;
}
.ConfirmPasswordInput {
  position: absolute;
  width: 425px;
  height: 55px;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  font-size: 21px;
  top: 1220%;
  box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.4);
  text-indent: 10px;
}
.ConfirmPasswordInput:focus {
  border-color: #ff8940;
  outline: none;
}
.ConfirmPasswordInput.error {
  border: 1.5px solid #ff0000;
}
.CodeError {
  position: absolute;
  color: #ff0000;
  font-size: 17px;
  margin-top: 5px;
  top: 67.5%;
  left: 36%;
}
.nextstep {
  position: absolute;
  height: 54px;
  width: 170px;
  background-color: rgba(255, 98, 0, 0.75);
  color: white;
  font-size: 18px;
  font-family: "PingFang";
  font-weight: bold;
  border-radius: 20px;
  border: 1px solid #bbbbbb;
  top: 90%;
  right: 5%;
  cursor: pointer;
}
</style>
  
  
  
  