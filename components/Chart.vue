<template lang='pug'>
div
  highcharts(v-if="items.length > 0" :options="options")
  div(v-loading="loading" v-else)
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
    waitForSetChartData(reload) {
      const _this = this
      if (reload) {
        this.items = []
        this.loading = true
      }

      setTimeout(function(){
        _this.setChartData()
      }, 300)
    },
    activeLastPointToolip (chart) {
      const points = chart.series[0].points
      chart.tooltip.refresh(points[points.length -1]);
    },
    setChartData() {
      const _this = this
      this.items = JSON.parse(JSON.stringify(this.$store.state.chartData))

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
          lineColor:'#333',
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
          lineColor:'#333',
          lineWidth: 1,
          tickColor:'#000',
          tickWidth: 1,
          tickLength:3,
          gridLineColor:'#333'
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
          backgroundColor: 'rgba(0,0,0,0)',
          style: {
            fontFamily: "'Maven Pro', sans-serif",
            color: '#333'
          },
          type: 'spline',
          marginRight: 10,
        },
        series: [{
          name: name,
          tooltip: {
          },
          data: this.items,
          // color: '#ffc107'
          color: '#fff'
        }]
      }
    }
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
  },
  watch: {
    mainStyle() {
      this.waitForSetChartData(true)
    },
    chartChange(id) {
      this.items = []
      this.loading = true

      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'chart',
        'num': 1
      })
    },
    clickItemId(id) {
      this.loading = true
      this.items = []
      this.fiveChange = id
      this.chartChange = id
    },
    chartData (res) {
      this.waitForSetChartData()
    }
  },
  mounted() {
    this.chartChange = this.$store.state.clickItemId
    this.waitForSetChartData()
  },
}
</script>


<style>
.highcharts-graph {
  stroke-width: 1px
}
</style>