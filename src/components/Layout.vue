<template>
  <a-layout>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center' }">
      <!-- 显示用户名称和注销按钮 -->
      <div v-if="user.userAccount" :style="{ color: 'white', marginRight: '20px', fontWeight: 'bold' }">
        欢迎，{{ user.userAccount }}
        <a-button type="link" @click="logout" :style="{ color: '#ff4d4f' }">
          注销
        </a-button>
      </div>

      <!-- 登录按钮 -->
      <router-link to="/login">
        <a-button type="primary" v-if="!user.userAccount" :style="{ marginRight: '20px' }">
          登录
        </a-button>
      </router-link>

      <!-- 导航菜单 -->
      <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px', marginLeft: 'auto' }"
      >
        <a-menu-item key="home">
          <router-link to="/">首页</router-link>
        </a-menu-item>
        <a-menu-item key="activities">
          <router-link to="/activities">班级活动</router-link>
        </a-menu-item>
        <a-menu-item key="ClassNotice">
          <router-link to="/classNotice">班级通知</router-link>
        </a-menu-item>
        <a-menu-item key="CourseSchedule">
          <router-link to="/course-schedule">课程表</router-link>
        </a-menu-item>
<!--        <a-menu-item key="GradeManagement">-->
<!--          <router-link to="/grade-management">成绩管理</router-link>-->
<!--        </a-menu-item>-->
        <a-menu-item key="profile">
          <router-link to="/profile">我的</router-link>
        </a-menu-item>
        <a-menu-item key="admin" :style="{ marginLeft: '20px', color: '#ff4d4f', fontWeight: 'bold' }" @click="navigateToAdmin">
          <router-link to="/admin">转到后台管理</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>


    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <div :style="{ background: '#fff', padding: '24px', minHeight: '380px' }">
        <router-view />
      </div>
    </a-layout-content>


    <a-layout-footer :style="{ textAlign: 'center' }">
      山东交通学院 - 2022级 - 顿河信222 - 班级管理系统 - [高力柯、刘淇泉、张鹏宇、李文硕]
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue';
import router from "@/router/index.js";

const user = ref({
  userAccount: localStorage.getItem("userAccount"),
  userRole: localStorage.getItem("userRole")
});

// 监听路由变化，实时更新用户信息
watch(
    () => router.currentRoute.value,
    () => {
      user.value.userAccount = localStorage.getItem("userAccount");
      user.value.userRole = localStorage.getItem("userRole");
    }
);

const selectedKeys = ref(['home']);
watch(
    () => selectedKeys.value,
    (newKey) => {
      if (newKey === 'admin') {
        router.push('/admin');
      }
    }
);

const logout = () => {
  localStorage.removeItem("userAccount");
  localStorage.removeItem("userRole");
  localStorage.removeItem("studentNum");
  localStorage.removeItem("userId");

  user.value = null; // 清空用户信息
  router.push('/login'); // 跳转到登录页面
};

</script>


<style scoped>
.logo-text {
  font-size: 24px;
  color: white;
  font-weight: bold;
}
</style>
