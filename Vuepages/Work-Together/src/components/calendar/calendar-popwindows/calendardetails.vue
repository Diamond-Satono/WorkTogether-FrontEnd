<template>
  <div>
    <!-- 背景遮罩层 -->
    <div v-if="showPopup" class="overlay" @click="closePopup"></div>

    <!-- 弹窗组件 -->
    <div v-if="showPopup" class="popup" @click.stop>
      <div class="popup-body">
        <!-- 左侧部分 -->
        <div class="left-section">
          <div class="popup-header">
            <span class="menu-type">日历</span>
            <span id="type-span">
              <label id="typetitle" for="type">类型:</label>
              <select v-model="schedule.type">
                <option value="1">面试</option>
                <option value="0">会议</option>
                <option value="3">培训</option>
                <option value="2">出差</option>
                <option value="5">个人日程</option>
                <option value="4">其他</option>
              </select>
            </span>
            <button id="delete-button" @click="showDeleteConfirm()">删除</button>
            <delete-confirm :title="schedule.title" :scheduleId="scheduleId" @closeDialog="closeDialog" v-if="isDialogVisible" />
          </div>

          <!-- 日程名称 -->
          <div class="schedule-type">
            <div id="title">{{ schedule.title }}</div>
            <div class="status-buttons">
              <button
                :class="{ active: currentStatus === '暂定' }"
                @click="updateStatus('暂定')"
              >暂定</button>
              <button
                :class="{ active: currentStatus === '谢绝' }"
                @click="() => { updateStatus('谢绝'); refuseSchedule(); }"
              >谢绝</button>
              <button
                :class="{ active: currentStatus === '接受' }"
                @click="() => { updateStatus('接受'); joinInSchedule(); }"
              >接受</button>
            </div>
          </div>
          <!-- 日程时间 -->
          <div class="schedule-time">
            <div id="left-time">
              <div>
                <span class="time-line1">{{ formattedStartDate }}</span>
                <span class="time-line2">{{ formattedStartTime }}</span>
              </div>
              <div class="time-type">开始时间</div>
            </div>
            <div id="line1">—</div>
            <div id="right-time">
              <div>
                <span class="time-line1">{{ formattedEndDate }}</span>
                <span class="time-line2">{{ formattedEndTime }}</span>
              </div>
                <div class="time-type">结束时间</div>
            </div>
          </div>
          <!-- 组织人 -->
          <div class="organizer">
            <label class="subtitle">组织人:</label>
            <div v-if="organizer">
              <img :src="organizer.avatar" :alt="organizer.name" class="participant-avatar" />
            </div>
          </div>
          <!-- 参与人 -->
          <div class="participants">
            <label class="subtitle">参与人:</label>
            <div v-for="(participant, index) in this.schedule.participants" :key="participant.id" class="participant-wrapper">
              <img :src="participant.avatar" :alt="participant.name" class="participant-avatar" />
            </div>
          </div>
          <!-- 描述 -->
          <div class="description">
            <label class="subtitle">描述:</label>
            <p>{{ schedule.description }}</p>
          </div>
        </div>
        <!-- 右侧部分 -->
        <div class="right-section">
          <div id="right-title">参与详情:</div>
          <div class="right-content">
            <h4>暂定人员</h4>
            <div class="right-member">
              <div v-for="participant in tentativeParticipants" :key="participant.id">
              <img :src="participant.avatar" :alt="participant.name" class="avatar" />
              </div>
            </div>
          </div>
          <div class="right-content">
            <h4>确定参与人员</h4>
            <div class="right-member">
              <div v-for="participant in confirmedParticipants" :key="participant.id">
                <img :src="participant.avatar" :alt="participant.name" class="avatar" />
              </div>
            </div>
          </div>
          <div class="right-content">
            <h4>拒绝参与人员</h4>
            <div class="right-member">
              <div v-for="participant in declinedParticipants" :key="participant.id">
                <img :src="participant.avatar" :alt="participant.name" class="avatar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新的询问弹窗 -->
    <div v-if="isConfirmationVisible" class="suboverlay" @click="closeConfirmationPopup">
      <div class="subpopup" @click.stop>
        <div class="sub-popup-body">
          <div id="sub-text">您的日程与其他日程冲突，确定参加该日程吗？</div>
          <button id="sub-button1" @click="confirmJoinInSchedule">确定</button>
          <button id="sub-button2" @click="cancelJoinInSchedule">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

  
  <script>
      //import calendar from './calendarmini.vue';
      import { UserInfo } from '@/store/userinfo';
      const userInfo = UserInfo();
      // 访问存储的 companyId 和 groupId
      console.log("companyId:", userInfo.value.companyId);
      console.log("GroupId:", userInfo.value.groupId);
      
      import { Authorization } from "@/store/token";
      const token = Authorization();

      import DeleteConfirm from './deleteconfirm.vue';

  export default {
    props: {
      scheduleId: {
        type: String,
        required: true
      }
    }, 
    data() {
      return {
        showPopup: true,
        schedule: {
          title: '迭代四内容确定',
          type: '0',
          startTime: '2024-05-13 11:00', // 修改为不含T的格式
          endTime: '2024-05-13 12:00',   // 修改为不含T的格式
          description: '本次会议旨在讨论迭代四的拟计划完成内容，包括业务功能、页面、数据库以及接口。',
          participants: []
        },
        status0: {
          userId:[]
        },
        status1: {
          userId:[]
        }, 
        status2: {
          userId:[]
        },
        organizer: [],
        currentStatus: '',  // 默认状态为暂定
        members: [], // 存储从后端获取的团队成员
        
        currentDialog:'', // 当前显示的弹窗组件名称
        isDialogVisible: false, // 是否显示弹窗
        isConfirmationVisible: false, // 新的状态变量
      };
    },
    watch: {
      members(newVal) {
        if (newVal.length) {
          this.loadSchedule();
        }
      }
    },
    components:{
      DeleteConfirm,
    },
    created() {
      this.loadSchedule(); // 获取要修改的日程信息
      this.viewMember(); // 获取团队成员
      this.viewStatus0(); //获取参与状态
      this.viewStatus1(); //获取参与状态
      this.viewStatus2(); //获取参与状态
    },
    computed: {
      formattedStartDate() {
        return this.formatDate(this.schedule.startTime);
      },
      formattedStartTime() {
        return this.formatTime(this.schedule.startTime);
      },
      formattedEndDate() {
        return this.formatDate(this.schedule.endTime);
      },
      formattedEndTime() {
        return this.formatTime(this.schedule.endTime);
      },
      tentativeParticipants() {
        return this.getParticipantsByStatus(this.status0.userId);
      },
      confirmedParticipants() {
        return this.getParticipantsByStatus(this.status1.userId);
      },
      declinedParticipants() {
        return this.getParticipantsByStatus(this.status2.userId);
      }
    },
    methods: {
      loadSchedule() {
        const url = `http://localhost:8080/api/schedule/${this.scheduleId}`;
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token.value,
            'companyId': userInfo.value.groupId
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const schedule = data.data;
          this.schedule.title = schedule.title;
          this.schedule.startTime = schedule.startTime;
          this.schedule.endTime = schedule.endTime;
          this.schedule.type = schedule.type.toString();
          this.schedule.description = schedule.description;
          //this.schedule.organizer = schedule.creatorId;
          this.organizer = this.members.find(member => member.id === schedule.creatorId);
          this.schedule.participants = schedule.userIds.map(userId => {
            return this.members.find(member => member.id === userId);
          }).filter(participant => participant);
          console.log(this.schedule);
          //console.log(data.data);
        })
        .catch(error => {
          console.error('获取日程时发生错误:', error);
        });
      },
      updateStatus(status) {
        this.currentStatus = status;
      },
      formatDate(dateTime) {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const date = new Date(dateTime.replace(' ', 'T')); // 将 ' ' 替换为 'T'，以便 Date 对象正确解析
        const dayOfWeek = days[date.getDay()];
        return `${date.getMonth() + 1}月${date.getDate()}日 ${dayOfWeek}`;
      },
      formatTime(dateTime) {
        const date = new Date(dateTime.replace(' ', 'T'));
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      },
      viewMember() {
        const url = `http://localhost:8080/api/group/member/${userInfo.value.groupId}`;
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token.value,
            'companyId': userInfo.value.groupId
          }
        })
        .then(response => {
          if (!response.ok) {
            alert("拉取失败");
            throw new Error('Network error');
          }
          return response.json();
        })
        .then(data => {
          this.members = data.data;
          console.log(this.members);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
      },
      viewStatus0(){
        const url = `http://localhost:8080/api/schedule/member/${this.scheduleId}/0`;
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token.value,
            'companyId': userInfo.value.groupId
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const status = data.data;
          
          this.status0.userId = status.map(item => item.userId);
          console.log(this.status0.userId);
          console.log('获取状态id0');
        })
        .catch(error => {
          console.error('获取状态时发生错误:', error);
        });
      },
      viewStatus1(){
        const url = `http://localhost:8080/api/schedule/member/${this.scheduleId}/1`;
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token.value,
            'companyId': userInfo.value.groupId
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const status = data.data;
          
          this.status1.userId = status.map(item => item.userId);
          console.log(this.status1.userId);
          console.log('获取状态id1');
        })
        .catch(error => {
          console.error('获取状态时发生错误:', error);
        });
      },
      viewStatus2(){
        const url = `http://localhost:8080/api/schedule/member/${this.scheduleId}/2`;
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token.value,
            'companyId': userInfo.value.groupId
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const status = data.data;
          
          this.status2.userId = status.map(item => item.userId);
          console.log(this.status2.userId);
          console.log('获取状态id2');
        })
        .catch(error => {
          console.error('获取状态时发生错误:', error);
        });
      },
      getParticipantsByStatus(userIds) {
        return userIds.map(userId => this.members.find(member => member.id === userId)).filter(participant => participant);
      },
      joinInSchedule(){
        const url = `http://localhost:8080/api/schedule/join/${this.scheduleId}/0`;
        fetch(url,{
          method: 'PUT',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': token.value,
            'companyId': userInfo.value.groupId
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.code === 20031) {
            alert('已接受日程');
          } else if (data.code === 20030) {
            this.isConfirmationVisible = true;
          }
          console.log(data);
        })
        .catch(error => {
          console.error('获取状态时发生错误:', error);
        });
      },
      showDeleteConfirm() {
        this.currentDialog = 'DeleteConfirm';
        this.isDialogVisible = true;
      },
      // 关闭弹窗
      closeDialog() {
        this.currentDialog = '';
        //this.isDialogVisible = false;
        this.$emit('close-modal');
        this.$emit('refresh-calendar');
      },
      closePopup() {
        //this.showPopup = false;
        this.closeDialog();
        //this.$emit('refresh-calendar')
      },
      cancelJoinInSchedule() {
        this.isConfirmationVisible = false;
      },
      confirmJoinInSchedule() {
        this.isConfirmationVisible = false;
        // 这里添加再次尝试加入日程的逻辑
        this.joinInSchedule2();
      },
      joinInSchedule2(){
        const url = `http://localhost:8080/api/schedule/join/${this.scheduleId}/1`;
        fetch(url,{
          method: 'PUT',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': token.value,
            'companyId': userInfo.value.groupId
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          alert('已接受日程');
          console.log(data);
        })
        .catch(error => {
          console.error('获取状态时发生错误:', error);
        });
      },
      refuseSchedule(){
        const url = `http://localhost:8080/api/schedule/refuseOrTentative`;
        const refuseData={
          scheduleId: this.scheduleId,
          joinStatus: 2,
          refuseReason:'申请调整活动事件'
        }
        fetch(url,{
          method: 'PUT',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': token.value,
            'companyId': userInfo.value.groupId
          },
          body: JSON.stringify(refuseData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          alert('已拒绝日程');
          console.log(data);
        })
        .catch(error => {
          console.error('获取状态时发生错误:', error);
        });
      }



    }
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
  
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 999;
    padding: 20px;
    width: 70%;
    height: 80%;
  }
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    height: 60px;
  }
  
  .menu-type {
    font-weight: bold;
    font-size: 20px;
  }
  
  .popup-body {
    display: flex;
    justify-content: space-between;
  }
  
  .left-section {
    width: 65%;
  }
  
  .right-section {
    width: 35%;
  }
  
  .schedule-type,
  .organizer,
  .participants,
  .description {
    margin: 25px 60px;
  }
  .participants{
    display: flex;
  }
  
  
  .schedule-time {
    display: flex;
    margin: 15px 100px;
    position: relative;
    top:-10px;
  }
  
  .schedule-time div {
    display: flex;
    flex-direction: column; /* 将日期和时间分成两行 */
    margin-right: 10px;
  }
  
  .participant {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
  
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .status-buttons {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
  }
  
  .status-buttons button {
    position: relative;
    top: -50px;
    left: 60%;
    width: 80px;
    height: 30px;
    border: none;
    border-radius: 4px;
    margin: 0 10px;
  }
  
  .status-buttons button.active {
    background-color: #ff7f50;
    color: white;
  }
  
  .participation-details {
    margin-top: 20px;
  }
  
  .participation-details h5 {
    margin-top: 10px;
    margin-bottom: 5px;
  }
  
  .participation-details div {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  #title {
    position: relative;
    left: -20px;
    top: 15px;
    font-size: 35px;
  }
  
  .subtitle {
    font-size: 20px;
    color: #5f5e5e;
  }
  
  #type-span {
    position: relative;
    right: 14%;
  }
  
  #typetitle {
    margin-right: 15px;
    font-size: 20px;
  }
  
  #right-title {
    margin-left: 30px;
    margin-top: 30px;
    font-size: 20px;
  }
  
  .right-content {
    margin-top: 15px;
    margin-left: 65px;
  }

  #left-time{
    font-size: 15px;
  }
  #right-time{
    font-size: 15px;
  }
  #line1{
    position: relative;
    top:35px;
    font-size: 25px;
    color: #ff7f50;
    font-weight: 1000;
    margin-left: 25px;
    margin-right: 30px;
  }

  .time-line1{
    position: relative;
    left: 10px;
    color: #ff7f50;
    font-weight: 600;
  }
  .time-line2{
    color: #ff7f50;
    font-weight: 500;
    font-size: 50px;
  }
  .time-type{
    position: relative;
    left: 20px;
    width: 90px;
    background-color: #eee;
    text-align: center;
    padding: 5px 0px;
    border-radius: 5px;
    margin-top: 5px;
  }

  .participant-wrapper {
    position: relative;
  }
  
  .participant-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 5px;
  }
  .right-member{
    display: flex;
  }
  #delete-button{
    width: 75px;
    height: 30px;
    background-color: rgb(255, 32, 32);
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 15px;
    position: relative;
    right: 9%;
  }
  .subpopup{
    position: relative;
    z-index: 1000;
    left: 46%;
    top: 28%;
    width: 12%;
    height: 16%;
    background-color: #fff;
    border: 1px solid black;
    overflow: auto;
    border-radius: 5px;
  }
  .suboverlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
  #sub-text{
    position: relative;
    padding: 30px;
    padding-top: 20px;
    font-size: 15px;
    font-weight: 600;

  }
  #sub-button1{
    position: relative;
    top: 0px;
    width: 80px;
    height: 30px;
    background-color: #ff7f50;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 15px;
    margin-left: 15px;
  }
  #sub-button2{
    position: relative;
    top: 0px;
    width: 80px;
    height: 30px;
    /* background-color: #ec4116; */
    border: none;
    border-radius: 4px;
    color: black;
    font-size: 15px;
    margin-left: 30px;
  }
  
  </style>
  