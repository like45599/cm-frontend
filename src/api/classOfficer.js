import service from '@/utils/request';

export function fetchClassOfficerList(data) {
    return service.post('/api/classOfficer/list/page', data);
}

export function addClassOfficer(data) {
    return service.post('/api/classOfficer/create', data);
}

export function updateClassOfficer(id) {
    return service.post(`/api/classOfficer/update/${id}`, data);
}

export function deleteClassOfficer(id) {
    return service.post(`/api/classOfficer/delete/${id}`);
}
