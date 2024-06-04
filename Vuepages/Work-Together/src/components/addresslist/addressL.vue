<template>
  <div class="modal">
    <div id="info-mode">
      <div id="menu-name"><img class="icon-little" src="@/assets/img/address_icon.png" alt="Icon">团队通讯录</div>
    </div>
    <div id="bottom-line"></div>

    <div class="member-menu">
      <input id="search-bar" type="text" v-model="searchQuery" placeholder="搜索成员" />
      <!-- <h3>我自己</h3> -->
      <ul>
        <li v-for="member in filteredMyself" :key="member.id" @click="selectMember(member.id)">
          <img :src="member.avatar || '@/assets/img/default_avatar.png'" alt="avatar" class="member-avatar">
          <div class="member-info">
            <span class="member-name">{{ member.name }}</span>
            <span class="member-job">{{ member.job }}</span>
          </div>
        </li>
      </ul>
      <div v-for="(members, letter) in filteredGroupedMembers" :key="letter">
        <h3>{{ letter }}</h3>
        <ul>
          <li v-for="member in members" :key="member.id" @click="selectMember(member.id)">
            <img :src="member.avatar || '@/assets/img/default_avatar.png'" alt="avatar" class="member-avatar">
            <div class="member-info">
              <span class="member-name">{{ member.name }}</span>
              <span class="member-job">{{ member.job }}</span>
            </div>
          </li>
        </ul>
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
  name: 'addressL',
  data() {
    return {
      searchQuery: '',
      originalMembers: {} // 成员数据保存在这个对象中
    };
  },
  computed: {
    filteredMyself() {
      if (!this.originalMembers.myself) {
        return [];
      }
      return this.originalMembers.myself.filter(member =>
        member.name.includes(this.searchQuery)
      );
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
        const memberId=data.data.myself[0].id;
        console.log('memberId is:'+memberId);
        this.$emit('member-selected', memberId);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    },
    selectMember(memberId) {
      this.$emit('member-selected', memberId);
    },
  },
  created() {
    this.fetchMembers();
  },
};
</script>

<style scoped>
/* 样式可以根据需要进行修改 */
.modal{
  height:100%;
}
#info-mode {
  position: relative;
  top: 0px;
  width: 100%;
  height: 50px;
  background-color: #ffffff;
}
#menu-name {
  position: relative;
  width: 150px;
  height: 35px;
  font-size: 20px;
  font-weight: bold;
  left: 20px;
  top: 10px;
  align-items: center;
  text-align: center;
}
.icon-little {
  position: relative;
  top: 5px;
  left: -5px;
  width: 30px;
  height: 30px;
}
#search-bar {
  width: 75%;
  height: 30px;
  font-size: 20px;
  margin-left: 25px;
  margin-top: 10px;
  border-radius: 8px;
  padding: 5px 10px;
}
.member-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
.member-info {
  display: inline-block;
  vertical-align: top;
}
.member-name {
  font-weight: bold;
  display: block;
}
.member-job {
  color: gray;
  display: block;
}
.member-menu ul {
  list-style: none;
  padding: 0;
}
.member-menu li {
  display: flex;
  align-items: center;
  padding: 10px 0;
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
</style>
