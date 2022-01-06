import firebase from '@/helpers/firebase'
import {
  appendChildToParentMutation,
  docToResource,
  findById,
  makeFetchItemAction,
  makeFetchItemsAction
} from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    fetchUser: makeFetchItemAction({ resource: 'users' }),
    fetchUsers: makeFetchItemsAction({ resource: 'users' }),
    async createUser ({ commit }, { id, email, name, username, avatar = null }) {
      const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
      const usernameLower = username.toLowerCase()
      const emailLower = email.toLowerCase()
      const user = {
        email: emailLower,
        name,
        username: usernameLower,
        avatar,
        registeredAt
      }
      const userRef = firebase.firestore().collection('users').doc(id)
      userRef.set(user)
      const newUser = await userRef.get()
      commit('setItem', { resource: 'users', item: newUser }, { root: true })
      return docToResource(newUser)
    },
    async updateUser ({ commit }, user) {
      const updates = {
        avatar: user.avatar || null,
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null
      }
      const userRef = firebase.firestore().collection('users').doc(user.id)
      await userRef.update(updates)
      commit('setItem', { item: user, resource: 'users' }, { root: true })
    }
  },
  getters: {
    user: (state, getters, rootState) => {
      return (id) => {
        const user = findById(state.items, id)
        if (!user) {
          return null
        }
        return {
          ...user,
          get posts () {
            return rootState.posts.items.filter(p => p.userId === user.id)
          },
          get postsCount () {
            return user.postsCount || 0
          },
          get threads () {
            return rootState.threads.items.filter(t => t.userId === user.id)
          },
          get threadIds () {
            return user.threads
          },
          get threadsCount () {
            return user.threads?.length || 0
          }
        }
      }
    }
  },
  mutations: {
    appendThreadToUser: appendChildToParentMutation({ parent: 'users', child: 'threads' })
  }
}
