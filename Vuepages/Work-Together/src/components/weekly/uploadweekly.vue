<template>
  <div class="container">
    <div id="left-part">
      <div id="left-part-top">
        <div id="title-L">
          <img src="@/assets/img/upload_weekly.png" alt=""> 提交周报
        </div>

        <div class="week-switcher">
          <button class="week-change" @click="prevWeek" :disabled="isPrevDisabled">＜</button>
          <div class="week-info">
            <div class="week-title">{{ currentYear }}年第{{ currentWeek }}周</div>
            <div class="week-dates">{{ currentWeekRange }}</div>
          </div>
          <button class="week-change" @click="nextWeek" :disabled="isNextDisabled">＞</button>
        </div>


      </div>
    
    </div>
    <div id="right-part">
      
      
    </div>
  </div>
  
</template>

<script>
export default {
    name: 'uploadweekly',
    props: {
    weeklyId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        currentDate: new Date(),
        startDate: this.getStartOfWeek(new Date()),
        endDate: this.getEndOfWeek(new Date())
      };
    },
    computed: {
      currentYear() {
        return this.startDate.getFullYear();
      },
      currentWeek() {
        const start = new Date(this.startDate.getFullYear(), 0, 1);
        const diff = (this.startDate - start + ((start.getTimezoneOffset() - this.startDate.getTimezoneOffset()) * 60000)) / 86400000;
        return Math.ceil((diff + start.getDay() + 1) / 7);
      },
      currentWeekRange() {
        return `${this.formatDate(this.startDate)} - ${this.formatDate(this.endDate)}`;
      },
      isPrevDisabled() {
        return false; // 可以根据需要添加逻辑
      },
      isNextDisabled() {
        return this.endDate >= new Date();
      }
    },
    methods: {
      getStartOfWeek(date) {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(start.setDate(diff));
      },
      getEndOfWeek(date) {
        const end = new Date(this.getStartOfWeek(date));
        return new Date(end.setDate(end.getDate() + 6));
      },
      formatDate(date) {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      },
      prevWeek() {
        const newStartDate = new Date(this.startDate);
        const newEndDate = new Date(this.endDate);
        newStartDate.setDate(newStartDate.getDate() - 7);
        newEndDate.setDate(newEndDate.getDate() - 7);
        this.startDate = this.getStartOfWeek(newStartDate);
        this.endDate = this.getEndOfWeek(newEndDate);
      },
      nextWeek() {
        if (!this.isNextDisabled) {
          const newStartDate = new Date(this.startDate);
          const newEndDate = new Date(this.endDate);
          newStartDate.setDate(newStartDate.getDate() + 7);
          newEndDate.setDate(newEndDate.getDate() + 7);
          this.startDate = this.getStartOfWeek(newStartDate);
          this.endDate = this.getEndOfWeek(newEndDate);
        }
      }
    }
  
};
</script>

<style>
.container{
  display: flex;
  width: 100%;
  height: 100vh;
}
#left-part{
  width: 70%;
  height: 100vh;
  background-color: #fff;
  border: 1px solid #000000;
}
#right-part{
  width: 30%;
  height: 100%;
  background-color: #f0f0f0;
  border: 1px solid #000000;
}
#left-part-top{
  width: 100%;
  height: 120px;
  background-color: #fff;
  border: 1px solid #000000;
}
#title-L{
  position: relative;
  display: flex;
  font-size: 22px;
  text-align: center;
  align-items: center;
  left: 30px;
  top: 20px;
}
.week-switcher {
  position: relative;
  left: 36%;
  display: flex;
  align-items: center;
}
.week-info {
  text-align: center;
  margin: 0 20px;
}
.week-title {
  font-size: 22px;
}
.week-dates {
  font-size: 16px;
  color: gray;
}
.week-change {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}
.week-change:disabled {
  cursor: not-allowed;
  color: lightgray;
}


</style>