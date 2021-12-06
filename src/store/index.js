import { createStore } from 'vuex'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import getters from '@/store/getters'

export default createStore({
  state: {
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3',
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    unsubscribes: []
  },
  getters,
  actions,
  mutations
})
