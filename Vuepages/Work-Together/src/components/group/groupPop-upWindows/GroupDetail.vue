<template>
    <div class="container">
        <div class="title">
            团队详情
            <img src="@/assets/deptimgs/closeModal.png" class="closeModal" @click="CloseModal" />
        </div>
        <div class="cutoff1"></div>
        <div class="depttitle">
            <img class="nameimg" src="@/assets/deptimgs/group.png" />
            <span class="depttitlename">{{ props.row.name }}</span>
        </div>
        <div class="cutoff2"></div>
        <!-- 显示详情 -->
        <div v-if="showDetail">
            <div class="detail2">
                <div class="deptname">团队名称</div>
                <div class="deptdetailname">{{ props.row.name }}</div>
            </div>
            <div class="detail3">
                <div class="deptmanager">团队负责人</div>
                <div class="deptdetailmanager">{{ props.row.manager }}</div>
            </div>
            <div class="detail4">
                <div class="managerphone">团队负责人电话</div>
                <div class="detailmanagerphone">12345678910</div>
            </div>
            <div class="detail5">
                <div class="associatedept">团队关联部门</div>
                <div class="dept">市场部</div>
            </div>
            <div class="detail6">
                <div class="groupslogan">团队口号</div>
                <div class="slogan">{{props.row.description}}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Authorization } from "@/store/token";
import { ref, onMounted } from "vue";
const emit = defineEmits(["close-modal", "refresh-table"]);
//获取父组件参数
const props = defineProps({
    row: {
        type: Object,
        default: () => ({}),
    },
});

console.log(props.row);

const showDetail = ref(true);

function toggleEditMode() {
    showDetail.value = !showDetail.value;
}

function canceledit() {
    showDetail.value = !showDetail.value;
}

const token = Authorization();

const parentId = ref(props.row.parentid);

const deptId = parentId.value;

const ParentDeptName = ref('');

const selectedMember = ref('');

const members = ref([] as any[]); // 用于存储成员数据

onMounted(() => {
    fetchUserData();
    selectedMember.value = props.row.manager;
    console.log('selectedMember.value', selectedMember.value);
});



//拉取成员列表
function fetchUserData() {
    const companyId = 1;
    const url = 'http://localhost:8080/api/user/company/1';
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', // 设置 Content-Type 请求头为 JSON
            'Authorization': token.value, // 设置 Authorization 请求头，用于身份验证
            'companyId': companyId.toString(), // 设置 companyId 请求头，用于传递公司 ID
        }
    })
        .then(response => {
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
            console.log('成员数据：', data.data);
            members.value = data.data;
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            // Handle the error, e.g., show a message to the user
        });
}


function CloseModal() {
    emit("close-modal");
}
</script>

<style scoped>
.container {
    position: fixed;
    /* 定位在屏幕上方 */
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
    vertical-align: middle;
    /* 设置垂直居中对齐 */
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
.managerphone,
.groupslogan,
.associatedept {
    color: #8e8e93;
    font-size: 25px;
    font-family: "SiYuanHeiTi";
}

.deptbelongname,
.deptdetailname,
.deptdetailmanager,
.detailmanagerphone,
.slogan,
.dept {
    margin-top: 2%;
    font-family: "alibaba";
    font-size: 22px;
}

.detail2,
.detail3,
.detail4,
.detail5,
.detail6 {
    margin-top: 5%;
    margin-left: 10%;
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

.custom-input {
    width: 558px;
    height: 50px;
    border-radius: 10px;
    border: #bbbbbb solid 1px;
    padding-left: 1%;
    box-sizing: border-box;
}

.custom-input:focus {
    outline: none;
}

.buttoncontainer2 {
    margin-top: 10%;
    margin-left: 50%;
    display: flex;
}

.cancel {
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

.save {
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

.select {
    width: 558px;
    height: 50px;
    border-radius: 10px;
    border: #bbbbbb solid 1px;
    padding-left: 1%;
    font-size: 22px;
    margin-top: 2%;
}

.select:focus {
    outline: none;
}
</style>