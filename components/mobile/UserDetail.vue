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
      .collapse
        .collapse__header 商品資訊
        .dialog__content
          ul.collapse__list_theme2
            li(v-for="item in items")
              div {{ item.Name }}
              div
                ul
                  li
                    span.label 開盤風控點數:
                    |{{ item.OpenMaxPoint }}
                  li
                    span.label 手續費:
                    |{{ item.Fee }}
                  li
                    span.label 每點價格:
                    |{{ item.PointMoney }}
                  li
                    span.label 最小跳動點:
                    |{{ item.TradePoint }}
                  li
                    span.label 最小損益點:
                    |{{ item.StopPoint }}
                  li
                    span.label 限價單平倉限制:
                    |{{ item.LimitCoverPoint }}
              div
                ul
                  li
                    span.label 最大口數:
                    |{{ item.SubmitMax }}
                  li
                    span.label 留倉上限:
                    |{{ item.RemaingLimit }}
                  li
                    span.label 留倉天數:
                    |{{ item.RemaingDayLimit }}
                  li
                    span.label 禁新:
                    |{{ item.NotNewPercent }}
                  li
                    span.label 強平:
                    |{{ item.CoverPercent }}
                  li
                    span.label 狀態:
                    |{{ item.State }}
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
    'todayLoseWin',
    'canUseMoney',
    'totalInterestNum',
    'nowMoney',
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