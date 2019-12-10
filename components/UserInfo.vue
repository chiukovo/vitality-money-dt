<template lang='pug'>
.userInfo
  div(style="position: fixed;z-index: 999;")
    button(@click="changeStyle('up')") ^
    button(@click="changeStyle('down')") v
    .userInfo-header(v-show="style != 0") {{ userInfo.Account }}
    div(v-show="style == 0")
    div(v-show="style == 1")
      span 可用餘額 {{ userInfo.Money }}
    div(v-show="style == 2")
      table
        tbody
          tr
            td 今日損益
            td {{ userInfo.TodayMoney }}
          tr
            td 可用餘額
            td {{ userInfo.Money }}
          tr
            td 預設額度
            td {{ userInfo.TouchPoint }}
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      style: 1,
    }
  },
  computed: mapState([
    'userInfo',
  ]),
  methods: {
    changeStyle(type) {
      if (type == 'up' && this.style != 2) {
        this.style++
      } else if (type == 'down' && this.style != 0) {
        this.style--
      }
    }
  }
}
</script>