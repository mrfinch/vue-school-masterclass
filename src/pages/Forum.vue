<template>
  <div class="col-full push-top" v-if="asyncDataStatus_ready && forum">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }" class="btn-green btn-small">Start a thread</router-link>
    </div>
  </div>

  <div class="col-full push-top" v-if="threads">
    <thread-list :threads="threads" />
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  name: 'Forum',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    ThreadList
  },
  mixins: [
    asyncDataStatus
  ],
  computed: {
    forum () {
      return this.$store.state.forums.find(f => f.id === this.id)
    },
    threads () {
      return this.forum?.threads.map(t => this.$store.getters.thread(t))
    }
  },
  async created () {
    const forum = await this.$store.dispatch('fetchForum', { id: this.id })
    const threadIds = forum.threads
    const threads = await this.$store.dispatch('fetchThreads', { ids: threadIds })
    const userIds = threads.map(t => t.userId)
    await this.$store.dispatch('fetchUsers', { ids: userIds })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
