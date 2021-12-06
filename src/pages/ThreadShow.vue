<template>
  <div v-if="asyncDataStatus_ready && thread" class="col-large push-top">
    <h1>
      {{thread.title}}
      <router-link
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
    <post-editor @save="addPost" />
  </div>
</template>

<script>

import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import AppDate from '@/components/AppDate'
import asyncDataStatus from '@/mixins/asyncDataStatus'
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
  computed: {
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    },
    thread () {
      return this.$store.getters.thread(this.id)
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
      this.$store.dispatch('createPost', post)
    }
  },
  beforeCreate () {
    // props wont be set so id will be undefined
  },
  async created () {
    const thread = await this.$store.dispatch('fetchThread', { id: this.id })
    await this.$store.dispatch('fetchUser', { id: thread.userId })

    const posts = await this.$store.dispatch('fetchPosts', { ids: thread.posts })
    const userIds = posts.map(p => p.userId)
    await this.$store.dispatch('fetchUsers', { ids: userIds })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
