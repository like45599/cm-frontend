<!-- GradeManagement.vue -->
<template>
  <div class="grade-management-container">
    <h1>成绩管理</h1>
    <a-table :columns="columns" :data-source="grades" :pagination="pagination" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const grades = ref([
  { key: '1', courseName: '数学', grade: 95 },
  { key: '2', courseName: '英语', grade: 88 },
  { key: '3', courseName: '计算机科学', grade: 92 },
]);

const columns = [
  { title: '课程名称', dataIndex: 'courseName', key: 'courseName' },
  { title: '成绩', dataIndex: 'grade', key: 'grade', sorter: (a, b) => a.grade - b.grade },
];

const pagination = {
  pageSize: 5,
};
</script>

<style scoped>
.grade-management-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
