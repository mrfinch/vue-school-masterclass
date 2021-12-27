import { appendChildToParentMutation } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    fetchForum ({ dispatch }, { id }) {
      return dispatch('fetchItem', { id, resource: 'forums' }, { root: true })
    },
    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'forums' }, { root: true })
    }
  },
  getters: {},
  mutations: {
    appendThreadToForum: appendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
}
