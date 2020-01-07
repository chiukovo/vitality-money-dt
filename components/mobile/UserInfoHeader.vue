<template lang='pug'>
  ul.userInfo-list
    li
      span.label 帳戶餘額:
      span(:class="nowMoney < userInfo.TouchPoint ? 'text__danger' : 'text__success'") {{ nowMoney | currency }}
    li
      span.label 今日損益:
      span(:class="getMoneyColor(todayLoseWin)") {{ todayLoseWin | currency }}
    li
      span.label 可用餘額:
      span(:class="getMoneyColor(canUseMoney)") {{ canUseMoney | currency }}
    li
      span.label 強平額度:
      span(:class="getMoneyColor(userInfo.CoverMoney)") {{ userInfo.CoverMoney | currency }}
    li
      span.label 留倉保證金:
      span(:class="getMoneyColor(userInfo.WithholdingMoney)") {{ userInfo.WithholdingMoney | currency }}
    li
      span.label 總權益數:
      span(:class="getMoneyColor(totalInterestNum)") {{ totalInterestNum | currency }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'userInfo',
    'todayLoseWin',
    'canUseMoney',
    'totalInterestNum',
    'nowMoney',
  ]),
  methods: {
  }
}
</script>