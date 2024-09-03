import service from '@/utils/request';

export function fetchStudentList(data) {
    return service.post('/api/studentInfo/list/page', data);
}

export function addStudent(data) {
    return service.post('/api/studentInfo/create', data);
}

export function updateStudent(data) {
    return service.post(`/api/studentInfo/update/${data.id}`, data);
}

export function deleteStudent(id) {
    return service.post(`/api/studentInfo/delete/${id}`);
}
/**
 * 通过 ID 获取学生信息
 * @param {number} id - 学生信息的 ID
 * @returns {Promise} 返回包含学生信息的Promise对象
 */
export function getStudentById(id) {
    return service.get(`/studentInfo/${id}`);
}