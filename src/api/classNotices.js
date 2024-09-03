import service from '@/utils/request';

export function fetchClassNoticesList(data) {
    return service.post('/api/classNotices/list/page', data);
}

export function addClassNotice(data) {
    return service.post('/api/classNotices/create', data);
}


export function updateClassNotice(id, data) {
    return service.post(`/api/classNotices/update/${id}`, data);
}

export function deleteClassNotice(id) {
    return service.post(`/api/classNotices/delete/${id}`);
}
// 获取最近的班级通知
export function fetchRecentNotices(params) {
    return service.post('/api/classNotices/list/page', {
        ...params,
        current: 1,
        pageSize: 1, // 限制获取5条数据
    });
}
export function fetchNoticesByClass() {
    return service.get('/api/classNotices/list-by-class');
}