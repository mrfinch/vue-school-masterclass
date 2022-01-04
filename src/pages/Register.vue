<template>
  <div class="container">

    <div class="flex-grid justify-center">
      <div class="col-2">

        <vee-form @submit="register" class="card card-form">
          <h1 class="text-center">Register</h1>

          <app-form-field
            v-model="form.name" name="name" label="Name"
            rules="required"
          />

          <app-form-field
            v-model="form.username" name="username" label="Username"
            rules="required|unique:users,username"
          />

          <app-form-field
            v-model="form.email" name="email" label="Email"
            :rules="{ required: true, email: true, unique: { collection: 'users', field: 'email' } }"
            type="email"
          />

          <app-form-field
            v-model="form.password" name="password" label="Password"
            rules="required|min:8"
            type="password"
          />

          <div class="form-group">
            <label for="avatar">
              Avatar
              <div v-if="avatarPreview">
                <img :src="avatarPreview" class="avatar-xlarge" />
              </div>
            </label>
            <vee-field
              name="avatar"
              v-show="!avatarPreview"
              @change="handleImageUpload"
              id="avatar"
              type="file"
              class="form-input"
              accept="image/*"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-blue btn-block">Register</button>
          </div>

        </vee-form>
        <div class="text-center push-top">
          <button @click="registerWithGoogle" class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign up with Google</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppFormField from '@/components/AppFormField'
export default {
  name: 'Register',
  components: {
    AppFormField
  },
  data () {
    return {
      avatarPreview: null,
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar: ''
      }
    }
  },
  methods: {
    async register () {
      await this.$store.dispatch('auth/registerUserWithEmailPassword', { ...this.form })
      this.$router.push('/')
    },
    async registerWithGoogle () {
      await this.$store.dispatch('auth/signInWithGoogle')
      this.$router.push('/')
    },
    handleImageUpload (e) {
      this.form.avatar = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        this.avatarPreview = event.target.result
      }
      reader.readAsDataURL(this.form.avatar)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>

<style scoped>

</style>
