<template>
  <div class="col-full push-top" v-if="asyncDataStatus_ready && thread">

    <h1>Editing <i>{{thread.title}}</i></h1>

    <thread-editor
      :title="thread.title" :text="text"
      @save="save" @cancel="cancel" :key="text"
    />
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  name: 'ThreadEdit',
  components: {
    ThreadEditor
  },
  props: {
    threadId: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return this.$store.state.threads.find(t => t.id === this.threadId)
    },
    text () {
      return this.$store.state.posts.find(p => p.id === this.thread.posts[0])?.text
    }
  },
  mixins: [
    asyncDataStatus
  ],
  methods: {
    async save ({ title, text }) {
      const thread = await this.$store.dispatch('updateThread', { text, title, id: this.threadId })
      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { threadId: this.threadId } })
    }
  },
  async created () {
    const thread = await this.$store.dispatch('fetchThread', { id: this.threadId })
    await this.$store.dispatch('fetchPost', { id: thread.posts[0] })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
