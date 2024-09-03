<template>
  <div>
    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">Add Class Activity</a-button>
    <a-table
        :loading="loading"
        bordered
        :data-source="dataSource"
        :columns="columns"
        :pagination="pagination"
        @change="handleTableChange"
    >
      <template #bodyCell="{ column, text, record }">
        <!-- 单元格编辑 -->
        <template v-if="['activityName', 'activityDate', 'description', 'classId'].includes(column.dataIndex)">
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
        <!-- 行操作 -->
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
import { fetchClassActivitiesList, addClassActivity, updateClassActivity, deleteClassActivity } from '@/api/classActivities';

interface DataItem {
  key: string;
  activityName: string;
  activityDate: string;
  description: string;
  classId: number;
}

const columns = [
  { title: 'Activity Name', dataIndex: 'activityName', width: '20%' },
  { title: 'Activity Date', dataIndex: 'activityDate', width: '20%' },
  { title: 'Description', dataIndex: 'description', width: '40%' },
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
    const response = await fetchClassActivitiesList({
      current: params.current || pagination.current,
      pageSize: params.pageSize || pagination.pageSize,
    });
    const data = response.data.data;
    pagination.total = data.total;
    dataSource.value = data.records.map((record: any) => ({
      key: record.id.toString(),
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
    // 将 id 和其他数据分开传递
    await updateClassActivity(key, editableData[key]);
    Object.assign(dataSource.value.find(item => key === item.key), editableData[key]);
    delete editableData[key];
    fetchData(); // 保存后刷新数据
  } catch (error) {
    console.error('Failed to save class activity data:', error);
  }
};


const cancel = (key: string) => {
  delete editableData[key];
};

const onDelete = async (key: string) => {
  try {
    await deleteClassActivity(key);
    dataSource.value = dataSource.value.filter(item => item.key !== key);
    fetchData(); // Refresh data after delete
  } catch (error) {
    console.error('Failed to delete class activity:', error);
  }
};

const handleAdd = async () => {
  const newData = {
    activityName: `New Activity`,
    activityDate: '2024-09-01 00:00:00',
    description: 'New Description',
    classId: 1,
  };
  try {
    await addClassActivity(newData);
    fetchData(); // Refresh data after add
  } catch (error) {
    console.error('Failed to add class activity:', error);
  }
};

fetchData();
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
