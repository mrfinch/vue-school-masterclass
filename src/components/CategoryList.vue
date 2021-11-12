<template>
  <div class="col-full">
    <div class="category-list">
      <div v-for="category in categories" :key="category.id">
        <h3 class="list-title">
          <router-link :to="{ name: 'Category', params: { id: category.id }}">{{ category.name }}</router-link>
        </h3>
        <forum-list
          :forums="categoryForums(category.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ForumList from '@/components/ForumList'
export default {
  name: 'CategoryList',
  components: {
    ForumList
  },
  props: {
    categories: {
      type: Array,
      required: true
    },
    forums: {
      type: Array,
      required: true
    }
  },
  methods: {
    categoryForums (categoryId) {
      return this.forums.filter(f => f.categoryId === categoryId)
    }
  }
}
</script>

<style scoped>

</style>
