import { createStore } from 'vuex'
import sourceData from '@/data.json'
import { findById, upsert } from '@/helpers'

export default createStore({
  state: {
    ...sourceData,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: state => {
      return (id) => {
        const user = findById(state.users, id)
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
    thread: state => {
      return (id) => {
        const thread = findById(state.threads, id)
        return {
          ...thread,
          get author () {
            return findById(state.users, thread.userId)
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
  actions: {
    createPost ({ commit, state }, post) {
      const postId = `postId-${Math.floor(Math.random() * 1000000)}`
      post.id = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post })
      commit('appendPostToThread', { parentId: post.threadId, childId: postId })
      commit('appendContributorToThread', { parentId: post.threadId, childId: post.userId })
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
      commit('appendThreadToForum', { parentId: forumId, childId: threadId })
      commit('appendThreadToUser', { childId: threadId, parentId: userId })
      dispatch('createPost', { threadId, text })
      return state.threads.find(t => t.id === threadId)
    },
    async updateThread ({ commit, state }, { text, title, id }) {
      const thread = findById(state.threads, id)
      const post = findById(state.posts, thread.posts[0])
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
    appendPostToThread: appendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendThreadToForum: appendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: appendChildToParentMutation({ parent: 'users', child: 'threads' }),
    appendContributorToThread: appendChildToParentMutation({ parent: 'threads', child: 'contributors' })
  }
})

function appendChildToParentMutation ({ parent, child }) {
  return (state, { parentId, childId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] ||= []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
