<template lang='pug'>
.history-content
  .history-content__header(id="commodityHeader")
    .linesp-wrap.statistics
      button.button__white 儲值記錄查詢
      .linesp 預設額度
        span.number {{ $store.state.userInfo.TouchPoint | currency }}
      .linesp 今日損益
        span.text__success(v-if="$store.state.userInfo.TodayMoney < 0") {{ $store.state.userInfo.TodayMoney | currency }}
        span.text__danger(v-else) {{ $store.state.userInfo.TodayMoney | currency }}
      .linesp 留倉預扣
        span.number {{ $store.state.userInfo.WithholdingMoney | currency }}
      .linesp 帳戶餘額
        span.number.text__info {{ $store.state.userInfo.Money | currency }}
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
        highlight-current-row)
        vxe-table-column(field="Name" title='商品名稱')
        vxe-table-column(title='總多')
          template(slot-scope='scope')
            span.text__danger {{ scope.row.TotalBuySubmit　}}
        vxe-table-column(title='總空')
          template(slot-scope='scope')
            span.text__success {{ scope.row.TotalSellSubmit}}
        vxe-table-column(title='未平倉')
          template(slot-scope='scope')
            span(class="text__center bg__danger" v-if="scope.row.RemainingBuyStock - scope.row.RemainingSellStock > 0") {{ scope.row.RemainingBuyStock - scope.row.RemainingSellStock }}
            span(class="text__center bg__success" v-else) {{ scope.row.RemainingBuyStock - scope.row.RemainingSellStock }}
        vxe-table-column(field="TotalSubmit" title='總口數')
        vxe-table-column(field="TotalFee" title='手續費合計')
        vxe-table-column(title='損益')
          template(slot-scope='scope')
            span.text__success(v-if="scope.row.TotalPoint < 0") {{ scope.row.TotalPoint}}
            span.text__danger(v-else) {{ scope.row.TotalPoint}}
        vxe-table-column(title='留倉預扣')
          template(slot-scope='scope')
            span.text__success(v-if="scope.row.RemainingWithholding < 0") {{ scope.row.RemainingWithholding}}
            span.text__danger(v-else) {{ scope.row.RemainingWithholding}}
</template>

<script>

export default {
  data() {
    return {
    }
  },
  methods: {
    checkRowShow({row, index}) {
      if (!row.show && !this.checked) {
        return 'hide'
      }
    },
  }
}
</script>