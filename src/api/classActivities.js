import service from '@/utils/request';

export function fetchClassActivitiesList(data) {
    return service.post('/api/classActivities/list/page', data);
}

export function addClassActivity(data) {
    return service.post('/api/classActivities/create', data);
}

export function updateClassActivity(id, data) {
    return service.post(`/api/classActivities/update/${id}`, data);
}

export function deleteClassActivity(id) {
    return service.post(`/api/classActivities/delete/${id}`);
}

// 获取最近的班级活动
export function fetchRecentActivities(params) {
    return service.post('/api/classActivities/list/page', {
        ...params,
        current: 1,
        pageSize: 1, // 限制获取5条数据
    });
}
