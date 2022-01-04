<template>
  <div class="flex-grid justify-center">
    <div class="col-2">

      <vee-form @submit="signIn" class="card card-form">
        <h1 class="text-center">Login</h1>

        <app-form-field
          v-model="form.email" name="email" label="Email"
          rules="required|email" type="email"
        />
        <app-form-field
          v-model="form.password" name="password" label="Password"
          type="password" rules="required"
        />

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{ name: 'Register' }">Create an account?</router-link>
        </div>
      </vee-form>

      <div class="push-top text-center">
        <button @click="signInWithGoogle" class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign in with Google</button>
      </div>
    </div>
  </div>
</template>

<script>
import AppFormField from '@/components/AppFormField'
export default {
  name: 'SignIn',
  components: { AppFormField },
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async signIn () {
      try {
        await this.$store.dispatch('auth/signInWithEmailAndPassword', { ...this.form })
        this.successRedirect()
      } catch (err) {
        alert(err.message)
      }
    },
    async signInWithGoogle () {
      try {
        await this.$store.dispatch('auth/signInWithGoogle')
        this.successRedirect()
      } catch (err) {
        alert(err.message)
      }
    },
    successRedirect () {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' }
      this.$router.push(redirectTo)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>

<style scoped>

</style>
