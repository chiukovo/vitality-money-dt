<template lang='pug'>
.history-content
  Dialog(
    :click-type="dialog.clickType",
    :visible.sync="dialog.isOpen"
    :title="dialog.title"
    :size="dialog.size")
  .history-content__header(id="commodityHeader")
    .linesp-wrap.statistics
      button.button__white(@click="openModal('storedRecords', '儲值記錄')") 儲值記錄查詢
      .linesp 昨日權益數
        span(:class="getMoneyColor(userInfo.YesterdayInterestNum)") {{ userInfo.YesterdayInterestNum | currency }}
      .linesp 今日損益
        span(:class="getMoneyColor(todayLoseWin)") {{ todayLoseWin | currency }}
      .linesp 可用餘額
        span(:class="getMoneyColor(canUseMoney)") {{ canUseMoney | currency }}
      .linesp 總權益數
        span(:class="getMoneyColor(totalInterestNum)") {{ totalInterestNum | currency }}
  #commodity.history-content__body(:style="{height: $parent.height.commodity}")
    table.custom__table.table__dark
      thead.thead
        tr
          th 商品名稱
          th 總多
          th 總空
          th 未平倉
          th 總口數
          th 手續費合計
          th 損益
          th 留倉預扣
      tbody.tbody(@scroll="tbodyScroll('commodity')")
        tr(v-for="row in $store.state.commodity")
          td(field="Name" title='商品名稱') {{ row.Name }}
          td
            span.text__danger {{ row.TotalBuySubmit }}
          td
            span.text__success {{ row.TotalSellSubmit }}
          td
            span(class="cell text__center bg__danger" v-if="row.RemainingBuyStock - row.RemainingSellStock > 0") {{ row.RemainingBuyStock - row.RemainingSellStock }}
            span(class="cell text__center bg__success" v-else) {{ Math.abs(row.RemainingBuyStock - row.RemainingSellStock) }}
          td {{ row.TotalSubmit }}
          td {{ row.TotalFee }}
          td
            span.text__success(v-if="row.TodayMoney < 0") {{ row.TodayMoney }}
            span.text__danger(v-else) {{ row.TodayMoney }}
          td
            span.text__success(v-if="row.RemainingWithholding < 0") {{ row.RemainingWithholding}}
            span.text__danger(v-else) {{ row.RemainingWithholding}}
</template>

<script>

import { mapState } from 'vuex'
import Dialog from "~/components/Dialog"

export default {
  data() {
    return {
      dialog: {
        clickType: '',
        isOpen: false,
        title: '',
        size: '',
      },
    }
  },
  mounted() {
    const _this = this

    _this.$nextTick(function() {
      _this.computedTableContent('commodity')
    })
  },
  components: {
    Dialog,
  },
  computed: mapState([
    'userInfo',
    'todayLoseWin',
    'canUseMoney',
    'totalInterestNum',
    'nowMoney',
  ]),
  methods: {
    checkRowShow({row, index}) {
      if (!row.show && !this.checked) {
        return 'hide'
      }
    },
    openModal(type, title, size) {
      this.dialog.size = ''
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true

      if (typeof size != 'undefined') {
        this.dialog.size = size
      }
    },
  }
}
</script>