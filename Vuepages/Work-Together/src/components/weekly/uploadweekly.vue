<template>
  <div class="w-container">
    <!-- 左半部分 -->
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
      <div class="weekly-form">
          <div class="weekly-container" id="w-container1">
            <div class="title-weekly">
              1. 本周你完成了哪些工作？最有成就感的是什么?
            </div>
            <textarea class="weekly-text" id="area1"></textarea>
          </div>
          <div class="weekly-container" id="w-container2">
            <div class="title-weekly">
              2. 下周你计划做什么？要完成什么目标？
            </div>
            <textarea class="weekly-text" id="area2"></textarea>
          </div>
          <div class="weekly-container" id="w-container3">
            <div class="title-weekly">
              3. 本周工作你遇到的困难是什么？希望得到哪些帮助？
            </div>
            <textarea class="weekly-text" id="area3"></textarea>
          </div>
          <div class="weekly-container" id="w-container4">
            <div class="title-weekly">
              4. 本周工作中，有什么想要与团队分享的？
            </div>
            <textarea class="weekly-text" id="area4"></textarea>
          </div>
      </div>
    </div>
    <!-- 右半部分 -->
    <div id="right-part">
      <div id="pic-container">
        <img id="pic-week" src="@/assets/img/pic_weekly.png" alt="">
      </div>
      
      <div id="reviewer-select">
        <div id="reviewer-topbar">
          <div id="re-icon-pic">
            <img id="reviewer-icon" src="@/assets/img/icon.png" alt="">
          </div>
          <div id="re-topbar-t1">去选一个评审人吧</div>
          <div id="re-topbar-t2">与团队成员互相督促，共同进步</div>
        </div>

        <!-- up -->
        <div class="member-menu">
          <input id="search-bar" type="text" v-model="searchQuery" placeholder="搜索成员" />
          <!-- <h3>我自己</h3> -->
          
          <div v-for="(members, letter) in filteredGroupedMembers" :key="letter">
            <h3>{{ letter }}</h3>
            <ul>
              <li v-for="member in members" :key="member.id" @click="selectMember(member.id)">
                <img :src="member.avatar || '@/assets/img/icon.png'" alt=" " class="member-avatar">
                <div class="member-info">
                  <span class="member-name">{{ member.name }}</span>
                  <span class="member-job">{{ member.job }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- down -->
        <div id="submit-zone">
          <button id="submit-weekly">提交</button>
        </div>


      </div>

    </div>
  </div>
  
</template>

<script>
import { UserInfo } from '@/store/userinfo';
const userInfo = UserInfo();

import { Authorization } from "@/store/token";
const token = Authorization();

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
        endDate: this.getEndOfWeek(new Date()),
        searchQuery: '',
        originalMembers: {},
        myMemberId: null, // 添加存储当前用户ID的变量
        reviewerIconNow: '',
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
      },
      filteredGroupedMembers() {
        const grouped = {};
        Object.keys(this.originalMembers).forEach(letter => {
          if (letter !== 'myself') {
            const members = this.originalMembers[letter].filter(member =>
              member.name.includes(this.searchQuery)
            );
            if (members.length > 0) {
              grouped[letter] = members;
            }
          }
        });
        return grouped;
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
      },
      fetchMembers() {
        const baseUrl = 'http://localhost:8080/api/group/members';
        const url = new URL(baseUrl);
        const queryParams = {
          groupId: userInfo.value.groupId
        };
        Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token.value,
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.originalMembers = data.data;
          console.log(this.originalMembers);
          console.log('groupId is:'+userInfo.value.groupId);
          const memberId = data.data.myself[0].id;
          this.myMemberId = memberId; // 存储当前用户的 ID
          console.log('memberId is:'+memberId);
          this.selectMember(memberId); // 默认选中myself用户
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
      },
      selectMember(memberId) {
        //点击成员之后的逻辑
        const isMyself = memberId === this.myMemberId;
        //this.$emit('member-selected', { memberId, isMyself });
        console.log(this.weeklyId)
      },
    },
    created() {
      this.fetchMembers();
    },
  
};
</script>

<style>
.w-container{
  display: flex;
  width: 100%;
  height: 100vh;
}
#left-part{
  width: 70%;
  height: 100vh;
  background-color: #fff;
  border-left: 1px solid #000000;
}
#right-part{
  width: 30%;
  height: 100%;
  background-color: #f0f0f0;
  /* border: 1px solid #000000; */
  box-shadow: -0px 2px 10px 1px rgba(117, 117, 202, 0.288); /* 阴影效果 */
  z-index: 5;
}
#left-part-top{
  width: 100%;
  height: 120px;
  background-color: #fff;
  /* border: 1px solid #000000; */
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

