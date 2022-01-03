import { appendChildToParentMutation, makeFetchItemAction, makeFetchItemsAction } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    fetchForum: makeFetchItemAction({ resource: 'forums' }),
    fetchForums: makeFetchItemsAction({ resource: 'forums' })
  },
  getters: {},
  mutations: {
    appendThreadToForum: appendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
}
