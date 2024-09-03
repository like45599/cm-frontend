<template>
  <div>
    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">Add Course Schedule</a-button>
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
        <template v-if="['courseId', 'classId', 'dayOfWeek', 'timeSlot', 'weeks'].includes(column.dataIndex)">
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
import { fetchCourseScheduleList, addCourseSchedule, updateCourseSchedule, deleteCourseSchedule } from '@/api/courseSchedule';

interface DataItem {
  key: string;
  id: number;
  courseId: number;
  classId: number;
  dayOfWeek: number;
  timeSlot: string;
  weeks: string;
}

const columns = [
  { title: 'Course ID', dataIndex: 'courseId', width: '10%' },
  { title: 'Class ID', dataIndex: 'classId', width: '10%' },
  { title: 'Day of Week', dataIndex: 'dayOfWeek', width: '10%' },
  { title: 'Time Slot', dataIndex: 'timeSlot', width: '20%' },
  { title: 'Weeks', dataIndex: 'weeks', width: '20%' },
  { title: 'Operation', dataIndex: 'operation', width: '30%' },
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
    const response = await fetchCourseScheduleList({
      current: params.current || pagination.current,
      pageSize: params.pageSize || pagination.pageSize,
    });
    const data = response.data.data;
    pagination.total = data.total;
    dataSource.value = data.records.map((record: any) => ({
      key: record.id.toString(),
      id: record.id,
      courseId: record.courseId,
      classId: record.classId,
      dayOfWeek: record.dayOfWeek,
      timeSlot: record.timeSlot,
      weeks: record.weeks,
    }));
  } catch (error) {
    console.error('Failed to fetch course schedule data:', error);
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
    await updateCourseSchedule(key, editableData[key]);
    Object.assign(dataSource.value.find(item => key === item.key), editableData[key]);
    delete editableData[key];
    fetchData(); // 保存后刷新数据
  } catch (error) {
    console.error('Failed to save course schedule data:', error);
  }
};

const cancel = (key: string) => {
  delete editableData[key];
};

const onDelete = async (key: string) => {
  try {
    await deleteCourseSchedule(key);
    dataSource.value = dataSource.value.filter(item => item.key !== key);
    fetchData(); // 删除后刷新数据
  } catch (error) {
    console.error('Failed to delete course schedule:', error);
  }
};

const handleAdd = async () => {
  console.log("Add button clicked");
  const newData = {
    courseId: 1,
    classId: 1,
    dayOfWeek: 1,
    timeSlot: '第1-2节',
    weeks: '1-2',
    startDate: '2024-09-01', // 添加 startDate
    endDate: '2024-12-31', // 添加 endDate
  };
  try {
    const response = await addCourseSchedule(newData);
    console.log("Add response:", response);
    if (response.data.code !== 0) {
      console.error('Failed to add course schedule:', response.data.message);
    } else {
      fetchData(); // 添加后刷新数据
    }
  } catch (error) {
    console.error('Failed to add course schedule:', error);
  }
};


fetchData();
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
