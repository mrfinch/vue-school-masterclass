import { docToResource, findById } from '@/helpers'
import firebase from 'firebase'
import store from '@/store/index'

export default {
  fetchItem ({ commit, state }, { id, resource, handleUnsubscribe = null }) {
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        if (doc.exists) {
          const item = { id, ...doc.data() }
          commit('setItem', { item, resource })
          return resolve(item)
        } else {
          return resolve(null)
        }
      })
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe)
      } else {
        commit('appendUnsubscribe', { unsubscribe })
      }
    })
  },
  fetchItems ({ dispatch }, { ids, resource }) {
    return Promise.all(
      ids.map(id => dispatch('fetchItem', { id, resource }))
    )
  },
  unsubscribeAllSnapshots ({ commit, state }) {
    state.unsubscribes.forEach((unsubscribe) => {
      unsubscribe()
    })
    commit('clearAllUnsubscribes')
  }
}
