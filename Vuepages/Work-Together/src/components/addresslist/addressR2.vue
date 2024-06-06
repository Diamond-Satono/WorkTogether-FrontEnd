<template>
    <div class="modal">
        <div id="revise1" v-if="member">
            <div class="notice1">
                <span class="title-num">1.</span>
                <span class="title-text">更换头像</span>
            </div>
            <div id="icon-container">
                <img :src="member.avatar || '@/assets/img/icon.png'" alt="avatar" class="member-avatar">
            </div>
            <div id="notice2">选择一张个人正面照片作为头像，企业成员可以更容易认识你</div>
            <button id="edit-icon" @click="triggerFileInput">上传头像</button>
            <div id="notice3">仅支持JPG,GIF,PNG格式上传，大小不超过1M</div>
            <input type="file" id="file-input" @change="handleFileChange" style="display: none" accept="image/jpeg,image/gif,image/png">
            <input type="file" id="file-input" ref="fileInput" @change="handleFileChange" style="display: none" accept="image/jpeg,image/gif,image/png">
            <div id="bottom-line"></div>
        </div>
        <div id="revise2">
            <div class="notice1">
                <span class="title-num">2.</span>
                <span class="title-text">个人资料</span>
            </div>
        </div>
        <div id="info-container">
            <div class="info-line">
                <div class="info-left">姓名</div>
                <!-- <div class="info-right">{{ member.name }}</div> -->
                <input class="info-right" type="text" v-model="member.name">
            </div>
            <div class="info-line">
                <div class="info-left">联系电话</div>
                <input class="info-right" type="text" v-model="member.phone">
            </div>
            <div class="info-line">
                <div class="info-left">工作地址</div>
                <select id="input-right" v-model="member.address">
                    <option value="中国">中国</option>
                    <option value="中国香港">中国香港</option>
                    <option value="美国">美国</option>
                    <option value="加拿大">加拿大</option>
                    <option value="法国">法国</option>
                    <option value="瑞士">瑞士</option>
                    <option value="德国">德国</option>
                </select>
            </div>
            <div class="info-line">
                <div class="info-left">个人介绍</div>
                <textarea id="description" type="text" v-model="member.introduction"></textarea>
            </div>
            <div id="button-container">
                <button id="cancel" class="operation-button" @click="cancelEdit">取消</button>
                <button id="save" class="operation-button" @click="saveEdit">保存</button>
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
    name: 'addressR2',
    props: {
      memberId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        member: {},
        avatarFile: null,  // 新增状态变量来存储文件对象
      };
    },
    /* watch: {
      memberId(newId) {
        this.fetchMemberDetails(newId);
      },
    }, */
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
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
      },
      // 触发文件输入
        triggerFileInput() {
            this.$refs.fileInput.click();
        },

        // 处理文件选择
        handleFileChange(event) {
            /* const file = event.target.files[0];
            if (file) {
            // 创建 FileReader 来读取文件
            const reader = new FileReader();
            reader.onload = (e) => {
                // 更新 avatar 数据
                this.member.avatar = e.target.result;
            };
            reader.readAsDataURL(file);
            } */
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.member.avatar = e.target.result;  // 继续更新 avatar 显示
                };
                reader.readAsDataURL(file);
                this.avatarFile = file;  // 保存原始文件对象到 avatarFile
            }
        },
        // 添加取消按钮的方法
        cancelEdit() {
            this.$emit('cancel-edit');
        },
        // 添加保存按钮的方法
        saveEdit() {
            const baseUrl = 'http://localhost:8080/api/group/update/memberInfo';
            const url = new URL(baseUrl);
            const queryParams = {
                name: this.member.name,
                phone: this.member.phone,
                location: this.member.address,
                introduction: this.member.introduction,
                groupId: userInfo.value.groupId
            };
            // 使用 URLSearchParams 追加查询参数
            Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
            
            let formData = new FormData();
            if (this.avatarFile && this.avatarFile.size > 0) {  // 确保文件有效
                formData.append('image', this.avatarFile);
            }else {
                // 添加一个空的 Blob 对象作为文件字段，并提供一个默认文件名
                formData.append('image', null);
            }

            // 遍历 formData 并打印内容
            formData.forEach((value, key) => {
                console.log(`${key}:`, value);
            });
            console.log('头像文件：'+this.avatarFile);

            fetch(url, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json',
                    'Authorization': token.value,
                    //'companyId': userInfo.companyId.value
                },
                body: formData
            }).then(response => {
                if (response.ok) {
                    console.log('头像文件：'+this.avatarFile);
                    this.$emit('save-edit'); // 通知父组件已保存
                    this.$emit('data-saved'); // 数据保存成功后发射事件
                } else {
                    throw new Error('Failed to save changes');
                }
            }).catch(error => {
                console.error('Save error:', error);
            });
        }

    },
    created() {
      if (this.memberId) {
        this.fetchMemberDetails(this.memberId);
      }
    },
  };
  </script>
  
  <style scoped>
  .modal{
    background-color: #fff;
    width: 100%;
    height: 100%;
  }
  #icon-container{
    display: flex;
    width: 160px;
    height: 160px;
    background-color: rgb(218, 208, 208);
    border-radius: 50%;
    align-items: center; /* 水平居中 */
    justify-content: center; /* 垂直居中 */
    position: relative;
    top:75px;
    left:100px; 
    
  }
  .member-avatar{
    width: 160px;
    height: 160px;
    border-radius: 50%;
    /* position: relative;
    top:-115px;
    left:90px; */
  }
  #revise1{
    /* border: 1px solid black; */
    height: 300px;
  }
  .notice1{
    /* border: 1px solid black; */
    position:relative;
    top: 30px;
    left:60px;
  }
  .title-num{
    color:#0A69D2;
    font-size: 18px;
  }
  .title-text{
    margin-left: 10px;
    font-size: 18px;
  }
  #notice2{
    position: absolute;
    top: 120px;
    left: 350px;
    font-size: 20px;
  }
  #edit-icon{
    position: absolute;
    top: 200px;
    left: 350px;
    width: 128px;
    height: 38px;
    font-size: 18px;
    background-color: #0A69D2;
    border-radius: 10px;
    border: none;
    color: #fff;
  }
  #edit-icon:hover{
    cursor: pointer;
    background-color: #0a74ec;
  }
  #notice3{
    position: absolute;
    top: 205px;
    left: 520px;
    font-size: 20px;
    color: #a09d9d;
  }
  #bottom-line {
    border-bottom: 1px solid #dbd9d9;
    /* 画出下方的实线 */
    position: absolute;
    top: 300px;
    left: 20px;
    height: 0px;
    width: 97%;
    /* 设置线的宽度为，与页面宽度相符 */
  }
  #info-container{
    /* border: 1px solid black; */
    position: relative;
    top: 60px;
    left: 150px;
    width: 900px;
    height: 420px;
  }
  .info-line{
    margin:10px 0px 30px 0px;
  }
  .info-left{
    position:absolute;
    /* border: 1px solid black; */
    left: 30px;
    width: 100px;
    color: #a8a2a2;
    font-size: 18px;
  }
  .info-right{
    position: relative;
    /* border: 1px solid black; */
    left: 180px;
    width: 39%;
    height: 30px;
    border-radius: 5px;
    border: 1px solid gray;
    font-size: 16px;
    padding-left: 10px;
  }
  #input-right{
    position: relative;
    /* border: 1px solid black; */
    left: 180px;
    width: 40%;
    height: 33px;
    border-radius: 5px; 
    font-size: 16px;
    padding-left: 10px;
  }
  #description {
    position: relative;
    /* border: 1px solid black; */
    left: 180px;
    width: 39%;
    height: 150px; /* 设置为你需要的固定高度 */
    resize: none; /* 禁止拖拽 */
    border-radius: 8px;
    padding-left: 10px;
    padding-top: 5px;
    font-size: 15px;
  }
  #description:hover{
    cursor: pointer;
  }
  #description:focus{
    outline: none;
  }
  #description::-webkit-scrollbar {
    width: 5px; /* 设置滚动条的宽度 */
  }

  #button-container{
    position: absolute;
    top: 380px;
    left: 620px;
    width: 300px;
  }
  .operation-button{
    height: 38px;
    width: 120px;
    font-size: 18px;
    background-color: #0A69D2;
    border-radius: 10px;
    border: none;
    color: #fff;
    margin-left: 30px;
  }
  .operation-button:hover{
    cursor: pointer;
    background-color: #0a74ec;
  }
  #cancel{
    background-color: #fff;
    color: black;
    border: 1px solid #0A69D2;
  }
  #cancel:hover{
    background-color: #d3d4d6;
  }


  
  
  
  </style>
  