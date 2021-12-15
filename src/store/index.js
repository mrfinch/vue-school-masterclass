import { createStore } from 'vuex'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import getters from '@/store/getters'

export default createStore({
  state: {
    authId: null,
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    unsubscribes: [],
    authUnsubscribe: null
  },
  getters,
  actions,
  mutations
})
