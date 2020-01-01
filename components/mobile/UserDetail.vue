<template lang='pug'>
.modals.documents
  .header
    .header__left
      .page__title 會員資訊
    .header__title
    .header__right
      button.button.header-button.back(@click='$parent.systemShow = 0') 返回
  .main(style="height: calc(100% - 40px);overflow-y: auto;")
    .area
      .collapse
        ul.collapse__list
          li
            span.label 預設額度:
            span {{ userInfo.TouchPoint | currency }}
          li
            span.label 帳戶餘額:
            span(:class="userInfo.Money < userInfo.TouchPoint ? 'text__danger' : 'text__success'") {{ userInfo.Money | currency }}
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
      .collapse
        .collapse__header 商品資訊
        .dialog__content
          ul
            li(v-for="item in items" style="display: block;overflow: hidden;")
              div(style="float: left") {{ item.Name }}
              div(style="float: left")
                ul
                  li 每點價格: {{ item.PointMoney }}
                  li 持倉上限: {{ item.StoreLimit }}
                  li 開放0.1口: {{ item.DecimalSubmitEnable }}
                  li 小於一口手續費: {{ item.DecimalSubmitFee }}
                  li 60秒平倉手續費: {{ item.SixityFee }}
                  li 手續費(進/出): {{ item.Fee }}
                  li 單商品每筆上限: {{ item.SubmitMax }}
                  li 單商品留倉上限: {{ item.RemaingLimit }}
                  li 單商品留倉天數: {{ item.RemaingDayLimit }}
              div(style="float: left")
                ul
                  li 開盤最大漲跌: {{ item.OpenMaxPoint }}
                  li 每口最大漲跌: {{ item.SubmitMaxPoint }}
                  li 停損利: {{ item.StopPoint }}
                  li 禁新時間: {{ item.not_new_start_time1}} ~ {{ item.not_new_end_time1 }}
                  li 可下單時間:
                    span(v-html="item.TradeTime")
                  li 狀態: {{ item.State }}
                  li 禁新: {{ item.NotNewPercent }}
                  li 強平: {{ item.CoverPercent }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      items: [],
    }
  },
  mounted() {
    const sourceCommidyArray = this.$store.state.commidyArray
    this.getUserInfo(sourceCommidyArray)
  },
  computed: mapState([
    'commidyArray',
    'mainItem',
    'userInfo',
  ]),
  watch: {
    commidyArray(sourceCommidyArray) {
      this.getUserInfo(sourceCommidyArray)
    },
  },
  methods: {
    getUserInfo(sourceCommidyArray) {
      this.items = JSON.parse(JSON.stringify(sourceCommidyArray))
    }
  }
}
</script>