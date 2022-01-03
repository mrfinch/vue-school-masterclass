<template>
  <div class="notifications">
    <transition-group name="notification">
      <div class="notification"
        v-for="notification in notifications"
        :key="notification.id"
        :class="`notification-type-${notification.type}`"
      >
        <span>{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)">X</button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import useNotifications from '@/composables/useNotifications'
export default {
  name: 'AppNotifications',
  setup () {
    const { notifications, removeNotification } = useNotifications()
    return { notifications, removeNotification }
  }
}
</script>

<style scoped>

</style>
