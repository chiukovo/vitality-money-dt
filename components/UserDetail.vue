<template lang='pug'>
.userDetail
    table.table-userDetail
      tr
        td.table-userDetail__title 會員帳號
        td {{ userInfo.Account }}
      tr
        td.table-userDetail__title 信用額度
        td {{ userInfo.TouchPoint }}
      tr
        td.table-userDetail__title 對匯額度
        td {{ userInfo.ContrastPoint }}
      tr
        td.table-userDetail__title 口數上限(筆/日)
        td {{ userInfo.DaySubmitLimit }}
      tr
        td.table-userDetail__title 留倉口數上限
        td {{ userInfo.AllRemainingLimit }}
      tr
        td.table-userDetail__title 結算時間
        td {{ userInfo.EndTime }}
    .table-title 商品資訊
    client-only
      vxe-table(
        :data='commidyArray'
        :cell-class-name='tableCellClassName',
        max-width="100%"
        :height="onlyItem === true ? '150px': '500px'"
        column-min-width="74"
        size="mini"
        align="center"
        border
        auto-resize
        highlight-current-row
        highlight-hover-row)
        vxe-table-column(fixed="left" prop="Name" title='商品名稱')
        vxe-table-column(field="PointMoney" title='每點價格')
        vxe-table-column(field="StoreLimit" title='持倉上限')
        vxe-table-column(title='開放0.1口')
          template(slot-scope="scope") {{ scope.row.DecimalSubmitEnable == 1 ? '是' : '否' }}
        vxe-table-column(field="DecimalSubmitFee" title='小於一口手續費' width="100")
        vxe-table-column(field="SixityFee" title='60秒平倉手續費' width="100")
        vxe-table-column(field="Fee" title='手續費(進/出)' width="100")
        vxe-table-column(field="SubmitMax" title='單商品每筆上限' width="100")
        vxe-table-column(field="RemaingLimit" title='單商品留倉上限' width="100")
        vxe-table-column(field="RemaingDayLimit" title='單商品留倉天數' width="100")
        vxe-table-column(field="OpenMaxPoint" title='開盤最大漲跌' width="90")
        vxe-table-column(field="SubmitMaxPoint" title='每口最大漲跌' width="90")
        vxe-table-column(field="StopPoint" title='停損利')
        vxe-table-column(title='禁新時間')
          template(slot-scope="scope") {{ scope.row.not_new_start_time1}} ~ {{ scope.row.not_new_end_time1 }}
        vxe-table-column(title='可下單時間' width="200")
          template(slot-scope="scope")
            span(v-html="scope.row.TradeTime")
        vxe-table-column(field="State" title='狀態')
        vxe-table-column(field="NotNewPercent" title='禁新')
        vxe-table-column(field="CoverPercent" title='強平')
    .badge.badge-warning 時間以冬令 (每年十一月第一個星期天開始) 為主，歐美商品於夏令 (每年三月第二個星期天開始) 提前一小時開盤、收盤
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      items: [],
    }
  },
  props: ['onlyItem', 'itemId'],
  computed: mapState([
    'commidyArray',
    'userInfo',
    'clickItemId',
  ]),
  methods: {
    tableCellClassName({ row, column, columnIndex }) {
      if (this.onlyItem === true) {
        console.log(this.itemId, this.onlyItem)
        if (row.ID != this.itemId) {
          return 'hide'
        }
      }
    },
  }
}
</script>