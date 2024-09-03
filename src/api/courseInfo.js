import request from '@/utils/request';

export function fetchCourseInfoList(data) {
    return request({
        url: '/api/courseInfo/list/page',
        method: 'post',
        data
    });
}

export function addCourseInfo(data) {
    return request({
        url: '/api/courseInfo/create',
        method: 'post',
        data
    });
}

export function updateCourseInfo(id, data) {
    return request({
        url: `/api/courseInfo/update/${id}`,
        method: 'post',
        data
    });
}

export function deleteCourseInfo(id) {
    return request({
        url: `/api/courseInfo/delete/${id}`,
        method: 'post'
    });
}
