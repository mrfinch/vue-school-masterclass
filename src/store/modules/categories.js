import firebase from 'firebase'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    fetchCategories ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { ids, resource: 'categories' }, { root: true })
    },
    fetchCategory ({ dispatch }, { id }) {
      return dispatch('fetchItem', { id, resource: 'categories' }, { root: true })
    },
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