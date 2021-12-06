<template>
  <div class="col-full push-top" v-if="asyncDataStatus_ready && forum">

    <h1>Create new thread in <i>{{forum.name}}</i></h1>

    <thread-editor @save="save" @cancel="cancel" />
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  name: 'ThreadCreate',
  components: {
    ThreadEditor
  },
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums.find(f => f.id === this.forumId)
    }
  },
  mixins: [
    asyncDataStatus
  ],
  methods: {
    ...mapActions(['createThread', 'fetchForum']),
    async save ({ title, text }) {
      const thread = await this.createThread({ text, title, forumId: this.forum.id })
      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { id: this.forumId } })
    }
  },
  async created () {
    await this.fetchForum({ id: this.forumId })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
