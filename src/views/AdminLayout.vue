<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div style="padding: 16px; text-align: center;">
        <a-button type="primary" @click="navigateToHome">返回首页</a-button>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="student-info-management" @click="navigateTo('StudentInfoManagement')">
          <user-outlined />
          <span>学生信息管理</span>
        </a-menu-item>
        <a-menu-item key="class-officers" @click="navigateTo('ClassOfficers')">
          <team-outlined />
          <span>班级干部管理</span>
        </a-menu-item>
        <a-menu-item key="class-activities" @click="navigateTo('ClassActivities')">
          <desktop-outlined />
          <span>班级活动管理</span>
        </a-menu-item>
        <a-menu-item key="class-notices" @click="navigateTo('ClassNotices')">
          <bell-outlined />
          <span>班级通知管理</span>
        </a-menu-item>
        <a-menu-item key="course-info" @click="navigateTo('CourseInfoManagement')">
          <bell-outlined />
          <span>课程信息管理</span>
        </a-menu-item>
        <a-menu-item key="course-schedule" @click="navigateTo('CourseScheduleAdmin')">
          <bell-outlined />
          <span>课程表管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">后台管理</a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
<!--          <a-breadcrumb-item>Admin</a-breadcrumb-item>-->
<!--          <a-breadcrumb-item>{{ currentRouteName }}</a-breadcrumb-item>-->
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  UserOutlined,
  TeamOutlined,
  DesktopOutlined,
  BellOutlined,
} from '@ant-design/icons-vue';

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
const router = useRouter();
const currentRouteName = ref<string>(router.currentRoute.value.name || '');

const navigateTo = (key: string) => {
  selectedKeys.value = [key];
  router.push({ name: key });
  currentRouteName.value = key;
};

const navigateToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}
</style>
