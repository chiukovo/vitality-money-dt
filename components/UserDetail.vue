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
        :data='items'
        max-width="100%"
        :height="onlyItem === true ? '100px': '500px'"
        column-min-width="74"
        size="mini"
        align="center"
        border
        auto-resize
        highlight-current-row
        highlight-hover-row)
        vxe-table-column(fixed="left" prop="Name" title='商品名稱')
        vxe-table-column(title='開盤風控點數' width="100px")
        vxe-table-column(title='留倉保證金')
        vxe-table-column(field="Fee" title='手續費' width="100")
        vxe-table-column(field="PointMoney" title='每點價格')
        vxe-table-column(title='最小跳動點')
        vxe-table-column(title='限價單平倉限制'  width="120px")
          template(slot-scope="scope")
            span {{ scope.row.LimitCoverPoint }}
        vxe-table-column(field="SubmitMax" title='最大口數')
        vxe-table-column(field="RemaingLimit" title='留倉上限')
        vxe-table-column(field="RemaingDayLimit" title='留倉天數')
        vxe-table-column(field="NotNewPercent" title='禁新')
        vxe-table-column(field="CoverPercent" title='強平')
        vxe-table-column(field="State" title='狀態')
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
  props: ['onlyItem'],
  computed: mapState([
    'commidyArray',
    'clickItemId',
    'userInfo',
  ]),
  watch: {
    clickItemId() {
      const sourceCommidyArray = this.$store.state.commidyArray
      this.getUserInfo(sourceCommidyArray)
    }
  },
  mounted() {
    const sourceCommidyArray = this.$store.state.commidyArray
    this.getUserInfo(sourceCommidyArray)
  },
  methods: {
    getUserInfo(sourceCommidyArray) {
      this.items = []
      const source = JSON.parse(JSON.stringify(sourceCommidyArray))
      const _this = this
      const itemId = this.$store.state.clickItemId

      if (this.onlyItem === true) {
        source.forEach(function(val) {
          if (val.ID == itemId) {
            _this.items.push(val)
          }
        })
      } else {
        this.items = source
      }
    }
  }
}
</script>