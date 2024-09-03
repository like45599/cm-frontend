<template>
  <div class="home-container">
    <h1>欢迎使用班级管理系统</h1>

    <div class="section">
      <h2>最新班级活动</h2>
      <a-list
          item-layout="horizontal"
          :data-source="recentActivities"
          :loading="loading"
          class="custom-list"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
                :title="item.activityName"
                :description="item.description"
            />
          </a-list-item>
        </template>
      </a-list>
    </div>

    <div class="section">
      <h2>最新班级通知</h2>
      <a-list
          item-layout="horizontal"
          :data-source="recentNotices"
          :loading="loading"
          class="custom-list"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
                :title="item.title"
                :description="item.description"
            />
          </a-list-item>
        </template>
      </a-list>
    </div>

    <!-- 新增部分：今日课程安排 -->
    <div class="section">
      <h2>今日课程安排</h2>
      <a-list
          item-layout="horizontal"
          :data-source="todayCourses"
          :loading="loading"
          class="custom-list"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
                :title="item.courseName"
                :description="`时间段: ${item.timeSlot} | 教师: ${item.teacherName}`"
            />
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { fetchRecentActivities } from '@/api/classActivities';
import { fetchRecentNotices } from '@/api/classNotices';
import { fetchCoursesByDate } from '@/api/courseSchedule';
import dayjs from 'dayjs';

const recentActivities = ref([]);
const recentNotices = ref([]);
const todayCourses = ref([]);
const loading = ref(true);

const fetchData = async () => {
  loading.value = true;
  try {
    const activitiesResponse = await fetchRecentActivities({ current: 1, pageSize: 5 });
    const noticesResponse = await fetchRecentNotices({ current: 1, pageSize: 5 });
    const todayDate = dayjs().format('YYYY-MM-DD');
    const todayDayOfWeek = dayjs().day(); // 获取当天是星期几，0代表周日，1代表周一，依次类推

    const coursesResponse = await fetchCoursesByDate(todayDate);

    // 过滤出 dayOfWeek 匹配今天的课程
    todayCourses.value = coursesResponse.data.data.filter(course => course.dayOfWeek === todayDayOfWeek);

    recentActivities.value = activitiesResponse.data.data.records;
    recentNotices.value = noticesResponse.data.data.records;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f2f5;
  border-radius: 8px;
}

h1 {
  margin-bottom: 24px;
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #1890ff;
}

h2 {
  margin-top: 32px;
  margin-bottom: 16px;
  text-align: center;
  font-size: 24px;
  color: #595959;
}

.section {
  margin-bottom: 40px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.custom-list .ant-list-item {
  border-bottom: 1px solid #f0f0f0;
}

.custom-list .ant-list-item-meta-title {
  font-weight: bold;
  font-size: 18px;
}

.custom-list .ant-list-item-meta-description {
  color: #8c8c8c;
}
</style>
