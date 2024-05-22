<template>
  <div>
    <!-- 遮罩层 -->
    <div v-if="showPopup" class="overlay" @click="hidePopup"></div>

    <!-- 弹窗 -->
    <div v-if="showPopup" class="popup">
      <h2>新建日程</h2>
      <form @submit.prevent="saveSchedule">
        <div class="form-group">
          <label for="title">标题<span class="required">*</span></label>
          <input type="text" id="title" v-model="title" placeholder="请输入日程标题" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="start-time">开始时间<span class="required">*</span></label>
            <div class="datetime-input">
              <input type="text" id="start-time" v-model="startDateTime" placeholder="请选择开始时间" @blur="validateAndFormatDateTime('start')" />
              <span class="icon-calendar" @click="toggleCalendar('start')"></span>
              <div v-if="calendarVisible.start" class="calendar-popup">
                <calendar
                  :showPrepNext="true"
                  :startYearMonth="startYearMonth"
                  :markDate="markDate"
                  :checkedDate="startDate"
                  @clickDate="setStartDate"
                  @changeMonth="changeMonth"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="end-time">结束时间<span class="required">*</span></label>
            <div class="datetime-input">
              <input type="text" id="end-time" v-model="endDateTime" placeholder="请选择结束时间" @blur="validateAndFormatDateTime('end')" />
              <span class="icon-calendar" @click="toggleCalendar('end')"></span>
              <div v-if="calendarVisible.end" class="calendar-popup">
                <calendar
                  :showPrepNext="true"
                  :startYearMonth="startYearMonth"
                  :markDate="markDate"
                  :checkedDate="endDate"
                  @clickDate="setEndDate"
                  @changeMonth="changeMonth"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="calendar">日历<span class="required">*</span></label>
          <select id="calendar" v-model="calendarType">
            <option value="1">面试</option>
            <option value="0">会议</option>
            <option value="3">培训</option>
            <option value="2">出差</option>
            <option value="5">个人日程</option>
            <option value="4">其他</option>
          </select>
        </div>

        <div class="form-group">
          <label>参与人<span class="required">*</span></label>
          <div class="participants">
            <div v-for="(participant, index) in participants" :key="participant.id" class="participant-wrapper">
              <img :src="participant.avatar" :alt="participant.name" class="participant-avatar" />
              <div class="participant-actions" @click="removeParticipant(index)">删除</div>
            </div>
            <button id="add-participant" type="button" @click="addParticipant">+</button>
          </div>
          <!-- 成员菜单 -->
          <div v-if="showMemberMenu" class="member-menu">
            <input type="text" v-model="searchQuery" placeholder="搜索成员" />
            <ul>
              <li v-for="member in filteredMembers" :key="member.id" @click="selectMember(member)">
                {{ member.name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="form-group">
          <label for="description">描述</label>
          <textarea id="description" v-model="description" placeholder="请输入活动描述"></textarea>
        </div>

        <div class="form-actions">
          <button id="cancel-button" type="button" @click="cancel">取消</button>
          <button id="submit-button" type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import calendar from './calendarmini.vue';
import { UserInfo } from '@/store/userinfo';
const userInfo = UserInfo();
// 访问存储的 companyId 和 groupId
console.log("companyId:", userInfo.value.companyId);
console.log("GroupId:", userInfo.value.groupId);

import { Authorization } from "@/store/token";
const token = Authorization();

export default {
  components: {
    calendar
  },
  data() {
    return {
      showPopup: true,
      title: '',
      startDateTime: '', // 用于显示完整的开始时间
      endDateTime: '', // 用于显示完整的结束时间
      calendarType: '0', // 绑定下拉菜单选项的值
      participants: [
        // 初始参与者数据
      ],
      description: '',
      startYearMonth: '', // 用于日历的初始年月
      markDate: [],
      startDate: '',
      endDate: '',
      calendarVisible: {
        start: false,
        end: false
      },
      showMemberMenu: false, // 控制成员菜单显示
      members: [], // 存储从后端获取的团队成员
      searchQuery: '' // 搜索关键字
    };
  },
  created() {
    const now = new Date();
    this.startDateTime = this.formatDate(now);
    this.endDateTime = this.formatDate(new Date(now.getTime() + 60 * 60 * 1000)); // 默认结束时间为开始时间后1小时

    // 设置 startYearMonth 为当前年月
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    this.startYearMonth = `${year}-${month}`;

    this.viewMember(); // 获取团队成员
  },
  computed: {
    filteredMembers() {
      const regex = new RegExp(this.searchQuery.split('').join('.*'), 'i');
      return this.members.filter(member => regex.test(member.name));
    }
  },
  methods: {
    saveSchedule() {
      const scheduleData = {
        groupId: userInfo.value.groupId,
        userIds: this.participants.map(participant => participant.id),
        title: this.title,
        startTime: this.startDateTime,
        endTime: this.endDateTime,
        type: this.calendarType, // 使用绑定的 calendarType 作为 type
        description: this.description
      };

      fetch('http://localhost:8080/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token.value
        },
        body: JSON.stringify(scheduleData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('日程创建成功', data);
        this.showPopup = false;
        // 这里可以添加成功后的处理逻辑，比如刷新列表或者显示成功提示
      })
      .catch(error => {
        console.error('创建日程时发生错误:', error);
        // 这里可以添加错误处理逻辑，比如显示错误提示
      });
    },
    cancel() {
      this.showPopup = false;
    },
    addParticipant() {
      this.showMemberMenu = !this.showMemberMenu; // 显示或隐藏成员菜单
    },
    selectMember(member) {
      this.participants.push(member);
      this.showMemberMenu = false;
    },
    removeParticipant(index) {
      this.participants.splice(index, 1);
    },
    toggleCalendar(type) {
      this.calendarVisible[type] = !this.calendarVisible[type];
    },
    setStartDate(date) {
      this.startDate = this.formatDate(date);
      const timePart = this.startDateTime.split(' ')[1] || '00:00';
      this.startDateTime = `${this.startDate}`;
      this.calendarVisible.start = false;
    },
    setEndDate(date) {
      this.endDate = this.formatDate(date);
      const timePart = this.endDateTime.split(' ')[1] || '00:00';
      this.endDateTime = `${this.endDate}`;
      this.calendarVisible.end = false;
    },
    // 保证月份和日期为两位字符的格式化方法
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    validateAndFormatDateTime(type) {
      if (type === 'start' && this.startDateTime) {
        if (!this.isValidDateTime(this.startDateTime)) {
          alert('输入格式错误，请重新输入。');
          return;
        }
        this.startDateTime = this.formatDate(this.startDateTime);
      }
      if (type === 'end' && this.endDateTime) {
        if (!this.isValidDateTime(this.endDateTime)) {
          alert('输入格式错误，请重新输入。');
          return;
        }
        // 检查结束时间是否晚于开始时间
        if (new Date(this.endDateTime) <= new Date(this.startDateTime)) {
          alert('结束时间必须晚于开始时间，请重新输入。');
          this.endDateTime = '';
          return;
        }
        this.endDateTime = this.formatDate(this.endDateTime);
      }
    },
    isValidDateTime(dateTime) {
      const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
      return regex.test(dateTime);
    },
    formatDate(dateTime) {
      const date = new Date(dateTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    clickDate(date) {
      console.log(date);
    },
    changeMonth(date) {
      console.log(date);
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
    }
  }
};
</script>


<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 40%;
  height: 75%;
}

.form-group {
  margin-bottom: 15px;
  padding: 0px 30px 0px 10px;
}

.form-row {
  display: flex;
  justify-content: space-between;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.datetime-input {
  position: relative;
}

.datetime-input input {
  width: 300px; /* 将输入框宽度设为100% */
  padding: 8px;
  box-sizing: border-box;
}

.icon-calendar {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-image: url('@/assets/img/calendar_icon.png'); /* 请替换为你的日历图标路径 */
  background-size: contain;
  background-repeat: no-repeat;
}

.calendar-popup {
  position: absolute;
  top: 50px; /* 根据需要调整位置 */
  left: 0;
  z-index: 2000;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 300px; /* 设置日历宽度 */
}

.participants {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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

.participant-actions {
  display: none;
  position: absolute;
  top: 30px;
  right: -10px;
  background: #ccc;
  color: white;
  padding: 2px 5px;
  border-radius: 5px;
  cursor: pointer;
}

.participant-wrapper:hover .participant-actions {
  display: block;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.form-actions button {
  margin-left: 10px;
}

/* 设置描述部分输入框的固定高度并禁止拖拽 */
textarea#description {
  height: 150px; /* 设置为你需要的固定高度 */
  resize: none; /* 禁止拖拽 */
}

#cancel-button {
  position: relative;
  top: 20px;
  width: 80px;
  height: 35px;
  background-color: #fff;
  border-color: #ff7f50;
  border: 1px solid #ff7f50;
  border-radius: 4px;
  color: #333;
  cursor: pointer;
  font-size: 15px;
  margin-right: 40px;
  font-weight: 500;
}
#submit-button {
  position: relative;
  top: 20px;
  width: 80px;
  height: 35px;
  background-color: #ff7f50;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  margin-right: 50px;
  font-weight: 500;
}
/* 红色星号样式 */
.required {
  color: red;
  margin-left: 5px;
}

#add-participant {
  border-radius: 15px;
  border: none;
  background-color: #ff7f50;
  color: #fff;
  cursor: pointer;
  font-size: 100%;
  font-weight: 800;
  width: 30px;
  height: 30px;
  margin-left: 10px;
}
#add-participant:hover {
  background-color: #ff5f33;
}

/* 成员菜单样式 */
.member-menu {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  width: 200px;
  z-index: 1000;
}

.member-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.member-menu li {
  padding: 10px;
  cursor: pointer;
}

.member-menu li:hover {
  background-color: #f0f0f0;
}
</style>
