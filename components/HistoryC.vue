<template lang='pug'>
.history-content
  .history-content__header
    .linesp-wrap
      .badge.badge-warning {{ nowMainItem.product_name }}
      .linesp 昨收
        span.number {{ nowMainItem.yesterday_close_price }}
      .linesp 開
        span(:class="checkNumberColor(nowMainItem.open_price)") {{ nowMainItem.open_price }}
      .linesp 高
        span(:class="checkNumberColor(nowMainItem.highest_price)") {{ nowMainItem.highest_price }}
      .linesp 低
        span(:class="checkNumberColor(nowMainItem.lowest_price)") {{ nowMainItem.lowest_price }}
      .linesp 成交
        span(:class="checkNumberColor(nowMainItem.newest_price)") {{ nowMainItem.newest_price }}
      .linesp 漲跌
        span
          .change-icon
            .icon-arrow(:class="nowMainItem.gain > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
          div(style="display: inline" :class="nowMainItem.gain > 0 ? 'text__danger' : 'text__success'") {{ nowMainItem.gain }}
      .linesp
        label
          input(type="checkbox" v-model="crossEnable")
          span 成交價線
        label
          input(type="checkbox" v-model="newestPriceLineEnable")
          span 十字線
  .history-content__body(style="height:calc(100% - 30px)")
    splitpanes(class="default-theme" @resized="resizeChart()")
      pane(size="70")
        Chart(:crossEnable="crossEnable" :newestPriceLineEnable="newestPriceLineEnable")
      pane(size="30")
        .itemDetail__TotalTable(class="h-100" style="border-top: 1px solid #3a3a3a; padding: 6px; overflow-y: auto;")
          .select.badge.badge-warning(style="margin-bottom: 6px;")
            select(v-model="fiveChange" @change="changeFiveSelect")
              option(v-for="item in $store.state.customItemSetting" v-if="item.show" :value="item.id") {{ item.name }}
          table.table__dark.table__hi
            thead
              tr
                th 比例
                th 委買
                th 價格
                th 委賣
                th 比例
            tbody
              tr(v-for="row in $store.state.items0")
                td
                  div(v-if="row[0] == ''")
                  div(v-else)
                    .progress-bar.progress-bar__right
                      .progress-bar__inner(:style="'width: ' + row[0] + '%'")
                td {{ row[1] }}
                td {{ row[2] }}
                td {{ row[3] }}
                td
                  div(v-if="row[4] == ''")
                  div(v-else)
                    .progress-bar
                      .progress-bar__inner(:style="'width: ' + row[4] + '%'")
          .itemDetail__Total.d-flex.align-items-center
            .text__danger.text__center(style="flex: 0 0 20%;") {{ $store.state.fiveTotal.more }}
            div(style="flex: 1;")
              .progress-bar.progress-bar__total
                .progress-bar__inner(:style="'width: ' + $store.state.fiveTotal.morePercent + '%'")
            .text__success.text__center(style="flex: 0 0 20%;")  {{ $store.state.fiveTotal.nullNum }}
</template>

<script>

import { mapState } from 'vuex'
import Chart from "~/components/Chart"
import { Splitpanes, Pane } from 'splitpanes'

export default {
  name: 'app',
  data() {
    return {
      crossEnable: true,
      newestPriceLineEnable: true,
      items: [],
      fiveData: [],
      options: {},
      loading: true,
      fiveChange: 0,
    }
  },
  methods: {
    resizeChart() {
      this.$store.dispatch('RESIZE_CHART')
    },
    checkNumberColor(target) {
      if (this.$store.state.nowMainItem.yesterday_close_price == target) {
        return 'number'
      }

      return this.$store.state.nowMainItem.yesterday_close_price < target ? 'text__success' : 'text__danger'
    },
    changeFiveSelect() {
      this.$store.commit('sendMessage', this.cancelAllFive())
      this.$store.commit('sendMessage', 'h:' + this.fiveChange)
    }
  },
  computed: mapState({
    chartData: 'chartData',
    clickItemId: 'clickItemId',
    nowMainItem: 'nowMainItem',
    mainStyle: state => state.localStorage.customSetting.mainStyle
  }),
  components: {
    Splitpanes,
    Pane,
    Chart,
  },
  watch: {
    mainStyle() {
      this.$store.dispatch('RESIZE_CHART')
    },
    clickItemId(id) {
      this.loading = true
      this.items = []
      this.fiveChange = id
    },
  },
  mounted() {
    this.fiveChange = this.$store.state.clickItemId
  },
}
</script>


<style>
.w-70 {
  width: 70%;
}
.w-30 {
  width: 30%;
}
</style>