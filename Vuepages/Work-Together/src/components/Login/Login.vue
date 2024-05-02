<template>
  <div class="background">
    <img src="@/assets/loginimgs/LoginMain.png" class="LoginPic" />
    <div class="loginbackground">
      <!-- 标题 -->
      <div class="title">
        <img src="@/assets/loginimgs/TitleIcon.svg" class="TitleIcon" />
        <div class="titlewords">
          <div class="titleChn">
            我们<span class="titleChndevide">一起工作吧</span>
          </div>
          <div class="titleEng">WorkTogether</div>
        </div>
      </div>
      <!-- 登录字样 -->
      <div class="Logintitle">
        <div class="LoginChn">登录账号</div>
        <div class="LoginEng">Login</div>
      </div>
      <!-- 邮箱和密码输入 -->
      <div class="input">
        <div class="Email">
          <img src="@/assets/loginimgs/LoginMail.svg" class="EmailImg" />
          <span class="Emailword">邮箱</span>
          <input
            type="text"
            class="EmailInput"
            placeholder="youremail@xxx.com"
            v-model="email"
            :class="{ error: emailError }"
          />
        </div>
        <div class="Password">
          <img src="@/assets/loginimgs/LoginPassword.svg" class="PasswordImg" />
          <span class="Passwordword">密码</span>
          <input
            type="password"
            class="PasswordInput"
            placeholder="请输入密码"
            v-model="password"
            :class="{ error: passwordError }"
          />
          <button
            class="TogglePasswordButton"
            @click="togglePasswordVisibility"
          ></button>
        </div>
      </div>
      <!-- 邮箱错误 -->
      <div v-if="emailError" class="EmailError">邮箱格式不正确，请重新输入</div>
      <!-- 密码错误 -->
      <div v-if="passwordError" class="PasswordError">密码错误，请重新输入</div>
      <!-- 账户不存在 -->
      <div v-if="noaccount" class="noaccount">账户不存在</div>
      <!-- 找回密码 -->
      <div class="FindbackPassword" @click="goToRetrievePassword">找回密码</div>
      <!-- 登录按钮 -->
      <button class="goLogin" @click="Login">
        <img class="Loginbutton" src="@/assets/loginimgs/Loginbutton.svg" />去工作吧
      </button>
      <!--注册账号 -->
      <div class="register" @click="goToRegister">
        还没有账号，去注册<img src="@/assets/loginimgs/register.svg" />
      </div>
    </div>
    <LoginSuccess ref="alert"/>
  </div>
</template>


