<template lang='pug'>
.userInfo(:style="computedH()")
  .valuearrow
    button.arrow__down(@click="changeStyle('down')")
    button.arrow__up(@click="changeStyle('up')")
  .userInfo__account(v-show="style != 0") {{ userInfo.Account }}
  div(v-if="style == 0")
  div(v-if="style == 1")
    .userInfo-balance__title 帳戶餘額
    .userInfo-balance__num {{ userInfo.Money | currency }}
  div(v-if="style == 2")
    table.userInfo-balance-table
      tbody
        tr
          th 今日損益
          td
            span(:class="getMoneyColor(userInfo.TodayMoney)") {{ userInfo.TodayMoney | currency }}
        tr
          th 可用餘額
          td
            span(:class="getMoneyColor(userInfo.Money)") {{ userInfo.Money | currency }}
        tr
          th 信用額度
          td
            span(:class="getMoneyColor(userInfo.TouchPoint)") {{ userInfo.TouchPoint | currency }}
        tr
          th 對匯額度
          td
            span(:class="getMoneyColor(userInfo.ContrastPoint)") {{ userInfo.ContrastPoint | currency }}
        tr
          th 極贏額度
          td
            span(:class="getMoneyColor(userInfo.SuperPoint)") {{ userInfo.SuperPoint | currency }}
        tr
          th 全商品持倉上限
          td {{ userInfo.AllStoreLimit }}
        tr
          th 全商品每筆上限
          td {{ userInfo.DaySubmitLimit }}
        tr
          th 全商品留倉上限
          td {{ userInfo.AllRemainingLimit }}
        tr
          th 全商品留倉天數
          td {{ userInfo.AllDayRemaingDayLimit }}
        tr
          th 下單前是否確認
          td {{ userInfo.SubmitConfirm ? '是' : '否' }}
        tr
          th 成交是否回報
          td {{ userInfo.SuccessConfirm ? '是' : '否' }}
        tr
          th 結算時間
          td {{ userInfo.EndTime }}
        tr
          th 報價模式
          td {{ userInfo.PriceMode == 0 ? '整數報價' : '完整報價' }}
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
        this.styleHeight = '420px'
      }

      return 'height: ' + this.styleHeight
    }
  }
}
</script>