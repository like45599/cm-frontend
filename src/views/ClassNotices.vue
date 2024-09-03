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
              alt="notice"
              src="@/assets/head.jpg"
          />
        </template>
        <a-list-item-meta>
          <template #title>
            <a>{{ item.title }}</a>
          </template>
          <template #description>
            日期：{{ item.noticeDate }}
          </template>
        </a-list-item-meta>
        <div>班级：{{ item.classId }}</div>
        <div>内容：{{ item.content }}</div>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { fetchClassNoticesList } from '@/api/classNotices';
import { fetchNoticesByClass } from '@/api/classNotices';
interface DataItem {
  id: string;
  title: string;
  content: string;
  noticeDate: string;
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
    const response = await fetchNoticesByClass();
    console.log('API Response:', response);  // 添加这一行检查 API 返回
    const data = response.data.data;

    pagination.value.total = data.length;
    dataSource.value = data.map((record: any) => ({
      id: record.id.toString(),
      title: record.title,
      content: record.content,
      noticeDate: record.noticeDate,
      classId: record.classId,
    }));
  } catch (error) {
    console.error('Failed to fetch class notices data:', error);
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
