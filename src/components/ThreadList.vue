<template>
  <div class="col-full">
    <div class="thread-list">

      <h2 class="list-title">Threads</h2>

      <div v-if="threads.length">
        <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
<!--            <router-link :to="`/thread/${thread.id}`">{{ thread.title }}</router-link>-->
            <router-link v-if="thread.id" :to="{ name: 'ThreadShow', params: { id: thread.id } }">{{ thread.title }}</router-link>
          </p>
          <p class="text-faded text-xsmall" v-if="thread.id">
            By <a href="#">{{ userById(thread.userId).name }}</a>, <app-date :timestamp="thread.publishedAt" />.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">
            {{ thread.repliesCount }} replies
          </p>

          <app-avatar-img class="avatar-medium" :src="userById(thread.userId).avatar" />

          <div>
            <p class="text-xsmall">
              <a href="#">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded" v-if="thread.publishedAt"><app-date :timestamp="thread.publishedAt" /></p>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div v-if="!threads.length" style="padding: 10px; text-align: center;">
      <em>No threads available</em>
    </div>
  </div>
</template>

<script>
import AppDate from '@/components/AppDate'
import AppAvatarImg from '@/components/AppAvatarImg'
export default {
  name: 'ThreadList',
  components: {
    AppAvatarImg,
    AppDate
  },
  props: {
    threads: {
      type: Array,
      required: true
    }
  },
  computed: {
    users () {
      return this.$store.state.users.items
    }
  },
  methods: {
    userById (userId) {
      return this.users.find(u => u.id === userId) || {}
    }
  }
}
</script>

<style scoped>

</style>
