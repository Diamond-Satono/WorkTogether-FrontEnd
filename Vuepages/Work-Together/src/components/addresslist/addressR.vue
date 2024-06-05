<template>
  <div class="modal">
    <div id="member-details" v-if="member">
      <div id="icon-container">
        <img :src="member.avatar || '@/assets/img/icon.png'" alt="" class="member-avatar">
      </div>     
      <div id="mem-name">{{ member.name }}</div>
      <div id="mem-address"><fa id="fa-address" icon="location-dot"></fa> {{ member.address }}</div>
      <div id="info1">
        <span id="mem-phone"><img src='@/assets/img/phone.png' alt="avatar" class="member-icon"> {{ member.phone }}</span>
        <span id="mem-email"><img src='@/assets/img/email.png' alt="avatar" class="member-icon"> {{ member.email }}</span>
        <button id="edit-info" v-if="isMyself" @click="$emit('edit-info')">编辑信息</button>
      </div>
      <div id="bottom-line"></div> <!-- 下方的线 -->
      <div id="info2">
        <div id="mem-intro"><fa id="fa-intro" icon="hand"></fa>{{ member.introduction }}</div>
        <div id="mem-details">
          <div id="detail-title"><fa class="fa-yellow" icon="circle-info"></fa> 详细信息</div>
          <div class="de-line">
            <div class="detail-left">联系电话</div>
            <div class="detail-right">{{ member.phone }}</div>
          </div>
          <div class="de-line">
            <div class="detail-left">邮箱</div>
            <div class="detail-right">{{ member.email }}</div>
          </div>
          <div class="de-line">
            <div class="detail-left">部门</div>
            <div class="detail-right">{{ member.deptName }}</div>
          </div>
          <div class="de-line">
            <div class="detail-left">职位</div>
            <div class="detail-right">{{ member.job }}</div>
          </div>
          <div class="de-line">
            <div class="detail-left">工作地址</div>
            <div class="detail-right">{{ member.address }}</div>
          </div>
        </div>
      </div>
    
      <!-- <div id="bottom-line2"></div> -->
      <div id="calendar-container">
        <todayschedule :memberId="memberId"/>
      </div>

    </div>
    <div v-else>
      <p>请选择一个成员</p>
    </div>
  </div>
</template>

<script>
import { UserInfo } from '@/store/userinfo';
const userInfo = UserInfo();
import { Authorization } from "@/store/token";
const token = Authorization();
import todayschedule from '@/components/addresslist/todayschedule.vue'

export default {
  name: 'addressR',
  props: {
    memberId: {
      type: Number,
      required: true,
    },
    isMyself: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      member: {},
    };
  },
  watch: {
    memberId(newId) {
      this.fetchMemberDetails(newId);
    },
  },
  methods: {
    fetchMemberDetails(id) {
      const baseUrl = 'http://localhost:8080/api/group/memberInfo';
      const url = new URL(baseUrl);
      const queryParams = {
        memberId: id,
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
        this.member = data.data; // 假设返回的数据中成员信息在 data.data 中
        console.log(data);
        console.log(this.isMyself);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    },
  },
  created() {
    console.log('当前用户id： '+this.memberId);
    if (this.memberId) {
      this.fetchMemberDetails(this.memberId);
    }
  },
  components: {
    todayschedule
  }
};
</script>

<style scoped>
.modal{
  background-color: #f5f5f5;
  width: 100%;
  height: 100vh;
  overflow-y: auto; /* 允许内容溢出时垂直滚动 */
  overflow-x: hidden;
}
#icon-container{
  display: flex;
  width: 160px;
  height: 160px;
  background-color: #dfdddd;
  border-radius: 50%;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  position: relative;
  top:-120px;
  left:90px; 
  
}
.member-avatar{
  width: 160px;
  height: 160px;
  border-radius: 50%;
  /* position: relative;
  top:-115px;
  left:90px; */
}
#member-details{
  position: relative;
  top: 160px;
  background-color: #fff;
  height: 120%;
}
#mem-name{
  /* border: 1px solid black; */
  width: auto;
  position: relative;
  top:-250px;
  left:280px;
  font-size: 30px;;
  font-weight: 550;
}
#mem-address{
  /* border: 1px solid black; */
  width: auto;
  position: absolute;
  top:-35px;
  left:290px;
  font-size: 16px;;
  font-weight: 500;
  color: #8E8E93;
  display: flex;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
}
#info1{
  /* border: 1px solid black; */
  display: flex;
  position: relative;
  width: 75%;
  height: 40px;
  top:-180px;
  left:300px;
  font-size: 20px;;
  
}
.member-icon{
  position: relative;
  top: -3px;
  width: 30px;
  height: 30px;
  margin-right: 8px;
}
#mem-phone{
  /* border: 1px solid black; */
  display: flex;
  margin-left: 70px;
  position: relative;
  font-size: 20px;
  justify-content: center; /* 垂直居中 */
}
#mem-email{
  /* border: 1px solid black; */
  display: flex;
  position: relative;
  margin-left: 70px;
  font-size: 20px;
  justify-content: center; /* 垂直居中 */
}
#edit-info{
  position: relative;
  top: -5px;
  margin-left: auto;
  margin-right: 50px;
  width: 128px;
  height: 38px;
  font-size: 18px;
  background-color: #0A69D2;
  border-radius: 10px;
  border: none;
  color: #fff;
}
#edit-info:hover{
  cursor: pointer;
  background-color: #0a74ec;
}
#bottom-line {
  border-bottom: 1px solid #dbd9d9;
  /* 画出下方的实线 */
  position: relative;
  top: -175px;
  left: 20px;
  height: 0px;
  width: 97%;
  /* 设置线的宽度为，与页面宽度相符 */
}
#info2{
  position: relative;
  display: flex;
  top: -140px;
  height: auto;
  /* border: 1px solid black; */
  align-items: flex-start;
}
#mem-intro{
  position:relative;
  top:0px;
  left:3%;
  width: 50%;
  min-height: 100px;
  font-size: 18px;
  font-weight: 500;
  background-color: #ffe1d6;
  padding: 30px 30px;
  border-radius: 10px;
}
#mem-details{
  position: relative;
  top:0px;
  margin-left: 80px;
  width:35%;
  height: 330px;
  font-size: 18px;;
  font-weight: 500;
  background-color: #e1f3fc;
  padding: 10px;
  border-radius: 10px;
}
#detail-title{
  font-size: 18px;
  margin-bottom: 20px;
  margin-left: 10px;
}
.de-line{
  display: flex;
  margin:10px 0px 20px 0px;
}
.detail-left{
  position:relative;
  /* border: 1px solid black; */
  left: 50px;
  width: 100px;
  color: #918a8a;
}
.detail-right{
  position: relative;
  /* border: 1px solid black; */
  left: 90px;
  width: 60%;
  height: 30px;
}

#calendar-container{
  position: relative;
  top: -120px;
  /* border: 1px solid black; */
  height: auto;
  background-color: #fff;
  align-items: flex-start;
}
  .fa-yellow{
    color: #FFCB01;
  }
  #fa-intro{
    color: #FFCB01;
    position: relative;
    display: block;
    left: -10px;
    top:-10px;
    width: 20px;
    height: 20px;
  }
  #fa-address{
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }


</style>
