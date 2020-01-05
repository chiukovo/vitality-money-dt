<template lang='pug'>
div(style="height: calc(100% - 64px);")
  client-only
    vxe-table.table(
      :data='commidyArray'
      :cell-class-name='tableCellClassName',
      max-width="100%"
      height="100%"
      column-min-width="90"
      border
      auto-resize
      highlight-current-row)
      vxe-table-column(fixed="left" align="left")
        template(v-slot:header="{column}") 商品
          .table-toggle
            a(@click.stop="$parent.settingShow = true")
        template(slot-scope='scope' ) {{ scope.row.Name }}
      vxe-table-column(field="PointMoney" title='每點價格')
      vxe-table-column(field="StoreLimit" title='持倉上限')
      vxe-table-column(title='開放0.1口')
        template(slot-scope="scope") {{ scope.row.DecimalSubmitEnable == 1 ? '是' : '否' }}
      vxe-table-column(field="DecimalSubmitFee" title='小於一口手續費' width="130")
      vxe-table-column(field="SixityFee" title='60秒平倉手續費' width="130")
      vxe-table-column(field="Fee" title='手續費(進/出)' width="130")
      vxe-table-column(field="SubmitMax" title='單商品每筆上限' width="130")
      vxe-table-column(field="RemaingLimit" title='單商品留倉上限' width="130")
      vxe-table-column(field="RemaingDayLimit" title='單商品留倉天數' width="130")
      vxe-table-column(field="OpenMaxPoint" title='開盤最大漲跌' width="110")
      vxe-table-column(field="SubmitMaxPoint" title='每口最大漲跌' width="110")
      vxe-table-column(field="StopPoint" title='停損利')
      vxe-table-column(title='禁新時間' width="200")
        template(slot-scope="scope") {{ scope.row.not_new_start_time1 }} ~ {{ scope.row.not_new_end_time1 }}
      vxe-table-column(title='可下單時間' width="200")
        template(slot-scope="scope")
          span(v-html="scope.row.TradeTime")
      vxe-table-column(field="State" title='狀態')
      vxe-table-column(field="NotNewPercent" title='禁新')
      vxe-table-column(field="CoverPercent" title='強平')
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      items: [],
    }
  },
  props: ['itemId'],
  mounted() {
  },
  computed: mapState([
    'commidyArray',
  ]),
  methods: {
    tableCellClassName({ row, column, columnIndex }) {
      let color = ''

      if (columnIndex != 0) {
        if (row.State == '正常') {
          color = 'text__yellow'
        } else {
          color = 'text__danger'
        }
      }

      if (typeof this.itemId != 'undefined') {
        if (row.ID != this.itemId) {
          return 'hide'
        }
      }

      return color
    },
  }
}
</script>