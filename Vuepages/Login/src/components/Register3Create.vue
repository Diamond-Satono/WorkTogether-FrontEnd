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
        <div class="stepname1">创建企业</div>
        <!-- 填写企业信息 -->
        <div class="companytitle">
          <img
            src="@/assets/company.svg"
            style="width: 19px; margin-right: 8%"
          />企业信息
        </div>
        <input v-model="companyName"type="text" class="companynameinput" placeholder="企业名称" />
        <select name="CompanySize" id="CompanySize" v-model="companySize">
          <option value="default">选择企业规模</option>
          <option value="1~10">1~10人</option>
          <option value="11~25">11~25人</option>
          <option value="26~50">26~50人</option>
          <option value="51~100">51~100人</option>
          <option value="101~250">101~250人</option>
          <option value="251~500">251~500人</option>
        </select>
        <div class="IndustrySelect">
          <select v-model="selectedIndustry" name="Industry" id="Industry">
            <option value="default">选择行业大类</option>
            <option value="IT服务">IT服务</option>
            <option value="制造业">制造业</option>
            <option value="生活服务">生活服务</option>
            <option value="教育">教育</option>
            <option value="建筑/房地产">建筑/房地产</option>
          </select>
          <select v-model="concreteIndustry"name="ConcreteIndustry" id="ConcreteIndustry">
            <option value="default">选择具体行业</option>
            <option v-for="industry in concreteIndustries" :value="industry">
              {{ industry }}
            </option>
          </select>
        </div>
      </div>
      <!-- 下一步按钮 -->
      <button class="nextstep" @click="CreateAccountandCompany">下一步</button>
    </div>
  </div>
</template>
      
<script setup lang="ts">
import { ref, computed, watch, inject } from "vue";
import { useRouter } from "vue-router";
import useStore from "@/store/store";
const router = useRouter();

const selectedIndustry = ref("default");
const concreteIndustries = ref<string[]>([]);




watch(selectedIndustry, (newValue) => {
  // 根据选定的行业动态更新ConcreteIndustry的选项
  switch (newValue as string) {
    case "IT服务":
      concreteIndustries.value = ["软件开发", "网络安全", "数据分析"];
      break;
    case "制造业":
      concreteIndustries.value = ["汽车制造", "机械制造", "电子制造"];
      break;
    case "生活服务":
      concreteIndustries.value = ["餐饮服务", "酒店服务", "美容美发"];
      break;
    case "教育":
      concreteIndustries.value = ["学前教育", "小学教育", "中学教育"];
      break;
    case "建筑/房地产":
      concreteIndustries.value = ["住宅建筑", "商业建筑", "土地开发"];
      break;
    default:
      concreteIndustries.value = [""];
      break;
  }
});
//获取令牌
const {Authorization} = useStore();
//创建公司所需数据
const companyName = ref('');
const concreteIndustry = ref('default');
const companySize = ref('default');
const requestBodyforcreatecompany = computed(() => ({
  name: companyName.value,
  industry: concreteIndustry.value,
  size: companySize.value,
}));

//创建公司
function CreateAccountandCompany() {
  console.log(Authorization.value);
console.log(requestBodyforcreatecompany.value)
  //创建公司
  fetch("http://localhost:8080/api/company/createCompany", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": Authorization.value
    },
    body: JSON.stringify(requestBodyforcreatecompany.value),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(requestBodyforcreatecompany.value);
      console.log(data.msg);
      GotoSuccess();
    })
    .catch((error) => {
      console.error("There was a problem with the creation:", error);
    });
}

//跳转页面
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
.companytitle {
  position: absolute;
  font-size: 24px;
  font-family: "PingFang";
  font-weight: bold;
  left: -325%;
  top: 600%;
  width: 200%;
}
.companynameinput {
  position: absolute;
  width: 600px;
  height: 55px;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  font-size: 21px;
  top: 740%;
  box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.4);
  text-indent: 10px;
}
.companynameinput:focus {
  border-color: #ff8940;
  outline: none;
}
#CompanySize {
  position: absolute;
  width: 606px;
  height: 59px;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  font-size: 21px;
  top: 1140%;
  box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.4);
  text-indent: 10px;
}
#CompanySize:focus {
  border-color: #ff8940;
  outline: none;
}
.IndustrySelect {
  position: absolute;
  top: 1540%;
  display: flex;
  width: 606px;
  justify-content: space-between;
}
#Industry {
  width: 280px;
  height: 59px;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  font-size: 21px;
  box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.4);
  text-indent: 10px;
}
#Industry:focus {
  border-color: #ff8940;
  outline: none;
}
#ConcreteIndustry {
  width: 280px;
  height: 59px;
  border-radius: 20px;
  border: 1.5px solid #7d8592;
  font-size: 21px;
  box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.4);
  text-indent: 10px;
}
#ConcreteIndustry:focus {
  border-color: #ff8940;
  outline: none;
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
      
      
      
      