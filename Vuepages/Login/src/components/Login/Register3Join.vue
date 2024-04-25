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
          <img class="step2pic" src="@/assets/stepselected.svg" />输入/确认密码
        </div>
        <img src="@/assets/whitelink.png" class="link2" />
      </div>
      <!-- 第三步 -->
      <div class="step3">
        <div class="thirdstep">
          <img class="step3pic" src="@/assets/stepselecting.svg" />创建/加入团队
        </div>
        <img src="@/assets/whitelink.png" class="link3" />
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
      <!-- 第三步内容 -->
      <div class="STEPONE">
        <div class="steptitle1">步骤3/4</div>
        <div class="stepname1">加入企业</div>
        <!-- 已发送邀请码提示 -->
        <div class="sendtips">
          <img src="@/assets/tips.svg" class="tipsimg" />
          <span class="tipswords"
            >请在邮箱中查看由团队管理员发送给您的6位邀请码！</span
          >
        </div>
        <!-- 输入邀请码 -->
        <div class="codetitle">
          <img
            src="@/assets/LoginPassword.svg"
            style="width: 19px; margin-right: 8%"
          />邀请码
        </div>
        <input
          type="text"
          class="CodeInput"
          placeholder="请输入企业邀请码"
          v-model="invitecode"
        />
        <!-- 校验按钮 -->
        <button class="vertifybutton" @click="VertifyCode">验证</button>
        <!--企业信息 -->
        <div class="companytitle" v-if="vertified">
          <img
            src="@/assets/companymessage.svg"
            style="width: 19px; margin-right: 8%"
          />企业信息
        </div>
        <div class="companydetails" v-if="vertified">
          <div class="companyinitialground">
            <div class="initialletter">{{ CompanyNameFirstLetter }}</div>
          </div>
          <div class="companyname">
            <img src="@/assets/number1.png" />企业名称<span
              class="concretename"
              >{{ CompanyName }}</span
            >
          </div>
          <div class="companyaddress">
            <img src="@/assets/number2.png" />企业地址<span
              class="concreteaddress"
              >{{ CompanyAddress }}</span
            >
          </div>
          <div class="companysize">
            <img src="@/assets/number3.png" />企业规模<span
              class="concretesize"
              >{{ CompanySize }}</span
            >
          </div>
        </div>
        <!-- 核对企业信息提示 -->
        <div class="sendtips2" v-if="vertified">
          <img src="@/assets/tips.svg" class="tipsimg" />
          <span class="tipswords">请在确认企业信息以后进行下一步操作</span>
        </div>
      </div>
      <!-- 下一步按钮 -->
      <button class="nextstep" @click="JoinCompany">下一步</button>
    </div>
  </div>
</template>
      
      <script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import useStore from "@/store/store";
import {Authorization} from "@/store/token"
const router = useRouter();

//使用令牌
const token = Authorization();
const invitecode = ref("");
const CompanyNameFirstLetter = ref("");
const CompanyName = ref("");
const CompanySize = ref("");
const CompanyAddress = ref("");
const vertified = ref(false);
const requestBody = computed(() => ({
  code: invitecode.value,
}));
function VertifyCode() {
  fetch(
    "http://localhost:8080/api/company_user/getCompanyInfo?code=" +
      invitecode.value,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token.value,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(invitecode.value);
      console.log(data.msg);
      vertified.value = true;
      CompanyNameFirstLetter.value = data.data.name[0];
      CompanyName.value = data.data.name;
      CompanySize.value = data.data.size;
      CompanyAddress.value = data.data.address;
    })
    .catch((error) => {
      console.error("There was a problem with the creation:", error);
    });
}

function JoinCompany() {
  console.log(requestBody.value);
  //创建公司
  fetch("http://localhost:8080/api/company_user/joinCompany/${requestBody.value}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token.value,
    },
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
      console.log(data.msg);
      GotoSuccess();
    })
    .catch((error) => {
      console.error("There was a problem with the join:", error);
    });
}

const GotoSuccess = () => {
  if (router) {
    router.push({ name: "RegisterSuccess" });
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
  color: rgba(255, 255, 255, 1);
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
.sendtips {
  position: absolute;
  width: 425px;
  height: 90px;
  background-color: rgba(255, 98, 0, 0.15);
  border-radius: 20px;
  top: 600%;
}
.sendtips2 {
  position: absolute;
  width: 425px;
  height: 70px;
  background-color: rgba(255, 98, 0, 0.15);
  border-radius: 20px;
  top: 2200%;
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
  margin-top: 5%;
  margin-left: 1.5%;
}
.CodeInput {
  position: absolute;
  width: 425px;
  height: 55px;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  font-size: 21px;
  top: 1120%;
  box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.4);
  text-indent: 10px;
}
.CodeInput:focus {
  border-color: #ff8940;
  outline: none;
}
.codetitle {
  position: absolute;
  font-size: 24px;
  font-family: "PingFang";
  font-weight: bold;
  left: -220%;
  top: 1000%;
  width: 200%;
}
.companytitle {
  position: absolute;
  font-size: 24px;
  font-family: "PingFang";
  font-weight: bold;
  left: -220%;
  top: 1450%;
  width: 200%;
}
.vertifybutton {
  position: absolute;
  color: white;
  background-color: #5756d7;
  border: 1px solid #bbbbbb;
  border-radius: 4px;
  width: 70px;
  height: 30px;
  left: 350%;
  top: 1180%;
  cursor: pointer;
  font-family: "PingFang";
  font-weight: bold;
}
.companydetails {
  width: 425px;
  height: 160px;
  background-color: rgba(136, 136, 136, 0.15);
  position: absolute;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  top: 1570%;
}
.companyinitialground {
  width: 80px;
  height: 80px;
  background-color: #fb5b1d;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  margin-left: 4%;
  margin-top: 4%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.initialletter {
  font-size: 30px;
  color: white;
}
.companyname {
  font-size: 20px;
  font-family: "PingFang";
  font-weight: bold;
  color: #888888;
  margin-left: 28%;
  margin-top: -20%;
}
.companyaddress {
  font-size: 20px;
  font-family: "PingFang";
  font-weight: bold;
  color: #888888;
  margin-left: 28%;
  margin-top: 5%;
}
.companysize {
  font-size: 20px;
  font-family: "PingFang";
  font-weight: bold;
  color: #888888;
  margin-left: 28%;
  margin-top: 5%;
}
.companyname img {
  width: 21px;
  position: relative;
  left: -5px;
  top: 3.3px;
}
.companyaddress img {
  width: 21px;
  position: relative;
  left: -5px;
  top: 3.3px;
}
.companysize img {
  width: 21px;
  position: relative;
  left: -5px;
  top: 3.3px;
}
.companyname span {
  color: black;
  margin-left: 5%;
}
.companyaddress span {
  color: black;
  margin-left: 5%;
}
.companysize span {
  color: black;
  margin-left: 5%;
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
      
      
      
      