import service from '@/utils/request';

// 获取课程表列表（分页）
export function fetchCourseScheduleList(data) {
    return service.post('/api/course-schedule/list/page', data);
}

// 获取某一周的课程表
export function fetchCourseScheduleByWeek(week) {
    return service.get(`/api/course-schedule/week/${week}`);
}

// 新增课程表
export function addCourseSchedule(data) {
    return service.post('/api/course-schedule/create', data);
}

// 更新课程表
export function updateCourseSchedule(id, data) {
    return service.post(`/api/course-schedule/update/${id}`, data);
}

// 删除课程表
export function deleteCourseSchedule(id) {
    return service.post(`/api/course-schedule/delete/${id}`);
}

// export const fetchScheduleForCurrentWeek = (startDate, endDate) => {
//     return service.get(`/api/course/schedule/period`, {
//         params: { startDate, endDate }
//     });
// };

// 获取指定日期和星期几的课程表
export const fetchCoursesByDateAndDayOfWeek = async (date, dayOfWeek) => {
    const classId = localStorage.getItem('classId'); // 从 localStorage 中获取 classId
    return service.get(`/api/course-schedule/date/${date}/day/${dayOfWeek}`, {
        headers: {
            'classId': classId, // 将 classId 传递到后端
        }
    });
};

export function fetchCoursesByDate(date) {
    return service.get(`/api/course-schedule/date/${date}`);
}

