<template>
  <div class="col-full push-top" v-if="asyncDataStatus_ready && category">
    <div class="category-header">
      <div class="category-details">
        <h1>{{ category.name }}</h1>
      </div>
    </div>
  </div>

  <div class="col-full push-top">
    <forum-list :forums="forums" />
  </div>
</template>

<script>
import ForumList from '@/components/ForumList'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  name: 'Category',
  components: {
    ForumList
  },
  mixins: [
    asyncDataStatus
  ],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return this.$store.state.categories.items.find(c => c.id === this.id)
    },
    forums () {
      return this.$store.state.forums.items.filter(f => f.categoryId === this.id)
    }
  },
  methods: {
    ...mapActions('categories', ['fetchCategory']),
    ...mapActions('forums', ['fetchForums'])
  },
  async created () {
    // const category = await this.$store.dispatch('fetchCategory', { id: this.id })
    // this.$store.dispatch('fetchForums', { ids: category.forums })
    const category = await this.fetchCategory({ id: this.id })
    await this.fetchForums({ ids: category.forums })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
