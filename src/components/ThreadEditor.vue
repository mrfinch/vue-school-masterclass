<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input type="text" id="thread_title" class="form-input" name="title" v-model="form.title">
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea id="thread_content" class="form-input" name="content" rows="8" cols="140" v-model="form.text"></textarea>
    </div>

    <div class="btn-group">
      <button @click="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">{{ existing ? 'Update' : 'Publish' }}</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ThreadEditor',
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        text: this.text,
        title: this.title
      }
    }
  },
  computed: {
    existing () {
      return !!this.title
    }
  },
  methods: {
    save () {
      this.$emit('clean')
      this.$emit('save', {
        text: this.form.text,
        title: this.form.title
      })
    },
    cancel () {
      this.$emit('cancel')
    }
  },
  watch: {
    form: {
      handler () {
        if (this.form.title !== this.title || this.form.text !== this.text) {
          this.$emit('dirty')
        } else {
          this.$emit('clean')
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
