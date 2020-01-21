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
  .history-content__body(:style="{height: $parent.height.commodity}")
    client-only
      vxe-table.table__dark(
        :data='$store.state.commodity'
        :row-class-name="checkRowShow"
        max-width="100%"
        height="100%"
        size="mini"
        column-min-width="60"
        align="center"
        stripe
        border
        auto-resize
        highlight-hover-row
        highlight-current-row)
        vxe-table-column(field="Name" title='商品名稱')
        vxe-table-column(title='總多')
          template(slot-scope='scope')
            span.text__danger {{ scope.row.TotalBuySubmit }}
        vxe-table-column(title='總空')
          template(slot-scope='scope')
            span.text__success {{ scope.row.TotalSellSubmit }}
        vxe-table-column(title='未平倉')
          template(slot-scope='scope')
            span(class="text__center bg__danger" v-if="scope.row.RemainingBuyStock - scope.row.RemainingSellStock > 0") {{ scope.row.RemainingBuyStock - scope.row.RemainingSellStock }}
            span(class="text__center bg__success" v-else) {{ Math.abs(scope.row.RemainingBuyStock - scope.row.RemainingSellStock) }}
        vxe-table-column(field="TotalSubmit" title='總口數')
        vxe-table-column(field="TotalFee" title='手續費合計')
        vxe-table-column(title='損益')
          template(slot-scope='scope')
            span.text__success(v-if="scope.row.TodayMoney < 0") {{ scope.row.TodayMoney}}
            span.text__danger(v-else) {{ scope.row.TodayMoney}}
        vxe-table-column(title='留倉預扣')
          template(slot-scope='scope')
            span.text__success(v-if="scope.row.RemainingWithholding < 0") {{ scope.row.RemainingWithholding}}
            span.text__danger(v-else) {{ scope.row.RemainingWithholding}}
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