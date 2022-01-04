<template>
  <vee-form @submit="save">
    <app-form-field
      name="title" v-model="form.title" label="Title"
      rules="required"
    />

    <app-form-field
      name="content" v-model="form.text" label="Content"
      rules="required" as="textarea"
      rows="8" cols="140"
    />

    <div class="btn-group">
      <button @click="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">{{ existing ? 'Update' : 'Publish' }}</button>
    </div>
  </vee-form>
</template>

<script>
import AppFormField from '@/components/AppFormField'
export default {
  name: 'ThreadEditor',
  components: { AppFormField },
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
