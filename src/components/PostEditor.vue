<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
          <textarea
            v-model="text"
            class="form-input"
          />
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PostEditor',
  data () {
    return {
      text: ''
    }
  },
  methods: {
    save () {
      const postId = `id-${Math.floor(Math.random() * 1000000)}`
      const post = {
        id: postId,
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        userId: '38St7Q8Zi2N1SPa5ahzssq9kbyp1'
      }
      this.$emit('save', { post })
      this.text = ''
    }
  }
}
</script>

<style scoped>

</style>