.weekly-form{
  /* border: 1px solid #000000; */
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  width:100%;
  height: 720px;
  overflow-y: scroll;
}
.weekly-form::-webkit-scrollbar {
      display: none; /* Webkit浏览器（Chrome、Safari等） */
    }
.weekly-form {
  -ms-overflow-style: none;  /* IE和Edge */
  scrollbar-width: none; /* Firefox */
}

.weekly-container{
  position: relative;
  left:5%;
  width:90%;
  height: 350px;
  /* border: 1px solid #000000; */
  border-radius: 15px;
  margin-bottom: 45px;
  overflow-y: hidden;
  background-color: #F8F8FB;
}
#w-container1{
  margin-top: 5px;
}
.title-weekly{
  /* border: 1px solid black; */
  padding: 8px 35px;
  font-size: 20px;
  font-weight: bold;
  background-color: #dcdcf8bb;

}
.weekly-text{
  position:relative;
  left: 1%;
  top: 4px;
  width: 95%;
  height: 81%;
  resize: none;
  border: none;
  background-color: #F8F8FB;
  font-size: 20px;
  padding: 5px 15px;
  /* overflow-y: scroll; */
}
/* 默认隐藏滚动条 */
.weekly-text::-webkit-scrollbar {
  width: 0px;
}
.weekly-text {
  scrollbar-width: none; /* Firefox */
}
/* 悬停时显示滚动条 */
.weekly-text:hover::-webkit-scrollbar {
  width: 8px;
}
.weekly-text:hover {
  scrollbar-width: thin; /* Firefox */
}

#pic-container{
  width: 100%;
  height: 300px;
  background-color: #fff;
}
#pic-week{
  width: 100%;
  height: 300px;
}
#reviewer-select{
  position: relative;
  width: 100%;
  height: calc(100% - 300px);
  background-color: #fff;
  box-shadow:35px -4px 50px 5px rgba(102, 102, 212, 0.404); /* 阴影效果 */
  
}
#reviewer-topbar{
  /* border: 1px solid black; */
  height: 80px;
}
#re-topbar-t1{
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding-bottom: 5px;
  padding-top: 10px;
}
#re-topbar-t2{
  font-size: 14px;
  color: rgb(167, 167, 167);
  text-align: center;
}
#re-icon-pic{
  height: 60px;
  width: 60px;
  position: absolute;
  left: 40px;
  top: 10px;
  border-radius: 50%;
  border: none;
  display: grid;
  place-items: center;
  background-color: #dfdcdc
}

#reviewer-icon{
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
#reviewer-icon:not([src]), #reviewer-icon[src=""] {
  display: none;
}



.member-menu{
  /* border: 1px solid black; */
  max-height: 42vh; /* 设置最大高度为父组件的80% */
  overflow-y: auto; /* 启用垂直滚动 */
}
.member-menu ul {
  list-style: none;
  padding: 0;
}
.member-menu li {
  display: flex;
  align-items: center;
  padding: 15px 0;
  cursor: pointer;
  padding-left: 50px; /* 增加左边距，向右移动 */
}
.member-menu li:hover {
  background-color: #f0f0f0;
}
h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
  padding-left: 10px;
  color: #333;
  font-size: 18px;
}
#search-bar {
  width: 75%;
  height: 30px;
  font-size: 20px;
  margin-left: 25px;
  margin-top: 10px;
  border-radius: 8px;
  padding: 5px 10px;
  background-color: #c7c7cc5d;
  border:none;
}
.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 15px;
  background-color: #f0f0f0;
}
.member-info {
  display: inline-block;
  vertical-align: top;
}
.member-name {
  font-weight: bold;
  display: block;
  font-size: 18px;
}
.member-job {
  color: gray;
  display: block;
  font-size: 15px;
  margin-top: 3px;
}
#submit-zone{
  width: 100%;
  height: auto;
  
}
#submit-weekly{
  margin: 10px 60px;
  width: 135px;
  height: 50px;
  font-size: 25px;
  background-color:#4C69EF;
  color: #fff;
  border: none;
  border-radius: 10px;
}
#submit-weekly:hover{
  cursor: pointer;
  background-color: #2f4ccc;
}

</style>