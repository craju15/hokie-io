import Vue from 'vue'
import Router from 'vue-router'
import QuestionPage from '@/components/QuestionPage'
import Recent from '@/components/Recent'
import PageNotFound from '@/components/PageNotFound'
import Profile from '@/components/Profile'
import Login from '@/components/Login'
import About from '@/components/About'
import NewQuestion from '@/components/NewQuestion'
import Signup from '@/components/Signup'
import Search from '@/components/Search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/question/:questionID',
      name: 'QuestionPage',
      component: QuestionPage,
      props: true
    },
    {
      path: '/profile/:userID',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      props: true
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/newquestion',
      name: 'NewQuestion',
      component: NewQuestion
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/search/:query',
      name: 'Search',
      component: Search
    },
    {
      path: '/',
      name: 'Recent',
      component: Recent
    },
    {
      path: '*',
      name: '404',
      component: PageNotFound
    }
  ],
  mode: 'history'
})
