<template lang='pug'>
.history-content
  .history-content__header
    .linesp-wrap
      .badge.badge-warning {{ nowMainItem.product_name }}
      .linesp 昨收
        span.number {{ nowMainItem.yesterday_close_price }}
      .linesp 開
        span(:class="checkNumberColor(nowMainItem.open_price)") {{ nowMainItem.open_price }}
      .linesp 高
        span(:class="checkNumberColor(nowMainItem.highest_price)") {{ nowMainItem.highest_price }}
      .linesp 低
        span(:class="checkNumberColor(nowMainItem.lowest_price)") {{ nowMainItem.lowest_price }}
      .linesp 成交
        span(:class="checkNumberColor(nowMainItem.newest_price)") {{ nowMainItem.newest_price }}
      .linesp 漲跌
        span
          .change-icon
            .icon-arrow(:class="nowMainItem.gain > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
          div(style="display: inline" :class="nowMainItem.gain > 0 ? 'text__danger' : 'text__success'") {{ nowMainItem.gain }}
  .history-content__body(style="height: calc(100% - 28px)")
    Kchart
</template>

<script>

import { mapState } from 'vuex'
import Kchart from "~/components/Kchart"

export default {
  name: 'app',
  computed: mapState({
    nowMainItem: 'nowMainItem',
    mainStyle: state => state.localStorage.customSetting.mainStyle,
  }),
  components: {
    Kchart,
  },
  methods: {
    checkNumberColor(target) {
      if (this.$store.state.nowMainItem.yesterday_close_price == target) {
        return 'number'
      }

      return this.$store.state.nowMainItem.yesterday_close_price < target ? 'text__success' : 'text__danger'
    },
  }
}
</script>