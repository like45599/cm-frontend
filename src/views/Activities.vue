<template>
  <a-list
      item-layout="vertical"
      size="large"
      :pagination="{
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      onChange: handlePageChange
    }"
      :data-source="dataSource"
      :loading="loading"
  >
    <template #renderItem="{ item }">
      <a-list-item :key="item.id">
        <template #extra>
          <img
              width="272"
              alt="activity"
              src="@/assets/zhongqiu.jpg"
          />
        </template>
        <a-list-item-meta>
          <template #title>
            <a>{{ item.activityName }}</a>
          </template>
          <template #description>
            日期：{{ item.activityDate }}
          </template>
        </a-list-item-meta>
        <div>班级：{{ item.classId }}</div>
        <div>描述：{{ item.description }}</div>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { fetchClassActivitiesList } from '@/api/classActivities';

interface DataItem {
  id: string;
  activityName: string;
  activityDate: string;
  description: string;
  classId: number;
}

const dataSource = ref<DataItem[]>([]);
const loading = ref(false);
const pagination = ref({
  current: 1,
  pageSize: 5,
  total: 0,
});

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await fetchClassActivitiesList({
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    });
    const data = response.data.data;
    pagination.value.total = data.total;
    dataSource.value = data.records.map((record: any) => ({
      id: record.id.toString(),
      activityName: record.activityName,
      activityDate: record.activityDate,
      description: record.description,
      classId: record.classId,
    }));
  } catch (error) {
    console.error('Failed to fetch class activity data:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.value.current = page;
  fetchData();
};

onMounted(fetchData);
</script>

<style scoped>
a-list-item-meta-title {
  font-size: 18px;
  font-weight: bold;
}
a-list-item-meta-description {
  font-size: 14px;
}
</style>
