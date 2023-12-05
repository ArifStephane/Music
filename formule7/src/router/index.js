import { createRouter, createWebHistory } from 'vue-router'
import MusicView from '../views/MusicView.vue'
// import routes from "@/router/routes";
 

 

const routes = [
  {
    path: '/music',
    name: 'music',
    meta: { title: 'Music' },
    component: MusicView
  },  
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// router.afterEach((to) => {
//   document.title = to.meta.title
// })

export default router
