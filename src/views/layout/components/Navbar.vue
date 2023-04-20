<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <div class="news" @click="goNews">
       <el-popover
       class="popover"
        placement="bottom"
        title="消息"
        width="200"
        trigger="manual"
        v-model="visible"
       >
       <div  @click="goWithdraw" style="padding-top: 10px; padding-bottom: 10px;cursor: pointer;">您有{{total}}条猫豆提现待处理</div>
        </el-popover>
      <svg t="1681911325585" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2695" width="22" height="22"><path d="M985.6 792.96H39.04a38.4 38.4 0 1 1 0-76.8H985.6a38.4 38.4 0 1 1 0 76.8z" fill="#8a8a8a" p-id="2696"></path><path d="M512 76.8c4.48 0 8.96 3.84 8.96 10.88a76.8 76.8 0 0 0 60.16 74.88 320 320 0 0 1 246.4 306.56v245.76H197.12V469.76a320 320 0 0 1 245.76-307.2 79.36 79.36 0 0 0 60.16-77.44A8.96 8.96 0 0 1 512 76.8M512 0a85.76 85.76 0 0 0-85.76 85.76 392.96 392.96 0 0 0-306.56 384v320h784.64v-320a392.96 392.96 0 0 0-306.56-384A85.76 85.76 0 0 0 512 0zM508.8 985.6a139.52 139.52 0 0 1-133.76-100.48H640a139.52 139.52 0 0 1-131.2 100.48z" fill="#8a8a8a" p-id="2697"></path><path d="M576 923.52a100.48 100.48 0 0 1-128 0h128m112.64-76.8H331.52a177.28 177.28 0 0 0 354.56 0z" fill="#8a8a8a" p-id="2698"></path></svg>
      <div v-if="!!newsList.length" class="news-hong"></div>
    </div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <span>{{name}}</span>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { withdrawList } from "@/api/catApi/memberApi";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      visible: false,
      timer: null,
      newsList: [],
      createTime: [
        new Date(new Date().toLocaleDateString()).getTime() -
          31 * 24 * 3600 * 1000,
        new Date(new Date().toLocaleDateString()).getTime(),
      ],
      total: 0
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name'
      // 'avatar'
    ])
  },
  created(){
      this.timer = setInterval(() => {
          this.getWithdrawList();
      }, 5*60*1000);
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    getWithdrawList() {
      let params = {
        begin: this.createTime[0],
        end: this.createTime[1],
        page: 0,
        size: 10,
        memberPhone: '',
        status: 'audit'
      };
      withdrawList(params).then((res) => {
        if (res.code == "200") {
          let { records, total } = res.data;
          this.newsList = records || [];
          this.total = total;
        }
      });
    },
    goNews(){
      this.visible = !this.visible ;
    },
    goWithdraw(){
      this.$router.push(
          { 
            path:'/withdraw/withdrawCatBean'
          }
      );
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 20px;
        font-size: 12px;
      }
    }
  }
  .news{
    position: absolute;
    right:130px;
    top: 10px;
    .news-hong{
      width:8px;
      height:8px;
      border-radius: 8px;
      background-color: red;
      position: absolute;
      top: 6px;
      right:0;
    }
    .popover{
      position: absolute;
      top: 30px;
      right:100px;
    }
  }
  
}
</style>

