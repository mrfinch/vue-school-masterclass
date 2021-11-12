<template>
  <div class="col-full push-top">
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
import sourceData from '@/data.json'
import ForumList from '@/components/ForumList'
export default {
  name: 'Category',
  components: {
    ForumList
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return sourceData.categories.find(c => c.id === this.id)
    },
    forums () {
      return sourceData.forums.filter(f => f.categoryId === this.id)
    }
  }
}
</script>

<style scoped>

</style>
