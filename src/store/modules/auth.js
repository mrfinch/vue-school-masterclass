import firebase from 'firebase'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUnsubscribe: null,
    authObserverUnsubscribe: null
  },
  actions: {
    initAuthentication ({ dispatch, commit, state }) {
      if (state.authObserverUnsubscribe) {
        state.authObserverUnsubscribe()
      }
      return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          console.log('signAuth', user)
          dispatch('unsubscribeAuthUserSnapshot')
          if (user) {
            await dispatch('fetchAuthUser')
            resolve(user)
          } else {
            resolve(null)
          }
        })
        commit('setAuthObserverUnsubscribe', unsubscribe)
      })
    },
    async registerUserWithEmailPassword ({ dispatch }, { email, password, name, username, avatar = null }) {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
      await dispatch('users/createUser', { name, username, avatar, email, id: result.user.uid }, { root: true })
      await dispatch('fetchAuthUser')
    },
    signInWithEmailAndPassword (context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    async signInWithGoogle ({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      const response = await firebase.auth().signInWithPopup(provider)
      const user = response.user
      const userRef = firebase.firestore().collection('users').doc(user.uid)
      const userDoc = await userRef.get()
      if (!userDoc.exists) {
        return dispatch('users/createUser', { id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL }, { root: true })
      }
    },
    async signOut ({ commit }) {
      await firebase.auth().signOut()
      commit('setAuthId', null)
    },
    unsubscribeAuthUserSnapshot ({ state, commit }) {
      if (state.authUnsubscribe) {
        state.authUnsubscribe()
        commit('setAuthUserUnsubscribe', null)
      }
    },
    async fetchAuthUser ({ dispatch, commit }) {
      const userId = firebase.auth().currentUser?.uid
      if (!userId) {
        return
      }
      await dispatch('fetchItem', {
        id: userId,
        resource: 'users',
        handleUnsubscribe: (unsubscribe) => {
          commit('setAuthUserUnsubscribe', unsubscribe)
        }
      }, { root: true })
      commit('setAuthId', userId)
    },
    async fetchAuthUsersPosts ({ state, commit }) {
      const posts = await firebase.firestore().collection('posts').where('userId', '==', state.authId).get()
      posts.forEach((item) => {
        commit('setItem', { resource: 'posts', item }, { root: true })
      })
    }
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    }
  },
  mutations: {
    setAuthId (state, userId) {
      state.authId = userId
    },
    setAuthUserUnsubscribe (state, unsubscribe) {
      state.authUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe (state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe
    }
  }
}
