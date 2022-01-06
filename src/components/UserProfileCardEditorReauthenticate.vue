<template>
  <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal">
    <div class="modal-content">
      <h4>Login Again to Change Your Email</h4>
      <vee-form @submit="reauthenticate">
        <app-form-field
          name="reauth-email" label="Email" v-model="email"
          rules="email"
        />
        <app-form-field
          name="reauth-password" label="Password" v-model="password"
          rules="required|min:8" type="password"
        />
        <button class="btn btn-green btn-small">Login</button>
      </vee-form>
    </div>
  </vue-final-modal>
</template>

<script>
import AppFormField from '@/components/AppFormField'
import { VueFinalModal } from 'vue-final-modal'
export default {
  name: 'UserProfileCardEditorReauthenticate',
  components: { AppFormField, VueFinalModal },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    showModal: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    async reauthenticate () {
      try {
        await this.$store.dispatch('auth/reauthenticate', { email: this.email, password: this.password })
        this.$emit('success')
      } catch (err) {
        this.$emit('fail', err)
      }
    }
  }
}
</script>

<style scoped>

</style>
