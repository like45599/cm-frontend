import service from '@/utils/request';

export function userLogin(data) {
    return service.post('/api/user/login', data);
}

export function userRegister(data) {
    return service.post('/api/user/register', data);
}

export function getLoginUser(data) {
    return service.get('/api/user/get/login', data);

}

export function updateUser(data) {
    return service.post('/api/user/update/my', data);

}

/**
 * 获取当前登录用户信息
 * @returns {Promise} 返回包含用户信息的Promise对象
 */
export function fetchLoginUser() {
    return service.get('/user/get/login');
}