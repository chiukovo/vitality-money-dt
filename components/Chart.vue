<template lang='pug'>
.history-content
  .history-content__header
    div
      button {{ nowMainItem.product_name }}
      span 昨收 {{ nowMainItem.yesterday_close_price }}
      span 開 {{ nowMainItem.open_price }}
      span 高 {{ nowMainItem.highest_price }}
      span 低 {{ nowMainItem.lowest_price }}
      span 成交 {{ nowMainItem.newest_price }}
      span 漲跌 {{ nowMainItem.gain }}
  .history-content__body
    highcharts(v-if="items.length > 0" :options="options")
    div(v-loading="loading" v-else)
</template>

<script>

import { mapState } from 'vuex'
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
      options: {},
      loading: true,
    }
  },
  methods: {
    activeLastPointToolip (chart) {
      const points = chart.series[0].points;
      chart.tooltip.refresh(points[points.length -1]);
    },
  },
  computed: mapState([
    'chartData',
    'clickItemId',
    'nowMainItem',
  ]),
  watch: {
    clickItemId(id) {
      this.loading = true
      this.items = []
    },
    chartData (res) {
      const _this = this
      let name = this.$store.state.itemName
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
          text: name
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
