<template>
  <the-nav-bar />
  <div>
    <router-view
      v-show="showPage"
      @ready="onPageReady"
      :key="`${$route.path}${JSON.stringify($route.query)}`"
    />
    <app-spinner v-show="!showPage" class="container" />
  </div>
  <app-notifications />
</template>

<script>
import TheNavBar from '@/components/TheNavBar'
import { mapActions } from 'vuex'
import AppSpinner from '@/components/AppSpinner'
import NProgress from 'nprogress'
import AppNotifications from '@/components/AppNotifications'
export default {
  name: 'App',
  components: { TheNavBar, AppSpinner, AppNotifications },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions('auth', ['fetchAuthUser']),
    onPageReady () {
      this.showPage = true
      NProgress.done()
    }
  },
  created () {
    this.fetchAuthUser()
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    this.$router.beforeEach(() => {
      this.showPage = false
      NProgress.start()
    })
  }
}
</script>

<style>
@import "assets/style.css";
@import "~nprogress/nprogress.css";
</style>
