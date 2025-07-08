import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Blog from './views/Blog.vue'
import BlogDetail from './views/BlogDetail.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/blog', name: 'Blog', component: Blog },
    { path: '/blog/:id', name: 'BlogDetail', component: BlogDetail },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router 