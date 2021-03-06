import firebase from '@/helpers/firebase'
import useNotifications from '@/composables/useNotifications'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUnsubscribe: null,
    authObserverUnsubscribe: null
  },
  actions: {
    updateEmail ({ state }, { email }) {
      return firebase.auth().currentUser.updateEmail(email)
    },
    async reauthenticate ({ state }, { email, password }) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, password)
      await firebase.auth().currentUser.reauthenticateWithCredential(credential)
    },
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
      avatar = dispatch('uploadAvatar', { file: avatar, authId: result.user.uid })
      await dispatch('users/createUser', { name, username, avatar, email, id: result.user.uid }, { root: true })
      await dispatch('fetchAuthUser')
    },
    async uploadAvatar ({ state }, { file, authId }) {
      if (!file) return null
      authId = authId || state.authId
      try {
        const storageBucket = firebase.storage().ref().child(`uploads/${authId}/images/${Date.now()}-${file.name}`)
        const snapshot = await storageBucket.put(file)
        return snapshot.ref.getDownloadURL()
      } catch (err) {
        const { addNotification } = useNotifications()
        addNotification({ message: 'Error uploading image' })
      }
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
    async fetchAuthUsersPosts ({ state, commit }, { startAfter }) {
      let query = firebase.firestore().collection('posts')
        .where('userId', '==', state.authId)
        .orderBy('publishedAt', 'desc')
        .limit(2)
      if (startAfter) {
        const doc = await firebase.firestore().collection('posts').doc(startAfter.id).get()
        query = query.startAfter(doc)
      }
      const posts = await query.get()
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
