<template>
  <span :title="humanFriendlyFormat()">
    {{ diffForHumans() }}
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
      type: Number,
      required: true
    }
  },
  methods: {
    diffForHumans () {
      return dayjs.unix(this.timestamp).fromNow()
    },
    humanFriendlyFormat () {
      return dayjs.unix(this.timestamp).format('llll')
    }
  }
}
</script>

<style scoped>

</style>
