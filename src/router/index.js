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
import Groups from '@/components/Groups'
import Logs from '@/components/Logs'
import Verify from '@/components/Verify'
import NewGroup from '@/components/NewGroup'
import Group from '@/components/Group'
import More from '@/components/More'
import Unsubscribe from '@/components/Unsubscribe'

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
      path: '/newquestion/:groupID',
      name: 'NewQuestionInGroup',
      component: NewQuestion
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/search/:type/:query',
      name: 'Search',
      component: Search
    },
    {
      path: '/groups',
      name: 'Groups',
      component: Groups
    },
    {
      path: '/logs',
      name: 'Logs',
      component: Logs
    },
    {
      path: '/verify',
      name: 'Verify',
      component: Verify
    },
    {
      path: '/newgroup',
      name: 'NewGroup',
      component: NewGroup
    },
    {
      path: '/group/:groupID',
      name: 'Group',
      component: Group
    },
    {
      path: '/more/:query/:group',
      name: 'More',
      component: More
    },
    {
      path: '/unsubscribe',
      name: 'Unsubscribe',
      component: Unsubscribe
    },
    {
      path: '/more/:query',
      name: 'MoreInGroup',
      component: More
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
