<template>
  <div>
    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">Add Course Info</a-button>
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
        <template v-if="['courseName', 'teacherName', 'color'].includes(column.dataIndex)">
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
import { fetchCourseInfoList, addCourseInfo, updateCourseInfo, deleteCourseInfo } from '@/api/courseInfo';

interface DataItem {
  key: string;
  id: number;
  courseName: string;
  teacherName: string;
  color: string;
}

const columns = [
  { title: 'Course ID', dataIndex: 'id', width: '10%' },
  { title: 'Course Name', dataIndex: 'courseName', width: '25%' },
  { title: 'Teacher Name', dataIndex: 'teacherName', width: '25%' },
  { title: 'Color', dataIndex: 'color', width: '20%' },
  { title: 'Operation', dataIndex: 'operation', width: '20%' },
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
    const response = await fetchCourseInfoList({
      current: params.current || pagination.current,
      pageSize: params.pageSize || pagination.pageSize,
    });
    const data = response.data.data;
    pagination.total = data.total;
    dataSource.value = data.records.map((record: any) => ({
      key: record.id.toString(),
      id: record.id,
      courseName: record.courseName,
      teacherName: record.teacherName,
      color: record.color,
    }));
  } catch (error) {
    console.error('Failed to fetch course info data:', error);
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
    await updateCourseInfo(key, editableData[key]);
    Object.assign(dataSource.value.find(item => key === item.key), editableData[key]);
    delete editableData[key];
    fetchData(); // 保存后刷新数据
  } catch (error) {
    console.error('Failed to save course info data:', error);
  }
};

const cancel = (key: string) => {
  delete editableData[key];
};

const onDelete = async (key: string) => {
  try {
    await deleteCourseInfo(key);
    dataSource.value = dataSource.value.filter(item => item.key !== key);
    fetchData(); // 删除后刷新数据
  } catch (error) {
    console.error('Failed to delete course info:', error);
  }
};

const handleAdd = async () => {
  const newData = {
    courseName: `New Course`,
    teacherName: 'New Teacher',
    color: '#000000',
  };
  try {
    await addCourseInfo(newData);
    fetchData(); // 添加后刷新数据
  } catch (error) {
    console.error('Failed to add course info:', error);
  }
};

fetchData();
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
