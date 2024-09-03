<template>
  <div>
    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">Add Student</a-button>
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
        <template v-if="['name', 'gender', 'studentNum', 'classId', 'birthDate'].includes(column.dataIndex)">
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
import { fetchStudentList, addStudent, updateStudent, deleteStudent } from '@/api/student';

interface DataItem {
  key: string;
  name: string;
  gender: string;
  studentNum: string;
  classId: number;
  birthDate: string;
}

const columns = [
  { title: 'Name', dataIndex: 'name', width: '20%' },
  { title: 'Gender', dataIndex: 'gender', width: '10%' },
  { title: 'Student Number', dataIndex: 'studentNum', width: '20%' },
  { title: 'Class ID', dataIndex: 'classId', width: '20%' },
  { title: 'Birth Date', dataIndex: 'birthDate', width: '20%' },
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
    const response = await fetchStudentList({
      current: params.current || pagination.current,
      pageSize: params.pageSize || pagination.pageSize,
    });
    const data = response.data.data;
    pagination.total = data.total;
    dataSource.value = data.records.map((record: any) => ({
      key: record.id.toString(),
      name: record.name,
      gender: record.gender,
      studentNum: record.studentNum,
      classId: record.classId,
      birthDate: record.birthDate,
    }));
  } catch (error) {
    console.error('Failed to fetch student data:', error);
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
    await updateStudent({ id: key, ...editableData[key] });
    Object.assign(dataSource.value.find(item => key === item.key), editableData[key]);
    delete editableData[key];
    fetchData(); // Refresh data after save
  } catch (error) {
    console.error('Failed to save student data:', error);
  }
};

const cancel = (key: string) => {
  delete editableData[key];
};

const onDelete = async (key: string) => {
  try {
    await deleteStudent(key);
    dataSource.value = dataSource.value.filter(item => item.key !== key);
    fetchData(); // Refresh data after delete
  } catch (error) {
    console.error('Failed to delete student:', error);
  }
};

const handleAdd = async () => {
  const newData = {
    name: `New Student`,
    gender: 'Male',
    studentNum: `S${Date.now()}`,
    classId: 1,
    birthDate: '2000-01-01',
  };
  try {
    await addStudent(newData);
    fetchData(); // Refresh data after add
  } catch (error) {
    console.error('Failed to add student:', error);
  }
};

fetchData();
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
