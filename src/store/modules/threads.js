import { appendChildToParentMutation, docToResource, findById, makeFetchItemAction, makeFetchItemsAction } from '@/helpers'
import firebase from 'firebase'
import chunk from 'lodash/chunk'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    async createThread ({ commit, state, dispatch, rootState }, { text, title, forumId }) {
      // const threadId = `threadId-${Math.floor(Math.random() * 1000000)}`
      const userId = rootState.auth.authId
      const batch = firebase.firestore().batch()
      const threadRef = firebase.firestore().collection('threads').doc()
      const thread = {
        forumId,
        title,
        publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId
      }
      batch.set(threadRef, thread)
      const forumRef = firebase.firestore().collection('forums').doc(forumId)
      batch.update(forumRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      const userRef = firebase.firestore().collection('users').doc(userId)
      batch.update(userRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      await batch.commit()
      const newThread = await threadRef.get()
      commit('setItem', { item: { ...newThread.data(), id: newThread.id }, resource: 'threads' }, { root: true })
      commit('forums/appendThreadToForum', { parentId: forumId, childId: threadRef.id }, { root: true })
      commit('users/appendThreadToUser', { childId: threadRef.id, parentId: userId }, { root: true })
      await dispatch('posts/createPost', { threadId: threadRef.id, text }, { root: true })
      return state.items.find(t => t.id === threadRef.id)
    },
    async updateThread ({ commit, state, rootState }, { text, title, id }) {
      const thread = findById(state.items, id)
      const post = findById(rootState.posts.items, thread.posts[0])
      let newThread = { ...thread, title }
      let newPost = { ...post, text }
      const threadRef = firebase.firestore().collection('threads').doc(id)
      const postRef = firebase.firestore().collection('posts').doc(post.id)
      const batch = firebase.firestore().batch()
      batch.update(threadRef, newThread)
      batch.update(postRef, newPost)
      await batch.commit()
      newThread = await threadRef.get()
      newPost = await postRef.get()
      commit('setItem', { item: newThread, resource: 'threads' }, { root: true })
      commit('setItem', { item: newPost, resource: 'posts' }, { root: true })
      return docToResource(newThread)
    },
    fetchThread: makeFetchItemAction({ resource: 'threads' }),
    fetchThreads: makeFetchItemsAction({ resource: 'threads' }),
    fetchThreadsByPage ({ dispatch, commit }, { ids, page, perPage }) {
      commit('clearThreads')
      const chunks = chunk(ids, perPage)
      const limitedIds = chunks[page - 1]
      return dispatch('fetchThreads', { ids: limitedIds })
    }
  },
  getters: {
    thread: (state, getters, rootState) => {
      return (id) => {
        const thread = findById(state.items, id)
        if (!thread) {
          return {}
        }
        return {
          ...thread,
          get author () {
            return findById(rootState.users.items, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1
          },
          get contributorsCount () {
            return thread.contributors.length
          }
        }
      }
    }
  },
  mutations: {
    appendPostToThread: appendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendContributorToThread: appendChildToParentMutation({ parent: 'threads', child: 'contributors' }),
    clearThreads (state) {
      state.items = []
    }
  }
}
