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
            <select id="calendar" v-model="calendar">
              <option value="test">面试</option>
              <option value="test">会议</option>
              <option value="test">培训</option>
              <option value="test">出差</option>
              <option value="test">个人日程</option>
              <option value="test">其他</option>
              <!-- 可添加更多选项 -->
            </select>
          </div>
  
          <div class="form-group">
            <label>参与人<span class="required">*</span></label>
            <div class="participants">
              <img v-for="participant in participants" :key="participant.id" :src="participant.avatar" :alt="participant.name" class="participant-avatar" />
              <button id="add-participant" type="button" @click="addParticipant">+</button>
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
  import calendar from './calendarmini.vue'
  
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
        calendar: 'test',
        participants: [
          { id: 1, name: 'User 1', avatar: 'user1.jpg' },
          { id: 2, name: 'User 2', avatar: 'user2.jpg' }
        ],
        description: '',
        startYearMonth: '', // 用于日历的初始年月
        markDate: ['2021/1/1', '2021-01-12', '2021-1-18', '2021-01-20'],
        startDate: '',
        endDate: '',
        calendarVisible: {
          start: false,
          end: false
        }
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
    },
    methods: {
      saveSchedule() {
        // 保存日程的逻辑
        console.log('保存日程', {
          title: this.title,
          startDateTime: this.startDateTime,
          endDateTime: this.endDateTime,
          calendar: this.calendar,
          participants: this.participants,
          description: this.description
        });
        this.showPopup = false;
      },
      cancel() {
        this.showPopup = false;
      },
      addParticipant() {
        // 添加参与人的逻辑
        alert('添加参与人功能尚未实现');
      },
      toggleCalendar(type) {
        this.calendarVisible[type] = !this.calendarVisible[type];
      },
      setStartDate(date) {
        this.startDate = date;
        const timePart = this.startDateTime.split(' ')[1] || '00:00';
        this.startDateTime = `${date} ${timePart}`;
        this.calendarVisible.start = false;
      },
      setEndDate(date) {
        this.endDate = date;
        const timePart = this.endDateTime.split(' ')[1] || '00:00';
        this.endDateTime = `${date} ${timePart}`;
        this.calendarVisible.end = false;
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
    padding: 0px 40px 10px 15px;
  }
  
  .form-row {
    display: flex;
    justify-content: space-between;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 10px;
    font-size: 18px;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    font-size: 15px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .datetime-input {
    position: relative;
  }
  
  .datetime-input input {
    width: 350px; /* 将输入框宽度设为100% */
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
  }
  
  .participant-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 5px;
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

  #cancel-button{
    position: relative;
    top: 20px;
    width: 100px;
    height: 40px;
    background-color: #fff;
    border-color: #ff7f50;
    border-style: solid;
    border-radius: 4px;
    color: #333;
    cursor: pointer;
    font-size: 18px;
    margin-right: 40px;
    font-weight: 800;
  }
  #submit-button{
    position: relative;
    top: 20px;
    width: 100px;
    height: 40px;
    background-color: #ff7f50;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 18px;
    margin-right: 50px;
    font-weight: 800;
  }
  /* 红色星号样式 */
    .required {
    color: red;
    margin-left: 5px;
    }

    #add-participant{
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
    #add-participant:hover{
        background-color: #ff5f33;
    }

  </style>
  
  