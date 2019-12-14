<template lang='pug'>
.history-content
  .history-content__header
    div
      select(v-model="chartChange")
        option(v-for="item in $store.state.customItemSetting" v-if="item.show" :value="item.id") {{ item.name }}
      span 昨收 {{ nowMainItem.yesterday_close_price }}
      span 開 {{ nowMainItem.open_price }}
      span 高 {{ nowMainItem.highest_price }}
      span 低 {{ nowMainItem.lowest_price }}
      span 成交 {{ nowMainItem.newest_price }}
      span 漲跌 {{ nowMainItem.gain }}
  .history-content__body
    splitpanes(class="default-theme")
      pane(size="70")
        highcharts(v-if="items.length > 0" :options="options")
        div(v-loading="loading" v-if="loading")
      pane(size="30")
        .itemDetail__TotalTable(class="h-100")
          div
            select(v-model="fiveChange")
              option(v-for="item in $store.state.customItemSetting" v-if="item.show" :value="item.id") {{ item.name }}
          client-only
            vxe-table(
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
        .itemDetail__Total
          .row
            .col {{ $store.state.fiveTotal.more }}
            .col 總計
            .col {{ $store.state.fiveTotal.nullNum }}
          .row
            .col.text__danger 多勢
            .col
              .progress-bar.progress-bar__total
                .progress-bar__inner(:style="'width: ' + $store.state.fiveTotal.morePercent + '%'")
            .col.text__success 空勢
</template>

<script>

import { mapState } from 'vuex'
import { Splitpanes, Pane } from 'splitpanes'
import Vue from 'vue'
import HighchartsVue from "highcharts-vue"
import darkUnica from "highcharts/themes/dark-unica"
import Highcharts from "highcharts"
import stockInit from 'highcharts/modules/stock'
import mapInit from 'highcharts/modules/map'

if (typeof Highcharts === 'object') {
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  })

  darkUnica(Highcharts)
  stockInit(Highcharts)
  mapInit(Highcharts)
}

Vue.use(HighchartsVue)

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
    activeLastPointToolip (chart) {
      const points = chart.series[0].points
      chart.tooltip.refresh(points[points.length -1]);
    },
  },
  computed: mapState([
    'chartData',
    'clickItemId',
    'nowMainItem',
  ]),
  components: {
    Splitpanes,
    Pane,
  },
  watch: {
    chartChange(id) {
      this.items = []
      this.loading = true

      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'chart',
        'num': 1
      })
    },
    fiveChange(id) {
      //取消
      this.$socket.send('f:' + this.$store.state.clickItemId)
      //add
      this.$socket.send('h:' + id)
    },
    clickItemId(id) {
      this.loading = true
      this.items = []
      this.fiveChange = this.clickItemId
      this.chartChange = this.clickItemId
    },
    chartData (res) {
      const _this = this
      this.items = JSON.parse(JSON.stringify(res))

      this.options = {
        chart: {
          marginRight: 50,
          events: {
            load: function () {
              //load over
              this.loading = false
            }
          }
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
          lineColor:'#999',
          lineWidth:1,
          tickColor:'#666',
          tickLength:3,
        },
        plotOptions: {
          series: {
            shadow: false,
            borderWidth: 0,
            dataLabels: {
              align:'right',
              x:25,
              y:10,
            }
          }
        },
        yAxis: [{
          lineColor:'#999',
          lineWidth: 1,
          tickColor:'#000',
          tickWidth: 1,
          tickLength:3,
          gridLineColor:'#ddd'
        }, {
            linkedTo: 0,
            opposite: true,
            tickPositioner: function(min,max){
              const data = this.chart.yAxis[0].series[0].processedYData;
              //last point
              return [data[data.length-1]];
            }
        }],
        chart: {
          type: 'spline',
          marginRight: 10,
        },
        series: [{
          name: name,
          tooltip: {
          },
          data: this.items,
        }]
      }
    }
  },
  mounted () {
  },
}
</script>
