<template>
  <span :title="humanFriendlyFormat">
    {{ diffForHumans }}
  </span>
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export default {
  name: 'AppDate',
  props: {
    timestamp: {
      type: [Number, Object],
      required: true
    }
  },
  computed: {
    normalizedTimestamp () {
      return this.timestamp?.seconds || this.timestamp
    },
    diffForHumans () {
      return dayjs.unix(this.normalizedTimestamp).fromNow()
    },
    humanFriendlyFormat () {
      return dayjs.unix(this.normalizedTimestamp).format('llll')
    }
  }
}
</script>

<style scoped>

</style>
