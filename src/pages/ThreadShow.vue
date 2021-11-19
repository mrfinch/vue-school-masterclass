<template>
  <div class="col-large push-top">
    <h1>
      {{thread.title}}
      <router-link
        :to="{ name: 'ThreadEdit', params: { threadId: thread.id }}"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By <a href="#">{{ thread.author.name }}</a>, <app-date :timestamp="thread.publishedAt" />
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
  }
}
</script>

<style scoped>

</style>
