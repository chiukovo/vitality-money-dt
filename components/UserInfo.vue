<template lang='pug'>
.userInfo(:style="computedH()")
  .valuearrow
    button.arrow__down(@click="changeStyle('down')")
    button.arrow__up(@click="changeStyle('up')")
  .userInfo__account(v-show="style != 0") {{ userInfo.Account }}
  div(v-if="style == 0")
  div(v-if="style == 1")
    .userInfo-balance__title 可用餘額
    .userInfo-balance__num {{ userInfo.Money }}
  div(v-if="style == 2")
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
      styleHeight: '60px'
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

      this.computedH()
      this.$store.commit('setUserInfoStyleHeight', this.styleHeight)
    },
    computedH() {
      if (this.style == 0) {
        this.styleHeight = '20px'
      } else if (this.style == 1) {
        this.styleHeight = '60px'
      } else if (this.style == 2) {
        this.styleHeight = '120px'
      }

      return 'height: ' + this.styleHeight
    }
  }
}
</script>