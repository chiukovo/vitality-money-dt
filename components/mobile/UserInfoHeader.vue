<template lang='pug'>
  ul.userInfo-list
    li
      span.label 預設額度:
      span {{ userInfo.TouchPoint | currency }}
    li
      span.label 帳戶餘額:
      span(:class="userInfo.Money < userInfo.TouchPoint ? 'text__danger' : 'text__success'") {{ userInfo.Money | currency}}
    li
      span.label 今日損益:
      span(:class="userInfo.TodayMoney < 0 ? 'text__success' : 'text__danger'")  {{ userInfo.TodayMoney | currency }}
    li
      span.label 信用額度:
      span  {{ userInfo.TouchPoint | currency }}
    li
      span.label 對匯額度:
      span  {{ userInfo.ContrastPoint | currency }}
    li
      span.label 極贏額度:
      span  {{ userInfo.SuperPoint | currency }}
    li
      span.label 全商品持倉上限:
      span  {{ userInfo.AllStoreLimit }}
    li
      span.label 全商品每筆上限:
      span  {{ userInfo.DaySubmitLimit }}
    li
      span.label 全商品留倉上限:
      span  {{ userInfo.AllRemainingLimit }}
    li
      span.label 全商品留倉天數:
      span  {{ userInfo.AllDayRemaingDayLimit }}
    li
      span.label 下單前是否確認:
      span  {{ userInfo.SubmitConfirm ? '是' : '否' }}
    li
      span.label 成交是否回報:
      span  {{ userInfo.SuccessConfirm ? '是' : '否' }}
    li
      span.label 結算時間:
      span  {{ userInfo.EndTime }}
    li
      span.label 報價模式:
      span  {{ userInfo.PriceMode == 0 ? '整數報價' : '完整報價' }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'userInfo',
  ]),
  methods: {
  }
}
</script>