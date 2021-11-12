<template>
  <div class="col-full">
    <div class="forum-list">
<!--      <h2 class="list-title">-->
<!--        <a href="#">Forums</a>-->
<!--      </h2>-->
      <div class="forum-list">
        <div class="forum-listing" v-for="forum in forums" :key="forum.id">
          <div class="forum-details">
            <router-link class="text-xlarge" :to="{ name: 'Forum', params: { id: forum.id } }">
              {{ forum.name  }}
            </router-link>
            <p>{{ forum.description }}</p>
          </div>

          <div class="threads-count">
            <p><span class="count">{{ forum.threads?.length || 0 }}</span> {{ forum.threads?.length > 1 ? 'threads' : 'thread' }}</p>
          </div>

          <div class="last-thread"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForumList',
  props: {
    forums: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
