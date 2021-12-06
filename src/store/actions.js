import { docToResource, findById } from '@/helpers'
import firebase from 'firebase'

export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
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
    commit('setItem', { item: { ...newPost.data(), id: newPost.id }, resource: 'posts' })
    commit('appendPostToThread', { parentId: post.threadId, childId: newPost.id })
    commit('appendContributorToThread', { parentId: post.threadId, childId: post.userId })
  },
  async updatePost ({ commit, state }, { text, id }) {
    const post = {
      text,
      edited: {
        at: firebase.firestore.FieldValue.serverTimestamp(),
        by: state.authId,
        moderated: false
      }
    }
    const postRef = firebase.firestore().collection('posts').doc(id)
    await postRef.update(post)
    const updatedPost = await postRef.get()
    commit('setItem', { item: updatedPost, resource: 'posts' })
  },
  updateUser ({ commit }, user) {
    commit('setItem', { item: user, resource: 'users' })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    // const threadId = `threadId-${Math.floor(Math.random() * 1000000)}`
    const userId = state.authId
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
    commit('setItem', { item: { ...newThread.data(), id: newThread.id }, resource: 'threads' })
    commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id })
    commit('appendThreadToUser', { childId: threadRef.id, parentId: userId })
    await dispatch('createPost', { threadId: threadRef.id, text })
    return state.threads.find(t => t.id === threadRef.id)
  },
  async updateThread ({ commit, state }, { text, title, id }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
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
    commit('setItem', { item: newThread, resource: 'threads' })
    commit('setItem', { item: newPost, resource: 'posts' })
    return docToResource(newThread)
  },
  fetchThread ({ dispatch }, { id }) {
    return dispatch('fetchItem', { id, resource: 'threads' })
  },
  fetchUser ({ dispatch }, { id }) {
    return dispatch('fetchItem', { id, resource: 'users' })
  },
  fetchPost ({ dispatch }, { id }) {
    return dispatch('fetchItem', { id, resource: 'posts' })
  },
  fetchForum ({ dispatch }, { id }) {
    return dispatch('fetchItem', { id, resource: 'forums' })
  },
  fetchCategory ({ dispatch }, { id }) {
    return dispatch('fetchItem', { id, resource: 'categories' })
  },
  fetchThreads ({ dispatch }, { ids }) {
    return dispatch('fetchItems', { ids, resource: 'threads' })
  },
  fetchUsers ({ dispatch }, { ids }) {
    return dispatch('fetchItems', { ids, resource: 'users' })
  },
  fetchPosts ({ dispatch }, { ids }) {
    return dispatch('fetchItems', { ids, resource: 'posts' })
  },
  fetchForums ({ dispatch }, { ids }) {
    return dispatch('fetchItems', { ids, resource: 'forums' })
  },
  fetchCategories ({ dispatch }, { ids }) {
    return dispatch('fetchItems', { ids, resource: 'categories' })
  },
  fetchItem ({ commit }, { id, resource }) {
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        const item = { id, ...doc.data() }
        commit('setItem', { item, resource })
        return resolve(item)
      })
      commit('appendUnsubscribe', { unsubscribe })
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
  },
  fetchAllCategories ({ commit }) {
    return new Promise((resolve) => {
      firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
        const categories = querySnapshot.docs.map(doc => {
          const item = { id: doc.id, ...doc.data() }
          commit('setItem', { resource: 'categories', item })
          return item
        })
        return resolve(categories)
      })
    })
  },
  fetchAuthUser ({ dispatch, state }) {
    return dispatch('fetchItem', { id: state.authId, resource: 'users' })
  }
}
