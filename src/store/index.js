import { createStore } from 'vuex'
import sourceData from '@/data.json'
import { findById, upsert } from '@/helpers'

export default createStore({
  state: {
    ...sourceData,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser: state => {
      const user = findById(state.users, state.authId)
      if (!user) {
        return null
      }
      return {
        ...user,
        get posts () {
          return state.posts.filter(p => p.userId === user.id)
        },
        get postsCount () {
          return this.posts.length
        },
        get threads () {
          return state.threads.filter(t => t.userId === user.id)
        },
        get threadsCount () {
          return this.threads.length
        }
      }
    }
  },
  actions: {
    createPost ({ commit, state }, post) {
      const postId = `postId-${Math.floor(Math.random() * 1000000)}`
      post.id = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post })
      commit('appendPostToThread', { threadId: post.threadId, postId })
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    },
    async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
      const threadId = `threadId-${Math.floor(Math.random() * 1000000)}`
      const userId = state.authId
      const thread = {
        forumId,
        title,
        publishedAt: Math.floor(Date.now() / 1000),
        userId,
        id: threadId
      }
      commit('setThread', { thread })
      commit('appendThreadToForum', { forumId, threadId })
      commit('appendThreadToUser', { threadId, userId })
      dispatch('createPost', { threadId, text })
      return state.threads.find(t => t.id === threadId)
    },
    async updateThread ({ commit, state }, { text, title, id }) {
      const thread = state.threads.find(t => t.id === id)
      const post = state.posts.find(p => p.id === thread.posts[0])
      const newThread = { ...thread, title }
      const newPost = { ...post, text }
      commit('setThread', { thread: newThread })
      commit('setPost', { post: newPost })
      return newThread
    }
  },
  mutations: {
    setPost (state, { post }) {
      upsert(state.posts, post)
    },
    setThread (state, { thread }) {
      upsert(state.threads, thread)
    },
    setUser (state, { user, userId }) {
      const userIndex = state.users.findIndex(u => u.id === userId)
      state.users[userIndex] = user
    },
    appendPostToThread (state, { threadId, postId }) {
      const thread = findById(state.threads, threadId)
      thread.posts ||= []
      thread.posts.push(postId)
    },
    appendThreadToForum (state, { forumId, threadId }) {
      const forum = findById(state.forums, forumId)
      forum.posts ||= []
      forum.posts.push(threadId)
    },
    appendThreadToUser (state, { threadId, userId }) {
      const user = findById(state.users, userId)
      user.posts ||= []
      user.posts.push(threadId)
    }
  }
})
