<template>
  <div v-if="asyncDataStatus_ready && thread" class="col-large push-top">
    <h1>
      {{thread.title}}
      <router-link
        v-if="thread.user === authUser?.id"
        :to="{ name: 'ThreadEdit', params: { threadId: this.id }}"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By <a href="#">{{ thread.author?.name }}</a>, <app-date :timestamp="thread.publishedAt" />
      <span
        class="hide-mobile text-faded text-small"
        style="float: right; margin-top: 2px;"
      >
        {{ thread.repliesCount }} replies by {{ thread.contributorsCount }} contributors
      </span>
    </p>

    <post-list
      :posts="threadPosts"
    />
    <post-editor v-if="authUser" @save="addPost" />
    <div v-else class="text-center">
      <router-link :to="{ name: 'SignIn', query: { redirectTo: $route.path } }">Sign In</router-link> or <router-link :to="{ name: 'Register', query: { redirectTo: $route.path } }">Register</router-link> to reply
    </div>
  </div>
</template>

<script>

import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import AppDate from '@/components/AppDate'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import { mapGetters } from 'vuex'
import useNotifications from '@/composables/useNotifications'
import difference from 'lodash/difference'
export default {
  name: 'PageThreadShow',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    AppDate,
    PostList,
    PostEditor
  },
  mixins: [
    asyncDataStatus
  ],
  setup () {
    const { addNotification } = useNotifications()
    return {
      addNotification
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    threads () {
      return this.$store.state.threads.items
    },
    posts () {
      return this.$store.state.posts.items
    },
    thread () {
      return this.$store.getters['threads/thread'](this.id)
    },
    threadPosts () {
      return this.posts.filter(p => p.threadId === this.id)
    }
  },
  methods: {
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.$store.dispatch('posts/createPost', post)
    },
    async fetchPostsWithUsers (ids) {
      const posts = await this.$store.dispatch(
        'posts/fetchPosts',
        {
          ids,
          onSnapshot: ({ isLocal, previousItem }) => {
            if (!this.asyncDataStatus_ready || isLocal || (previousItem?.edited || !previousItem?.edited?.at)) return
            this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
          }
        }
      )
      const userIds = posts.map(p => p.userId).concat(this.thread.userId)
      await this.$store.dispatch('users/fetchUsers', { ids: userIds })
    }
  },
  beforeCreate () {
    // props wont be set so id will be undefined
  },
  async created () {
    const thread = await this.$store.dispatch(
      'threads/fetchThread',
      {
        id: this.id,
        onSnapshot: ({ isLocal, item, previousItem }) => {
          if (!this.asyncDataStatus_ready || isLocal) return
          const newPostIds = difference(item.posts, previousItem.posts)
          const hasNewPosts = newPostIds.length > 0
          if (hasNewPosts) {
            this.fetchPostsWithUsers(newPostIds)
          } else {
            this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
          }
        }
      }
    )
    await this.$store.dispatch('users/fetchUser', { id: thread.userId })
    await this.fetchPostsWithUsers(thread.posts)
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
