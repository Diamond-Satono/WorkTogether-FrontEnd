<template>
    <div class="background">
      <!-- 左侧 -->
      <div class="RetrievePasswordTitle">找回密码</div>
      <!-- 步骤条 -->
      <div class="steps">
        <div class="start"></div>
        <!-- 第一步 -->
        <div class="step1">
          <div class="firststep">
            <img class="step1pic" src="@/assets/stepselecting.svg" />邮箱验证
          </div>
          <img src="@/assets/whitelink.png" class="link1" />
        </div>
        <!--第二步 -->
        <div class="step2">
          <div class="secondstep">
            <img
              class="step2pic"
              src="@/assets/stepunselected.svg"
            />重置密码
          </div>
          <img src="@/assets/greylink.png" class="link2" />
        </div>
        <!-- 第三步 -->
        <div class="step3">
          <div class="thirdstep">
            <img
              class="step3pic"
              src="@/assets/stepunselected.svg"
            />找回成功
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
        <!-- 第一步内容 -->
        <div class="STEPONE">
          <div class="steptitle1">步骤1/3</div>
          <div class="stepname1">验证你的邮箱</div>
          <!-- 输入邮箱 -->
          <div class="emailtitle">
            <img
              src="@/assets/LoginMail.svg"
              style="width: 19px; margin-right: 8%"
            />邮箱
          </div>
          <input
            type="text"
            class="EmailInput"
            placeholder="youremail@xxx.com"
            v-model="email"
            :class="{ error: emailError }"
          />
          <!-- 邮箱错误提示 -->
          <div v-if="emailError" class="EmailError">
            发送失败,邮箱错误/账号已存在，请检查注册邮箱
          </div>
          <button class="SendCode" @click="SendCode">发送验证码</button>
          <!--已发送提示 -->
          <div class="sendtips" v-if="CodeSent">
            <img src="@/assets/tips.svg" class="tipsimg" />
            <span class="tipswords">验证码已发送至您的邮箱，5分钟内有效</span>
          </div>
          <!-- 输入验证码 -->
          <div class="codetitle">
            <img
              src="@/assets/code.svg"
              style="width: 19px; margin-right: 8%"
            />验证码
          </div>
          <input
            type="text"
            class="CodeInput"
            placeholder="请输入您在邮箱收到的验证码"
            v-model="code"
            :class="{ error: codeError }"
          />
          <!-- 验证码错误 -->
          <div v-if="codeError" class="CodeError">
            验证失败，请检查验证码/邮箱是否正确
          </div>
        </div>
        <!-- 下一步按钮 -->
        <button class="nextstep" @click="CheckCode">下一步</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, provide } from "vue";
  import { useRouter } from "vue-router";
  import useStore from "@/store/store";
  const router = useRouter();
  const CodeSent = ref(false);
  
  // const email = ref("");
  
  // const code = ref("");
  
  const { email, code } = useStore();
  
  const codeError = ref(false);
  
  const emailError = ref(false);
  
  const requestBodyforcode = computed(() => ({
    email: email.value,
  }));
  
  const requestBodyforcheck = computed(() => ({
    email: email.value,
    verificationCode: code.value,
  }));
  
  //发送注册验证码
  function SendCode() {
    fetch("http://localhost:8080/api/email/sendRegistrationCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyforcode.value),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(requestBodyforcode.value);
        //邮箱不正确
        if (data.msg === "发送失败,邮箱错误/账号已存在，请检查注册邮箱") {
          emailError.value = true;
          codeError.value = false;
        } else {
          CodeSent.value = true;
          emailError.value = false;
          codeError.value = false;
          console.log(data.msg);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the login:", error);
        emailError.value = true;
        codeError.value = false;
      });
  }
  
  //校验验证码正确性
  function CheckCode() {
    fetch("http://localhost:8080/api/email/checkRegistrationCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyforcheck.value),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(requestBodyforcheck.value);
        //邮箱不正确
        if (data.msg === "验证失败") {
          emailError.value = false;
          codeError.value = true;
        } else {
          emailError.value = false;
          codeError.value = false;
          console.log(data.msg);
          // 在这里进行email和code的存储
          email.value = requestBodyforcheck.value.email; // 存储email
          code.value = requestBodyforcheck.value.verificationCode; // 存储code
          goToRegister2();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the login:", error);
      });
  }
  
  const goToRegister2 = () => {
    if (router) {
      router.push({ name: "Register2" });
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
  .RetrievePasswordTitle {
    display: inline-block;
    font-size: 40px;
    color: white;
    font-family: "PingFang";
    font-weight: bold;
    position: absolute;
    top: 10%;
    left: 8.4%;
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
    width: 200px;
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
    color: rgba(255, 255, 255, 0.5);
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
  .emailtitle {
    position: absolute;
    font-size: 24px;
    font-family: "PingFang";
    font-weight: bold;
    left: -220%;
    top: 600%;
    width: 150%;
  }
  .EmailInput {
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
  .EmailInput:focus {
    border-color: #ff8940;
    outline: none;
  }
  .EmailInput.error {
    border: 1.5px solid #ff0000;
  }
  .EmailError {
    position: absolute;
    color: #ff0000;
    font-size: 17px;
    margin-top: 330%;
    margin-left: -60%;
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
  .codetitle {
    position: absolute;
    font-size: 24px;
    font-family: "PingFang";
    font-weight: bold;
    left: -220%;
    top: 1600%;
    width: 150%;
  }
  .CodeInput {
    position: absolute;
    width: 425px;
    height: 55px;
    border-radius: 20px;
    border: 1.5px solid #7d8592;
    font-size: 21px;
    top: 1720%;
    box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.4);
    text-indent: 10px;
  }
  .CodeInput:focus {
    border-color: #ff8940;
    outline: none;
  }
  .CodeInput.error {
    border: 1.5px solid #ff0000;
  }
  .CodeError {
    position: absolute;
    color: #ff0000;
    font-size: 17px;
    margin-top: 715%;
    margin-left: -150%;
    width: max-content;
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
  
  
  
  