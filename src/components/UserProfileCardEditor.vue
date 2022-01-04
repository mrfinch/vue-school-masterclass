<template>
  <div class="profile-card">
    <vee-form @submit="save">
      <p class="text-center avatar-edit">
        <label>
          <app-avatar-img :src="activeUser.avatar" :alt="user.name" class="avatar-xlarge img-update" />
          <span class="avatar-upload-overlay">
            <app-spinner v-if="uploadingImage" color="white" />
            <fa v-else icon="camera" size="3x" :style="{ color: 'white', opacity: '8' }" />
          </span>
          <input type="file" id="avatar" accept="image/*" v-show="false" @change="handleAvatarUpload" />
        </label>
      </p>

      <div class="form-group">
        <input type="text" placeholder="Username" class="form-input text-lead text-bold" v-model="activeUser.username">
      </div>

      <div class="form-group">
        <input type="text" placeholder="Full Name" class="form-input text-lead" v-model="activeUser.name">
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea class="form-input" id="user_bio" placeholder="Write a few words about yourself." v-model="activeUser.bio"></textarea>
      </div>

      <div class="stats">
        <span>{{user.postsCount}} posts</span>
        <span>{{user.threadsCount}} threads</span>
      </div>

      <hr>

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input autocomplete="off" class="form-input" id="user_website" v-model="activeUser.website">
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input autocomplete="off" class="form-input" id="user_email" v-model="activeUser.email">
      </div>

      <app-form-field
        label="Location" name="location"
        v-model="activeUser.location"
        list="locations"
        @mouseenter="loadLocationOptions"
      />
      <datalist id="locations">
        <option v-for="location in locationOptions" :value="location.name.common" :key="location.name.common" />
      </datalist>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </vee-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppSpinner from '@/components/AppSpinner'
import AppAvatarImg from '@/components/AppAvatarImg'
import AppFormField from '@/components/AppFormField'
export default {
  name: 'UserProfileCardEditor',
  components: { AppFormField, AppAvatarImg, AppSpinner },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      uploadingImage: false,
      activeUser: { ...this.user },
      locationOptions: []
    }
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async loadLocationOptions () {
      if (this.locationOptions.length) return
      const res = await fetch('https://restcountries.com/v3/all')
      this.locationOptions = await res.json()
    },
    async handleAvatarUpload (e) {
      this.uploadingImage = true
      const file = e.target.files[0]
      const uploadedImage = await this.uploadAvatar({ file })
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar
      this.uploadingImage = false
    },
    save () {
      console.log('save')
      this.$store.dispatch('users/updateUser', { ...this.activeUser })
      this.$router.push({ name: 'Profile' })
    },
    cancel () {
      console.log('cancel')
      this.$router.push({ name: 'Profile' })
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>

<style scoped>

</style>
