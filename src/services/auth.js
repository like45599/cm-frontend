export function getUser() {
    // 从本地存储或通过API获取用户信息
    return JSON.parse(localStorage.getItem('user'));
}

export function loginUser(username, password) {
    // 模拟登录过程，实际应该调用后端API
    const user = {
        username,
        userRole: username === 'admin' ? 'admin' : 'user'  // 简单判断用户名是admin就是管理员
    };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
}

export function logoutUser() {
    // 注销用户，清除本地存储
    localStorage.removeItem('user');
}
