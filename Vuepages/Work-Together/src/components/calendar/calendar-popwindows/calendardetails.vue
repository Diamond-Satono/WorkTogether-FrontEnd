<template>
    <div>
      <!-- 背景遮罩层 -->
      <div v-if="showPopup" class="overlay"></div>
  
      <!-- 弹窗组件 -->
      <div v-if="showPopup" class="popup">
        <div class="popup-body">
          <!-- 左侧部分 -->
          <div class="left-section">
            <div class="popup-header">
              <span class="menu-type">日历</span>
              <span id="type-span">
                <label id="typetitle" for="type">类型:</label>
                <select v-model="schedule.type">
                  <option value="0">面试</option>
                  <option value="1">会议</option>
                  <option value="2">培训</option>
                  <option value="3">出差</option>
                  <option value="4">个人日程</option>
                  <option value="5">其他</option>
                </select>
              </span>
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
                  @click="updateStatus('谢绝')"
                >谢绝</button>
                <button
                  :class="{ active: currentStatus === '接受' }"
                  @click="updateStatus('接受')"
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
              <!-- <div>{{ this.schedule.organizer }}</div> -->
              <div v-if="organizer">
                <img :src="organizer.avatar" :alt="organizer.name" class="participant-avatar" />
                <!-- <span>{{ organizer.name }}</span> -->
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
              <div v-for="participant in tentativeParticipants" :key="participant.id">
                <img :src="participant.avatar" alt="Avatar" class="avatar" />
                <span>{{ participant.name }}</span>
              </div>
            </div>
            <div class="right-content">
              <h4>确定参与人员</h4>
              <div v-for="participant in confirmedParticipants" :key="participant.id">
                <img :src="participant.avatar" alt="Avatar" class="avatar" />
                <span>{{ participant.name }}</span>
              </div>
            </div>
            <div class="right-content">
              <h4>拒绝参与人员</h4>
              <div v-for="participant in declinedParticipants" :key="participant.id">
                <img :src="participant.avatar" alt="Avatar" class="avatar" />
                <span>{{ participant.name }}</span>
              </div>
            </div>
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

  export default {

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
        organizer: [],
        currentStatus: '暂定',  // 默认状态为暂定
        members: [], // 存储从后端获取的团队成员
      };
    },
    watch: {
      members(newVal) {
        if (newVal.length) {
          this.loadSchedule();
        }
      }
    },
    created() {
      this.loadSchedule(); // 获取要修改的日程信息
      this.viewMember(); // 获取团队成员
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
        return this.schedule.participants.filter(participant => participant.status === '暂定');
      },
      confirmedParticipants() {
        return this.schedule.participants.filter(participant => participant.status === '接受');
      },
      declinedParticipants() {
        return this.schedule.participants.filter(participant => participant.status === '谢绝');
      }
    },
    methods: {
      loadSchedule() {
        const url = `http://localhost:8080/api/schedule/1793227986862919681`;
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token.value
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
        const url = `http://localhost:8080/api/group/member/2`;
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
      viewStatus1(){
        const url = `http://localhost:8080/api/schedule/member/{id}/{type}`;
      },
      viewStatus2(){
        
      },
      viewStatus3(){
        
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
    z-index: 999;
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
    z-index: 1000;
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
    right: 65%;
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
  
  </style>
  