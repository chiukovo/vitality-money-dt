<template lang='pug'>
.userInfo
  .valuearrow
    button.arrow__down(@click="changeStyle('down')")
    button.arrow__up(@click="changeStyle('up')")
  .userInfo__account(v-show="style != 0") {{ userInfo.Account }}
  div(v-show="style == 0")
  div(v-show="style == 1")
    .userInfo-balance__title 可用餘額
    .userInfo-balance__num {{ userInfo.Money }}
  div(v-show="style == 2")
    table.userInfo-balance-table
      tbody
        tr
          th 今日損益
          td {{ userInfo.TodayMoney }}
        tr
          th 可用餘額
          td {{ userInfo.Money }}
        tr
          th 預設額度
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