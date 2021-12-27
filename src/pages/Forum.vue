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
    <v-pagination
      v-model="page"
      :pages="totalPages"
      active-color="#57AD8D"
    />
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
  data () {
    return {
      page: parseInt(this.$route.query.page) || 1,
      perPage: 3
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
      return this.$store.state.forums.items.find(f => f.id === this.id)
    },
    threads () {
      return this.$store.state.threads.items.filter((t) => t.forumId === this.id)
        .map((t) => this.$store.getters['threads/thread'](t.id))
    },
    threadCount () {
      return this.forum?.threads.length || 0
    },
    totalPages () {
      return Math.ceil(this.threadCount / this.perPage)
    }
  },
  async created () {
    const forum = await this.$store.dispatch('forums/fetchForum', { id: this.id })
    const threadIds = forum.threads
    const threads = await this.$store.dispatch('threads/fetchThreadsByPage', { ids: threadIds, page: this.page, perPage: this.perPage })
    const userIds = threads.map(t => t.userId)
    await this.$store.dispatch('users/fetchUsers', { ids: userIds })
    this.asyncDataStatus_fetched()
  },
  watch: {
    async page (page) {
      this.$router.push({ query: { page } })
    }
  }
}
</script>

<style scoped>

</style>
