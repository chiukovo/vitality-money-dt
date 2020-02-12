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
    div
      table.custom__table.large
        thead.thead
          tr
            th 商品名稱
            th(style="width: 110px") 開盤風控點數
            th 手續費
            th 每點價格
            th(style="width: 110px") 最小跳動點
            th(style="width: 110px") 最小損益點
            th(style="width: 120px") 限價單平倉限制
            th 最大口數
            th 留倉上限
            th 留倉天數
            th 禁新
            th 狀態
            th 強平
        tbody.tbody(@scroll="tbodyScroll($event)")
          tr(v-for="row in commidyArray")
            td {{ row.Name }}
            td(style="width: 110px") {{ row.OpenMaxPoint }}
            td {{ row.Fee }}
            td {{ row.PointMoney }}
            td(style="width: 110px") {{ row.TradePoint }}
            td(style="width: 110px") {{ row.StopPoint }}
            td(style="width: 120px") {{ row.LimitCoverPoint }}
            td {{ row.SubmitMax }}
            td {{ row.RemaingLimit }}
            td {{ row.RemaingDayLimit }}
            td {{ row.NotNewPercent }}
            td {{ row.CoverPercent }}
            td {{ row.State }}
          tr(class="non-data" v-if="commidyArray.length == 0")
            td 無資料
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