<style scoped>
.background {
  height: 100vh;
  width: 100vw;
  background-color: #ff8940;
}
.LoginPic {
  height: auto;
  width: 55%;
  margin-top: 6%;
  margin-left: 5%;
}
.loginbackground {
  position: absolute;
  top: 0;
  right: 0; /* 从屏幕右侧开始位置 */
  height: 100vh;
  width: 34%;
  border-radius: 30px 0 0 30px;
  background: white;
  display: flex;
  justify-content: center; /* 水平居中 */
}
.title {
  margin-top: 10%;
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
.Logintitle {
  display: flex;
  position: absolute;
  flex-direction: column; /* 垂直排列子元素 */
  left: 13%;
  top: 22%;
}
.LoginChn {
  font-size: 32px;
  font-family: "PingFang";
  font-weight: bold;
}
.LoginEng {
  font-size: 28px;
  color: #bcbcbc;
  font-weight: bold;
}
.input {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 水平居中 */
}
.EmailImg {
  width: 19px;
}
.PasswordImg {
  width: 19px;
}
.Emailword {
  margin-left: 2%;
  font-size: 24px;
  font-family: "PingFang";
  font-weight: 900;
}
.Password {
  margin-top: 5%;
}
.Passwordword {
  margin-left: 2%;
  font-size: 24px;
  font-family: "PingFang";
  font-weight: 900;
}
.EmailInput {
  width: 425px;
  height: 55px;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  font-size: 21px;
  margin-top: 3%;
  box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.4);
  text-indent: 10px;
}
.EmailInput:focus {
  border-color: #ff8940;
  outline: none;
}
.PasswordInput {
  width: 425px;
  height: 55px;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  font-size: 21px;
  margin-top: 3%;
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

.PasswordError {
  position: absolute;
  color: #ff0000;
  font-size: 17px;
  margin-top: 5px;
  top: 60%;
  left: 18%;
}
.EmailInput.error {
  border: 1.5px solid #ff0000;
}

.EmailError {
  position: absolute;
  color: #ff0000;
  font-size: 17px;
  margin-top: 5px;
  top: 60%;
  left: 18%;
}
.noaccount {
  position: absolute;
  color: #ff0000;
  font-size: 17px;
  margin-top: 5px;
  top: 60%;
  left: 18%;
}
.TogglePasswordButton {
  visibility: hidden;
}
.FindbackPassword {
  position: absolute;
  left: 72%;
  top: 60%;
  cursor: pointer;
  font-size: 17px;
  color: #7d8592;
  font-family: "PingFang";
  font-weight: bold;
}
.goLogin {
  width: 425px;
  height: 55px;
  border-radius: 20px;
  background-color: rgba(255, 98, 0, 0.75);
  border: 1px solid #bbbbbb;
  position: absolute;
  top: 66%;
  cursor: pointer;
  display: flex;
  font-size: 23px;
  color: white;
  justify-content: center;
  align-items: center;
}
.Loginbutton {
  width: 22px;
  margin-right: 2%;
}
.register {
  position: absolute;
  top: 73%;
  cursor: pointer;
  font-size: 17px;
  color: #ff6200;
  font-family: "PingFang";
  font-weight: 600;
}
.register img {
  width: 20px;
  position: relative;
  left: 5px;
  top: 3.3px;
}
</style>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import useStore from "@/store/store";
import {Authorization} from "@/store/token"
import LoginSuccess from './LoginSuccess.vue';
// const email = ref("");

// const password = ref("");

const requestBody = computed(() => ({
  email: email.value,
  password: password.value,
}));

const passwordError = ref(false);
const emailError = ref(false);
const noaccount = ref(false);
//邮箱、密码、令牌
const {email,password,} = useStore();
const token = Authorization();
const router = useRouter();

const alert = ref();

//显示密码方法
function togglePasswordVisibility() {
  const passwordInput = document.querySelector(
    ".PasswordInput"
  ) as HTMLInputElement;
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}
//登录
function Login() {
  // 发送登录请求到后端API
  fetch("http://localhost:8080/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody.value),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(requestBody.value);
      //邮箱不正确
      if (data.msg === "邮箱格式错误/不支持该类邮箱") {
        emailError.value = true;
        noaccount.value = false;
        passwordError.value = false;
        console.error("邮箱不正确，请重新输入");
      }
      // 密码错误,显示错误信息
      else if (data.msg === "密码错误") {
        passwordError.value = true;
        noaccount.value = false;
        emailError.value = false;
        console.error("密码错误，请重新输入");
      } else if (data.msg === "账户不存在") {
        noaccount.value = true;
        emailError.value = false;
        passwordError.value = false;
      } else {
        // 登录成功
        noaccount.value = false;
        emailError.value = false;
        passwordError.value = false;
        console.log(data.msg);
        // 在这里进行 Authorization 令牌的存储
        token.value = data.data; // 存储 Authorization
        console.log("令牌：", token.value);
        showAlert();
      }
    })
    .catch((error) => {
      console.error("There was a problem with the login:", error);
    });
}

const goToRegister = () => {
  if (router) {
    router.push({ name: "Register" });
  } else {
    console.error("Router is not initialized.");
  }
};

const goToRetrievePassword = () =>{
  if (router) {
    router.push({ name: "RetrievePassword" });
  } else {
    console.error("Router is not initialized.");
  }
}

const goToHomePage = () => {
  if (router) {
    router.push({ name: "HomePage" });
  } else {
    console.error("Router is not initialized.");
  }
};

const showAlert = () => {
  alert.value.displayAlert('登录成功', 1500);
  console.log("弹窗显示");
  setTimeout(goToHomePage, 1500); // 延迟1.5秒后跳转到HomePage页面
};
</script>
