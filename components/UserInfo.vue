<template lang='pug'>
.userInfo(:style="computedH()")
  .valuearrow
    button.arrow__down(@click="changeStyle('down')")
    button.arrow__up(@click="changeStyle('up')")
  .userInfo__account(v-show="style != 0")
    span {{ userInfo.Account }}
    .badge.badge-warning(:style="checkAcctColor(userInfo.State)" style="margin-left: 5px") {{ userInfo.State }}
  div(v-if="style == 0")
  div(v-if="style == 1")
    .userInfo-balance__title 帳戶餘額
    .userInfo-balance__num {{ nowMoney | currency }}
  div(v-if="style == 2")
    table.userInfo-balance-table
      tbody
        tr
          th 昨日權益數
          td
            span(:class="getMoneyColor(userInfo.YesterdayInterestNum)") {{ userInfo.YesterdayInterestNum | currency }}
        tr
          th 今日損益
          td
            span(:class="getMoneyColor(todayLoseWin)") {{ todayLoseWin | currency }}
        tr
          th 可用餘額
          td
            span(:class="getMoneyColor(canUseMoney)") {{ canUseMoney | currency }}
        tr
          th 強平額度
          td
            span(:class="getMoneyColor(userInfo.CoverMoney)") {{ userInfo.CoverMoney | currency }}
        tr
          th 留倉保證金
          td
            span(:class="getMoneyColor(userInfo.WithholdingMoney)") {{ userInfo.WithholdingMoney | currency }}
        tr
          th 總權益數
          td
            span(:class="getMoneyColor(totalInterestNum)") {{ totalInterestNum | currency }}
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
    'todayLoseWin',
    'canUseMoney',
    'totalInterestNum',
    'nowMoney',
  ]),
  methods: {
    checkAcctColor(state) {
      if (state == '正常') {
        return 'background: #28a745'
      }

      if (state == '凍結') {
        return 'background: #0062cc'
      }

      if (state == '停用') {
        return 'background: #dc3545'
      }
    },
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
        this.styleHeight = '230px'
      }

      return 'height: ' + this.styleHeight
    }
  }
}
</script>