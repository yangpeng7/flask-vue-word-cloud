import Vue from 'vue'
import Router from 'vue-router'
import WordCloud from '@/pages/WordCloud'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: WordCloud
  }]
})
