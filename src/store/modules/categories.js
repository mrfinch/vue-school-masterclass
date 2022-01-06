import firebase from '@/helpers/firebase'
import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    fetchCategories: makeFetchItemsAction({ resource: 'categories' }),
    fetchCategory: makeFetchItemAction({ resource: 'categories' }),
    fetchAllCategories ({ commit }) {
      return new Promise((resolve) => {
        firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
          const categories = querySnapshot.docs.map(doc => {
            const item = { id: doc.id, ...doc.data() }
            commit('setItem', { resource: 'categories', item }, { root: true })
            return item
          })
          return resolve(categories)
        })
      })
    }
  },
  getters: {},
  mutations: {}
}
