<template>
  <AppHead>
    <title>Vue.js Masterclass Forum</title>
    <meta name="description" content="Awesome vue.js forum">

    <!-- Social -->
    <meta property="og:title" content="Vue.js 3 Master Class Forum">
    <meta property="og:description" content="An Awesome Vue.js 3 powered forum!">
    <meta property="og:image" content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg">

    <!-- Twitter -->
    <meta name="twitter:title" content="Vue.js 3 Master Class Forum">
    <meta name="twitter:description" content="An Awesome Vue.js 3 powered forum!">
    <meta name="twitter:image" content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg">
    <meta name="twitter:card" content="summary_large_image">
  </AppHead>
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
