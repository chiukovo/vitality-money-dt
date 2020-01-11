<template lang='pug'>
.history-content
  .history-content__header
    .linesp-wrap
      .select.badge.badge-warning
        select(v-model="chartChange")
          option(v-for="item in $store.state.customItemSetting" v-if="item.show" :value="item.id") {{ item.name }}
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
  .history-content__body(style="height:calc(100% - 30px)")
    splitpanes(class="default-theme" @resized="resizeChart()")
      pane(size="70")
        Chart
      pane(size="30")
        .itemDetail__TotalTable(class="h-100" style="border-top: 1px solid #3a3a3a; padding: 6px;")
          .select.badge.badge-warning(style="margin-bottom: 6px;")
            select(v-model="fiveChange")
              option(v-for="item in $store.state.customItemSetting" v-if="item.show" :value="item.id") {{ item.name }}
          client-only
            vxe-table.table__dark.table__hi(
              :data="$store.state.items0"
              max-width="100%"
              size="mini"
              align="center"
              border
              auto-resize)
              vxe-table-column(title="比例")
                template(slot-scope='scope')
                  template(v-if="scope.row[0] == ''")
                  template(v-else)
                    .progress-bar.progress-bar__right
                      .progress-bar__inner(:style="'width: ' + scope.row[0] + '%'")
              vxe-table-column(title="委買" width="20%")
                template(slot-scope="scope") {{ scope.row[1] }}
              vxe-table-column(title="價格")
                template(slot-scope="scope") {{ scope.row[2] }}
              vxe-table-column(title="委賣" width="20%")
                template(slot-scope="scope") {{ scope.row[3] }}
              vxe-table-column(title="比例")
                template(slot-scope="scope")
                  template(v-if="scope.row[4] == ''")
                  template(v-else)
                    .progress-bar
                      .progress-bar__inner(:style="'width: ' + scope.row[4] + '%'")
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
      items: [],
      fiveData: [],
      options: {},
      loading: true,
      fiveChange: 0,
      chartChange: 0,
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
  },
  computed: mapState({
    chartData: 'chartData',
    clickItemId: 'clickItemId',
    nowMainItem: 'nowMainItem',
    mainStyle: state => state.localStorage.customSetting.mainStyle,
  }),
  components: {
    Splitpanes,
    Pane,
    Chart,
  },
  watch: {
    mainStyle() {
      this.waitForSetChartData(true)
    },
    fiveChange(id) {
      this.$store.commit('sendMessage', 'f:' + this.$store.state.clickItemId)
      this.$store.commit('sendMessage', 'h:' + id)
    },
    chartChange(id) {
      this.items = []
      this.loading = true
    },
    clickItemId(id) {
      this.loading = true
      this.items = []
      this.fiveChange = id
      this.chartChange = id
    },
  },
  mounted() {
    this.chartChange = this.$store.state.clickItemId
    this.fiveChange = this.$store.state.clickItemId
    // setTimeout(() => {
    //   console.log(5)
    //   this.$store.dispatch('RESIZE_CHART')
    // }, 300);
  },
}
</script>


<style>
.highcharts-graph {
  stroke-width: 1px
}
.w-70 {
  width: 70%;
}
.w-30 {
  width: 30%;
}
</style>