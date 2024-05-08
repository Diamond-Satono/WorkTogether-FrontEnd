<template>
  <div class="container">
    <div class="title">
      成员详情
      <img
        src="@/assets/deptimgs/closeModal.png"
        class="closeModal"
        @click="$emit('close-modal')"
      />
    </div>
    <div class="cutoff1"></div>
    <div class="membertitle">
      <img class="nameimg" src="@/assets/img/icon.png" />
      <span class="membertitlename">{{ props.user.name }}</span>
    </div>
    <!-- 标签页部分 -->
    <div class="tabs">
      <div
        class="tab"
        :class="{ activeTab: activeTab === 'basicInfo' }"
        @click="activeTab = 'basicInfo'">
        基本信息
      </div>
      <div
        class="tab"
        :class="{ activeTab: activeTab === 'workInfo' }"
        @click="activeTab = 'workInfo'">
        工作信息
      </div>
    </div>
    <!-- <div class="cutoff2"></div> -->
    <!-- 标签页内容部分 -->
    <div v-if="activeTab === 'basicInfo'" class="tabContent">
      <!-- 基本信息内容 -->
      <div class="detail1">
        <div class="membername">姓名</div>
        <div class="detailmembername">{{ props.user.name }}</div>
      </div>
      <div class="detail2">
        <div class="membergender">性别</div>
        <div class="detailmembergender">男</div>
      </div>
      <div class="detail3">
        <div class="memberemail">邮箱</div>
        <div class="detailmemberemail">{{ props.user.email}}</div>
      </div>
      <div class="detail4">
          <div class="memberphone">电话</div>
          <div class="detailmemberphone">12345678910</div>
      </div>
    </div>
    <div v-else-if="activeTab === 'workInfo'" class="tabContent">
      <!-- 工作信息内容 -->
      <!-- 显示详情 -->
      <div v-if="showDetail">
        <div class="detail1">
          <div class="deptname">部门</div>
          <div class="detaildeptname">{{ props.user.deptName }}</div>
        </div>
        <div class="detail2">
          <div class="membertype">人员类型</div>
          <div class="detailmembertype">正式</div>
        </div>
        <div class="detail3">
          <div class="entrytime">入职时间</div>
          <div class="detailentrytime">2024-01-01</div>
        </div>
        <div class="detail4">
          <div class="workarea">工作国家或地区</div>
          <div class="detailworkarea">中国香港</div>
        </div>
        <div class="detail5">
          <div class="memberposition">职务</div>
          <div class="detailmemberposition">{{ props.user.position }}</div>
        </div>
        <div class="buttoncontainer1">
          <button class="edit" @click="toggleEditMode">编辑信息</button>
        </div>
      </div>
      <!-- 显示编辑信息 -->
      <div v-else>
        <div class="detail1">
          <div class="deptname">部门</div>
          <div class="detaildeptname">{{ props.user.deptName }}</div>
        </div>
        <div class="detail2">
          <div class="membertype">人员类型</div>
          <select class="detailmembertype  custom-input" value="正式">
            <option v-for="(type, index) in types" :key="index">
            {{ type }}
            </option>
          </select>
        </div>
        <div class="detail3">
          <div class="entrytime">入职时间</div>
          <div class="detailentrytime">2024-01-01</div>
        </div>
        <div class="detail4">
          <div class="workarea">工作国家或地区</div>
          <select class="detailworkarea  custom-input" value="中国香港">
            <option v-for="(area, index) in areas" :key="index">
            {{ area }}
            </option>
          </select>
        </div>
        <div class="detail5">
          <div class="memberposition">职务</div>
          <select class="detailmemberposition  custom-input" v-model="selectedPostition">
            <option v-for="(postn, index) in positions" :key="index">
            {{ postn }}
            </option>
          </select>
        </div>
        <div class="buttoncontainer2">
          <button class="cancel" @click="canceledit">取消</button>
          <button class="save"  @click="$emit('close-modal')">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {Authorization} from "@/store/token"
const tokens = Authorization();
// 初始化默认标签页为“基本信息”
const activeTab = ref('basicInfo');

//获取父组件参数
const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
});

const types = ref(["正式", "实习", "外包", "正式", "劳务", "顾问"]);
const areas = ref(["中国香港", "中国", "美国", "加拿大", "法国", "德国", "英国", "澳大利亚", "新西兰", "意大利"]);
const positions = ref([props.user.position, "技术总监", "运营总监", "CEO", "人力资源总监", "财务总监", "产品总监", "设计总监", "市场总监"]);
const selectedPostition = ref(props.user.position);//已选中的职位
// const selectedDepartmentId = ref();//已选中的部门id
console.log(props.user);
console.log(selectedPostition.value);
watch(selectedPostition, (newValue, oldValue) => {
    // const index = props.positions.indexOf(newValue);
    // selectedDepartmentId.value = props.positions[index].pid;
    // console.log(index);
    console.log(selectedPostition.value);
    
});

