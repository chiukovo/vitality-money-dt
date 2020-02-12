<template lang='pug'>
.history-content
  .history-content__header(id="coveredHeader")
  #covered.history-content__body(:style="{height: $parent.height.covered}")
    table.custom__table.table__dark
      thead.thead
        tr
          th 商品
          th 新倉序號
          th 平倉序號
          th 新倉型別
          th 種類
          th 口數
          th 手續費
          th 多空
          th 成交價
          th 平倉價
          th 點數
          th(style="width: 130px;") 成交日期
          th(style="width: 130px;") 平倉日期
          th 損益
      tbody.tbody(@scroll="tbodyScroll('covered')")
        tr(v-for="row in $store.state.covered")
          td {{ row.Name }}
          td {{ row.NewSerial }}
          td {{ row.CoverSerial }}
          td
            span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['NewType'] }}
          td {{ row.CoverType }}
          td {{ row.SerialCoveredNum }}
          td {{ row.TotalFee }}
          td
            span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
          td {{ row.NewPrice }}
          td {{ row.CoverPrice }}
          td
            .change-icon
              .icon-arrow(:class="row['Point'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
            span(:class="row['Point'] < 0 ? 'text__success' : 'text__danger'") {{ row['Point'] }}
          td(style="width: 130px;") {{ row.NewDate }}
          td(style="width: 130px;") {{ row.CoverDate }}
          td
            span(:class="row['Money'] < 0 ? 'text__success' : 'text__danger'") {{ row['Money'] | currency }}
</template>

<script>

export default {
  mounted() {
    const _this = this

    _this.$nextTick(function() {
      _this.computedTableContent('covered')
    })
  },
}
</script>