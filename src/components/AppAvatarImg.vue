<template>
  <img :src="src || '/user-placeholder.png'" />
</template>

<script>
export default {
  name: 'AppAvatarImg',
  props: {
    src: {
      type: String
    }
  }
}
</script>

<style scoped>

</style>
