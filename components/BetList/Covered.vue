<template lang='pug'>
.history-content
  .history-content__header(id="coveredHeader")
  .history-content__body(:style="{height: $parent.height.covered}")
    client-only
      vxe-table.table__dark(
        :data='$store.state.covered'
        max-width="100%"
        height="100%"
        size="mini"
        column-min-width="60"
        stripe
        border
        auto-resize
        highlight-current-row)
        vxe-table-column(field="Name" title='商品' width="94")
        vxe-table-column(field="NewSerial" title='新倉序號' width="74")
        vxe-table-column(field="CoverSerial" title='平倉序號' width="74")
        vxe-table-column(title='新倉型別' width="74")
          template(slot-scope='scope')
            span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['NewType'] }}
        vxe-table-column(field="CoverType" title='種類')
        vxe-table-column(field="SerialCoveredNum" title='口數')
        vxe-table-column(field="TotalFee" title='手續費')
        vxe-table-column(title='多空')
          template(slot-scope='scope')
            span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
        vxe-table-column(field="NewPrice" title='成交價')
        vxe-table-column(field="CoverPrice" title='平倉價')
        vxe-table-column(title='點數')
          template(slot-scope='scope')
            .change-icon
              .icon-arrow(:class="scope.row['Point'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
            span(:class="scope.row['Point'] < 0 ? 'text__success' : 'text__danger'") {{ scope.row['Point'] }}
        vxe-table-column(field="NewDate" title='成交日期' width="150px")
        vxe-table-column(field="CoverDate" title='平倉日期' width="150px")
        vxe-table-column(title='損益')
          template(slot-scope='scope')
            span(:class="scope.row['Money'] < 0 ? 'text__success' : 'text__danger'") {{ scope.row['Money'] | currency }}
</template>

<script>

export default {
  data() {
    return {
    }
  },
}
</script>