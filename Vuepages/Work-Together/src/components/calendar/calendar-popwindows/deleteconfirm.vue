<template>
    <div class="modal">
      <div class="modal-content">
        <div class="popup-header">删除日程</div>
        <div id="content">
            <span class="tip">您确定删除该日程</span>
            <span id="title">{{ localtitle }}</span>
            <span class="tip">吗？</span>
        </div>
        
        <span class="confirm" @click="deleteSchedule()">确定删除</span>
        <span class="close" @click="closeDialog">放弃删除</span>
        <!-- 在这里添加创建企业的内容 -->
      </div>
    </div>
  </template>
  
  <script>
    import { UserInfo } from '@/store/userinfo';
    const userInfo = UserInfo();
    // 访问存储的 companyId 和 groupId
    console.log("companyId:", userInfo.value.companyId);
    console.log("GroupId:", userInfo.value.groupId);
    
    import { Authorization } from "@/store/token";
    const token = Authorization();

  export default {
    name: 'DeleteConfirm',
    props: {
        title: {
            type: String,
            required: true
        },
        scheduleId: {
            type: String,
            required: true
        }
    },
    data(){
        return{
            localtitle:this.title,
            localscheduleId:this.scheduleId,
        };
    },
    created(){
        this.report1();
    },
    methods:{
        report1(){
            console.log(this.localtitle);
        },
        deleteSchedule(){
            const url = `http://localhost:8080/api/schedule/${this.scheduleId}`;
            fetch(url,{
            method: 'DELETE',
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
                console.log(data);
                alert('删除完毕');
                this.closeDialog();
            })
            .catch(error => {
                console.error('获取状态时发生错误:', error);
            });
        },
        closeDialog() {
            //this.$emit('refresh-calendar');
            this.$emit('closeDialog');
        }
    }
  };
  </script>
  
  <style scoped>
  /* 样式可以根据需要进行修改 */
  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    
  }
  
  .modal-content {
    height: 280px;
    background-color: #fefefe;
    margin-top: 10%;
    margin-left: 30%;
    padding: 20px;
    border: 1px solid #888;
    width: 40%;
    border-radius: 5px; /* 设置圆角半径 */
    
  }

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    padding-left: 10px;
    border-bottom: 1px solid #afafaf;
    height: 30px;
    font-size: 20px;
  }

  .modal-name{
    position: absolute;
    text-align: center;
    font-size: 20px;
    font-weight: 800;
  }
  .tip{
    font-size: 20px;
    font-weight: 800;
  }
  .confirm{
    width: 140px;
    height: 35px;
    color: #fff;
    float: right;
    font-size: 20px;
    cursor: pointer;
    background-color:#fb5b1d ;
    border-radius: 5px; /* 设置圆角半径 */
    border: 1px solid #fb5b1d; /* 设置边框 */    
    position: absolute;
    left: 35%;
    top:46%;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  
  .close {
    width: 140px;
    height: 35px;
    float: right;
    font-size: 20px;
    cursor: pointer;
    border-radius: 5px; /* 设置圆角半径 */
    border: 1px solid #fb5b1d; /* 设置边框 */    
    position: absolute;
    left: 58%;
    top:46%;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  #title{
    font-size: 20px;
    font-weight: 800;
    color: #fb5b1d;
    text-decoration: underline;
  }
  #content{
    position: relative;
    left: 20%;
    top: 20%;
  }
  </style>
  