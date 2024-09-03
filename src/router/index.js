import { createRouter, createWebHistory } from 'vue-router';
import {Layout} from "ant-design-vue";

// 懒加载组件
const Home = () => import('@/views/Home.vue');
const Activities = () => import('@/views/Activities.vue');
const ClassNotices = () => import('@/views/ClassNotices.vue');
const Profile = () => import('@/views/Profile.vue');
const CourseSchedule = () => import('@/views/CourseSchedule.vue');
const GradeManagement = () => import('@/views/GradeManagement.vue');
const AdminLayout = () => import('@/views/AdminLayout.vue');
const Login = () => import('@/views/Login.vue');
const Forbidden = () => import('@/views/Forbidden.vue');

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            { path: '', name: 'Home', component: Home, meta: { title: '首页' } },
            { path: 'activities', name: 'Activities', component: Activities, meta: { title: '班级活动', requiresAuth: true } },
            { path: 'classNotice', name: 'ClassNotice', component: ClassNotices, meta: { title: '班级通知', requiresAuth: true } },
            { path: 'profile', name: 'Profile', component: Profile, meta: { title: '我的', requiresAuth: true } },
            { path: 'course-schedule', name: 'CourseSchedule', component: CourseSchedule, meta: { title: '课程表', requiresAuth: true } },
            { path: 'grade-management', name: 'GradeManagement', component: GradeManagement, meta: { title: '成绩管理', requiresAuth: true } },
        ],
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminLayout,
        meta: { title: '后台管理', requiresAuth: true, requiresAdmin: true, layout: false },
        children: [
            {
                path: 'student-info-management',
                name: 'StudentInfoManagement',
                component: () => import('@/views/admin/StudentInfoManagement.vue'),
                meta: { title: '学生信息管理', requiresAuth: true, requiresAdmin: true}
            },
            {
                path: 'class-officers',
                name: 'ClassOfficers',
                component: () => import('@/views/admin/ClassOfficerManagement.vue'),
                meta: { title: '班级干部管理', requiresAuth: true, requiresAdmin: true },
            },
            {
                path: 'class-activities',
                name: 'ClassActivities',
                component: () => import('@/views/admin/ClassActivitiesList.vue'),
                meta: { title: '班级活动管理', requiresAuth: true, requiresAdmin: true },
            },
            {
                path: 'class-notices',
                name: 'ClassNotices',
                component: () => import('@/views/admin/ClassNoticesList.vue'),
                meta: { title: '班级通知管理', requiresAuth: true, requiresAdmin: true },
            },
            {
                path: 'course-info',
                name: 'CourseInfoManagement',
                component: () => import('@/views/admin/CourseInfoManagement.vue'),
                meta: { title: '课程信息管理', requiresAuth: true, requiresAdmin: true },
            },
            {
                path: 'course-schedule',
                name: 'CourseScheduleAdmin',
                component: () => import('@/views/admin/CourseSchedule.vue'),
                meta: { title: '课程表管理', requiresAuth: true, requiresAdmin: true },
            },

        ]
    },
    { path: '/login', name: 'Login', component: Login, meta: { title: '登录', layout: false } },
    { path: '/403', name: 'Forbidden', component: Forbidden, meta: { layout: false } },
    { path: '/:catchAll(.*)', redirect: '/403' },

];


const router = createRouter({
    history: createWebHistory(),
    routes
});


// 路由守卫配置
router.beforeEach((to, from, next) => {
    console.log(`Navigating to: ${to.name}`);
    console.log('User ID:', localStorage.getItem("userId"));
    console.log('User Role:', localStorage.getItem("userRole"));

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!localStorage.getItem("userId")) {
            console.log('Not authenticated, redirecting to Login');
            next({ name: 'Login' });
        } else if (to.matched.some(record => record.meta.requiresAdmin)) {
            if (localStorage.getItem("userRole") === 'admin') {
                console.log('User is admin, allowing access');
                next();
            } else {
                console.log('User is not admin, redirecting to 403');
                next('/403');
            }
        } else {
            next();
        }
    } else {
        next();
    }
});



export default router;
