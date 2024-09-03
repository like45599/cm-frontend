<template>
  <div>
    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">Add Notice</a-button>
    <a-table
        :loading="loading"
        bordered
        :data-source="dataSource"
        :columns="columns"
        :pagination="pagination"
        @change="handleTableChange"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="['title', 'content', 'noticeDate', 'classId'].includes(column.dataIndex)">
          <div>
            <a-input
                v-if="editableData[record.key]"
                v-model:value="editableData[record.key][column.dataIndex]"
                style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a-typography-link @click="save(record.key)">Save</a-typography-link>
              <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
                <a>Cancel</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="edit(record.key)">Edit</a>
              <a-popconfirm title="Sure to delete?" @confirm="onDelete(record.key)">
                <a>Delete</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { cloneDeep } from 'lodash-es';
import { fetchClassNoticesList, addClassNotice, updateClassNotice, deleteClassNotice } from '@/api/classNotices';

interface DataItem {
  key: string;
  title: string;
  content: string;
  noticeDate: string;
  classId: number;
}

const columns = [
  { title: 'Title', dataIndex: 'title', width: '20%' },
  { title: 'Content', dataIndex: 'content', width: '40%' },
  { title: 'Notice Date', dataIndex: 'noticeDate', width: '20%' },
  { title: 'Class ID', dataIndex: 'classId', width: '10%' },
  { title: 'Operation', dataIndex: 'operation', width: '10%' },
];

const dataSource = ref<DataItem[]>([]);
const editableData = reactive<Record<string, Partial<DataItem>>>({});
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const fetchData = async (params: any = {}) => {
  loading.value = true;
  try {
    const response = await fetchClassNoticesList({
      current: params.current || pagination.current,
      pageSize: params.pageSize || pagination.pageSize,
    });
    const data = response.data.data;
    pagination.total = data.total;
    dataSource.value = data.records.map((record: any) => ({
      key: record.id.toString(),
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

const handleTableChange = (paginationInfo: any) => {
  pagination.current = paginationInfo.current;
  pagination.pageSize = paginationInfo.pageSize;
  fetchData({ current: pagination.current, pageSize: pagination.pageSize });
};

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.find(item => key === item.key) || {});
};

const save = async (key: string) => {
  try {
    await updateClassNotice(key, editableData[key]);
    Object.assign(dataSource.value.find(item => key === item.key), editableData[key]);
    delete editableData[key];
    fetchData(); // Refresh data after save
  } catch (error) {
    console.error('Failed to save class notice data:', error);
  }
};

const cancel = (key: string) => {
  delete editableData[key];
};

const onDelete = async (key: string) => {
  try {
    await deleteClassNotice(key);
    dataSource.value = dataSource.value.filter(item => item.key !== key);
    fetchData(); // Refresh data after delete
  } catch (error) {
    console.error('Failed to delete class notice:', error);
  }
};

const handleAdd = async () => {
  const newData = {
    title: `New Notice`,
    content: 'New Content',
    noticeDate: '2024-09-01 00:00:00',  // 确保此字段已经正确设置
    classId: 1,
  };
  try {
    await addClassNotice(newData);
    fetchData(); // Refresh data after add
  } catch (error) {
    console.error('Failed to add class notice:', error);
  }
};



fetchData();
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
