<template lang='pug'>
.history-content
  .history-content__header(id="commodityHeader")
    .row
      .col-auto 預設額度:
        span.text__lg.text__bold {{ $store.state.userInfo.TouchPoint }}
      .col-auto 今日損益:
        //- colors class.text__danger | text__success
        span(v-if="$store.state.userInfo.TodayMoney < 0").text__lg.text__bold.text__danger {{ $store.state.userInfo.TodayMoney }}
        span(v-else).text__lg.text__bold.text__success {{ $store.state.userInfo.TodayMoney }}
      .col-auto 留倉預扣:
        span.text__lg.text__bold {{ $store.state.userInfo.WithholdingMoney }}
      .col-auto 帳戶餘額:
        span.text__lg.text__bold.text__info {{ $store.state.userInfo.Money }}
  .history-content__body(:style="{height: $parent.height.commodity}")
    client-only
      vxe-table(
        :data='$store.state.commodity'
        :row-class-name="checkRowShow"
        max-width="100%"
        height="100%"
        size="mini"
        column-min-width="60"
        align="center"
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
            <span class="bg__danger" v-if="scope.row.RemainingBuyStock - scope.row.RemainingSellStock > 0">{{ scope.row.RemainingBuyStock - scope.row.RemainingSellStock }}</span>
            <span class="bg__success" v-else>{{ scope.row.RemainingBuyStock - scope.row.RemainingSellStock }}</span>
        vxe-table-column(field="TotalSubmit" title='總口數')
        vxe-table-column(field="TotalFee" title='手續費合計')
        vxe-table-column(title='損益')
          template(slot-scope='scope')
            span.text__success(v-if="scope.row.TotalPoint >= 0") {{ scope.row.TotalPoint}}
            span.text__danger(v-else) {{ scope.row.TotalPoint}}
        vxe-table-column(title='留倉預扣')
          template(slot-scope='scope')
            span.text__success(v-if="scope.row.RemainingWithholding >= 0") {{ scope.row.RemainingWithholding}}
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