const showDetail = ref(true);

function toggleEditMode() {
  showDetail.value = !showDetail.value;
}

function canceledit(){
  showDetail.value = !showDetail.value;
}
const companyId = 1; // 根据实际情况替换
const companyIdString = companyId.toString();
//拉取职位列表
onMounted(() => {
  fetchPositionData();
});
function fetchPositionData() {
  fetch(`http://localhost:8080/api/group/position`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
          'Authorization': tokens.value, // 设置 Authorization 请求头，用于身份验证
          'companyId': companyIdString // 设置 companyId 请求头，用于传递公司 ID
      }
    })
    .then(response => {
        console.log(response);
        // 检查响应状态
        if (!response.ok) {
            alert("拉取失败")
            throw new Error('Network error');
        }
        // 解析响应为 JSON 格式
        return response.json();
    })
    .then(data => {
        // 请求成功，更新用户数据
        positions.value = data.data;
        console.log(tokens.value);
        
        console.log("positions.value=", positions.value);
                            
    })
    .catch(error => {
        console.error('Error fetching positions data:', error);
        // Handle the error, e.g., show a message to the user
    });
}
//编辑成员信息
function fetchMemberData() {
  const fortmaData = {
    id: props.user.id,
    did: props.user.deptId,
    position: selectedPostition.value
  };
  console.log(fortmaData);
  
  fetch(`http://localhost:8080/api/dept/member`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
          'Authorization': tokens.value, // 设置 Authorization 请求头，用于身份验证
          'companyId': companyIdString // 设置 companyId 请求头，用于传递公司 ID
      },
      body: JSON.stringify(fortmaData)
    })
    .then(response => {
        console.log(response);
        // 检查响应状态
        if (!response.ok) {
            alert("变更失败")
            throw new Error('Network error');
        } 
        // 解析响应为 JSON 格式
        return response.json();
    })
    .then(data => {
        // 请求成功，更新用户数据
        positions.value = data.data;
        console.log(tokens.value);
        
        console.log("positions.value=", positions.value);
                            
    })
    .catch(error => {
        console.error('Error fetching positions data:', error);
        // Handle the error, e.g., show a message to the user
    });
}
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
.membertitle {
  font-size: 25px;
  margin-top: 4%;
  margin-left: 9%;
  display: flex;
}
.nameimg {
  width: 80px;
  height: 80px;
  margin-right: 5%;
}
.membertitlename {
  margin-top: 7%;
}
.cutoff2 {
  border-top: 1px solid #bbbbbb;
  margin-top: 4%;
  margin-left: 5%;
  margin-right: 5%;
}
/* 标签页样式 */
.tabs {
  display: flex;
  justify-content: start;
  border-bottom: 1px solid #bbbbbb;
  margin-top: 4%;
  margin-left: 5%;
  margin-right: 5%;
  font-size: 21px;
  font-family: "SiYuanHeiTi";
}

.tab {
  cursor: pointer;
  padding: 0px 15px;
  color: #8e8e93;
}

.activeTab {
  color: #FB682F;
  border-bottom: 1px solid #FB682F;
}
/* 工作信息栏 */
.detail1 {
  margin-top: 4%;
  margin-left: 8%;
} 
.membername,
.membergender,
.memberemail,
.memberphone,
.deptname,
.membertype,
.entrytime,
.workarea,
.memberposition {
  color: #8e8e93;
  font-size: 25px;
  font-family: "SiYuanHeiTi";
}
.detailmembername,
.detailmembergender,
.detailmemberemail,
.detailmemberphone,
.detaildeptname,
.detailmembertype,
.detailentrytime,
.detailworkarea,
.detailmemberposition {
  margin-top: 2%;
  font-family: "alibaba";
  font-size: 22px;
}
.detail2,
.detail3,
.detail4,
.detail5 {
  margin-top: 3%;
  margin-left: 8%;
}
.buttoncontainer1 {
  margin-top: 10%;
  margin-left: 62%;
}
.edit {
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
.custom-input{
  width:550px;
  height: 38px;
  border-radius: 10px;
  border: #bbbbbb solid 1px;
  padding-left: 1%;
}
.custom-input:focus{
  outline: none;
}
.buttoncontainer2 {
  margin-top: 10%;
  margin-left: 50%;
  display: flex;
}
.cancel{
  width: 120px;
  height: 52px;
  border-radius: 10px;
  color: black;
  background-color: white;
  font-size: 20px;
  border: #BBBBBB solid 1px;
  cursor: pointer;
  font-family: "SiYuanHeiTi";
  font-weight: bold;
}
.save{
  width: 120px;
  height: 52px;
  border-radius: 10px;
  color: white;
  background-color: #ff6200;
  font-size: 20px;
  border: #ff6200 solid 1px;
  cursor: pointer;
  font-family: "SiYuanHeiTi";
  font-weight: bold;
  margin-left: 10%;
}
</style>
  