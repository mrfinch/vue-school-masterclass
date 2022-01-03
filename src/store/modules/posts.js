import firebase from 'firebase'
import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    async createPost ({ commit, state, rootState }, post) {
      post.userId = rootState.auth.authId
      // post.publishedAt = Math.floor(Date.now() / 1000)
      post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
      // const newPost = await firebase.firestore().collection('posts').add(post)
      // await firebase.firestore().collection('threads').doc(post.threadId).update({
      //   posts: firebase.firestore.FieldValue.arrayUnion(newPost.id),
      //   contributors: firebase.firestore.FieldValue.arrayUnion(post.userId)
      // })
      const batch = firebase.firestore().batch()
      const postRef = firebase.firestore().collection('posts').doc()
      const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
      const userRef = firebase.firestore().collection('users').doc(post.userId)
      batch.set(postRef, post)
      batch.update(threadRef, {
        posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
        contributors: firebase.firestore.FieldValue.arrayUnion(post.userId)
      })
      batch.update(userRef, {
        postsCount: firebase.firestore.FieldValue.increment(1)
      })
      await batch.commit()
      const newPost = await postRef.get()
      commit('setItem', { item: { ...newPost.data(), id: newPost.id }, resource: 'posts' }, { root: true })
      commit('threads/appendPostToThread', { parentId: post.threadId, childId: newPost.id }, { root: true })
      commit('threads/appendContributorToThread', { parentId: post.threadId, childId: post.userId }, { root: true })
    },
    async updatePost ({ commit, state, rootState }, { text, id }) {
      const post = {
        text,
        edited: {
          at: firebase.firestore.FieldValue.serverTimestamp(),
          by: rootState.auth.authId,
          moderated: false
        }
      }
      const postRef = firebase.firestore().collection('posts').doc(id)
      await postRef.update(post)
      const updatedPost = await postRef.get()
      commit('setItem', { item: updatedPost, resource: 'posts' }, { root: true })
    },
    fetchPost: makeFetchItemAction({ resource: 'posts' }),
    fetchPosts: makeFetchItemsAction({ resource: 'posts' })
  },
  getters: {},
  mutations: {}
}
