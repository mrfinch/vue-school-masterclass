<template>
  <div class="col-full">
    <vee-form @submit="save" :key="formKey">
      <app-form-field
        v-model="postCopy.text" as="textarea"
        name="text" rows="10" cols="30"
        rules="required"
      />
      <div class="form-actions">
        <button class="btn-blue">{{ post.id ? 'Update Post' : 'Submit post' }}</button>
      </div>
    </vee-form>
  </div>
</template>

<script>
import AppFormField from '@/components/AppFormField'
export default {
  name: 'PostEditor',
  components: { AppFormField },
  props: {
    post: {
      type: Object,
      default: () => ({ text: null })
    }
  },
  data () {
    return {
      postCopy: { ...this.post },
      formKey: Math.random()
    }
  },
  methods: {
    save () {
      this.$emit('save', { post: this.postCopy })
      this.postCopy.text = ''
      this.formKey = Math.random()
    }
  }
}
</script>

<style scoped>

</style>
