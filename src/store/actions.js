import { findById } from '@/helpers'
import firebase from 'firebase'

export default {
  fetchItem ({ commit, state }, { id, resource, handleUnsubscribe = null, once, onSnapshot = null }) {
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        if (once) {
          unsubscribe()
        }
        if (doc.exists) {
          const item = { id, ...doc.data() }
          let previousItem = findById(state[resource].items, id)
          previousItem = previousItem ? { ...previousItem } : null
          commit('setItem', { item, resource })
          if (typeof onSnapshot === 'function') {
            const isLocal = doc.metadata.hasPendingWrites
            onSnapshot({ item: { ...item }, previousItem, isLocal })
          }
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
  fetchItems ({ dispatch }, { ids, resource, onSnapshot = null }) {
    return Promise.all(
      ids.map(id => dispatch('fetchItem', { id, resource, onSnapshot }))
    )
  },
  unsubscribeAllSnapshots ({ commit, state }) {
    state.unsubscribes.forEach((unsubscribe) => {
      unsubscribe()
    })
    commit('clearAllUnsubscribes')
  }
}
