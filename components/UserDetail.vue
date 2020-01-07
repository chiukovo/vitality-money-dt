<template lang='pug'>
.userDetail
    table.table-userDetail
      tr
        td.table-userDetail__title 會員帳號
        td {{ userInfo.Account }}
      tr
        td.table-userDetail__title 用戶分類
        td 信用戶
      tr
        td.table-userDetail__title 類型
        td 多空互抵
      tr
        td.table-userDetail__title 口數上限(筆/日)
        td {{ userInfo.DaySubmitLimit }}
      tr
        td.table-userDetail__title 留倉口數上限
        td {{ userInfo.AllRemainingLimit }}
      tr
        td.table-userDetail__title 強平額度
        td
          span(:class="getMoneyColor(userInfo.CoverMoney)") {{ userInfo.CoverMoney | currency }}
      tr
        td.table-userDetail__title 結算時間
        td {{ userInfo.EndTime }}
    .table-title 商品資訊
    client-only
      vxe-table(
        :data='commidyArray'
        :cell-class-name='tableCellClassName',
        max-width="100%"
        :height="onlyItem === true ? '150px': '300px'"
        column-min-width="74"
        size="mini"
        align="center"
        border
        auto-resize
        highlight-current-row
        highlight-hover-row)
        vxe-table-column(fixed="left" prop="Name" title='商品名稱')
        vxe-table-column(field="OpenMaxPoint" title='開盤風控點數')
        vxe-table-column(field="Fee" title='手續費')
        vxe-table-column(field="PointMoney" title='每點價格')
        vxe-table-column(field="TradePoint" title='最小跳動點')
        vxe-table-column(field="StopPoint" title='最小損益點')
        vxe-table-column(field="LimitCoverPoint" title='限價單平倉限制')
        vxe-table-column(field="SubmitMax" title='最大口數')
        vxe-table-column(field="RemaingLimit" title='留倉上限')
        vxe-table-column(field="RemaingDayLimit" title='留倉天數')
        vxe-table-column(field="NotNewPercent" title='禁新')
        vxe-table-column(field="CoverPercent" title='強平')
        vxe-table-column(field="State" title='狀態')
    .badge.badge-warning 時間以冬令 (每年十一月第一個星期天開始) 為主，歐美商品於夏令 (每年三月第二個星期天開始) 提前一小時開盤、收盤
</template>

<script>

import { mapState } from 'vuex'

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
        if (row.ID != this.itemId) {
          return 'hide'
        }
      }
    },
  }
}
</script>