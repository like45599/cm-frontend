<template>
  <div>
    <a-alert :message="`您选择的日期: ${selectedDate && selectedDate.format('YYYY-MM-DD')}`" />
    <a-calendar
        :value="currentDate"
        @select="onDateSelect"
        @panelChange="onPanelChange"
    >
      <template #dateCellRender="{ current }">
        <div v-if="getCoursesForDay(current).length > 0">
          <a-badge :count="getCoursesForDay(current).length" style="background-color: #52c41a;" />
        </div>
      </template>


    </a-calendar>

    <div v-if="selectedCourses.length > 0" style="margin-top: 20px;">
      <div v-for="(course, index) in selectedCourses" :key="index" style="margin-bottom: 10px;">
        <a-alert
            :message="`${course.courseName} - ${course.teacherName}`"
            :description="`时间段: ${course.timeSlot} | 星期: ${course.dayOfWeek}`"
            type="info"
            show-icon
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { fetchCoursesByDate } from '@/api/courseSchedule';

const currentDate = ref(dayjs());
const selectedDate = ref<Dayjs | null>(null);
const courses = ref<Record<string, any[]>>({});
const selectedCourses = ref<any[]>([]);

const getCoursesForDay = (date: Dayjs) => {
  const formattedDate = date.format('YYYY-MM-DD');
  const dayOfWeek = date.day(); // 获取当前日期是星期几，0 表示周日，1 表示周一，依次类推
  const courseList = courses.value[formattedDate] || [];

  // 过滤只显示当前星期几的课程
  return courseList.filter(course => course.dayOfWeek === dayOfWeek);
};


const onDateSelect = async (date: Dayjs) => {
  selectedDate.value = date;
  const formattedDate = date.format('YYYY-MM-DD');
  const dayOfWeek = date.day(); // 获取当前选择日期的星期几

  const { data } = await fetchCoursesByDate(formattedDate);

  // 过滤掉不是该 dayOfWeek 的课程
  selectedCourses.value = data.data.filter(course => course.dayOfWeek === dayOfWeek);
};


const onPanelChange = async (value: Dayjs) => {
  currentDate.value = value;
  await loadCoursesForMonth(value);
};

const loadCoursesForMonth = async (month: Dayjs) => {
  const startDate = month.startOf('month').format('YYYY-MM-DD');
  const endDate = month.endOf('month').format('YYYY-MM-DD');

  const promises = [];
  let current = dayjs(startDate);
  while (current.isBefore(endDate) || current.isSame(endDate)) {
    promises.push(fetchCoursesByDate(current.format('YYYY-MM-DD')));
    current = current.add(1, 'day');
  }

  const results = await Promise.all(promises);
  results.forEach((response, index) => {
    const courseDate = dayjs(startDate).add(index, 'day').format('YYYY-MM-DD');
    courses.value[courseDate] = response.data.data; // 只存储课程数据数组
  });

  console.log("Loaded courses:", JSON.stringify(courses.value, null, 2));
};



// Load the courses for the initial month
loadCoursesForMonth(currentDate.value);
</script>
