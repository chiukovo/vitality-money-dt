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
  .history-content__body
    highcharts(v-if="ohlcv.length > 0" :constructor-type="'stockChart'" :options="stockOptions")
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
      ohlcv: [],
      volume: [],
      stockOptions: {},
      loading: true,
    }
  },
  methods: {
    waitForSetKlineData(reload) {
      const _this = this

      if (reload) {
        this.ohlcv = []
        this.loading = true
      }

      setTimeout(function(){
        _this.setKlineData()
      }, 300)
    },
    checkNumberColor(target) {
      if (this.$store.state.nowMainItem.yesterday_close_price == target) {
        return 'number'
      }

      return this.$store.state.nowMainItem.yesterday_close_price < target ? 'text__success' : 'text__danger'
    },
    setKlineData() {
      let name = this.$store.state.itemName
      let _this = this
      this.volume = []

      this.ohlcv = JSON.parse(JSON.stringify(this.$store.state.kLineData))
      this.ohlcv.forEach(function(val) {
        _this.volume.push([
          val[0],
          val[5]
        ])
      })

      this.stockOptions = {
        chart: {
          events: {
            load: function () {
              //load over
              this.loading = false
            }
          },
          backgroundColor: 'rgba(0,0,0,0)',
          style: {
            fontFamily: "'Maven Pro', sans-serif",
            color: '#ccc'
          }
        },
        rangeSelector: {
          selected: 1,
          buttons: [
          {
            type: 'minute',
            count: 20,
            text: '分'
          },
          {
            type: 'hour',
            text: '時'
          },
          {
            type: 'day',
            text: '天'
          },
          {
            type: 'week',
            text: '周'
          },
          {
              type: 'all',
              text: '全部'
          }],
          inputDateFormat: '%Y-%m-%d'
        },
        title: {
          text: name
        },
        xAxis: {
          type: 'datetime',
          gridLineWidth: 1,
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%i',
            day: '%m-%d',
            week: '%m-%d',
            month: '%y-%m',
            year: '%Y'
          }
        },
        tooltip: {
          split: false,
          shared: true,
        },
        yAxis: [{
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: name
          },
          height: '65%',
          resize: {
            enabled: true
          },
          lineWidth: 2,
          crosshair: {
            label: {
              enabled: true,
              format: '{value:.2f}'
            }
          },
          labels: {
            align: 'left',
            format: '{value:.2f}',
            y: 6,
            x: 2
          }
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: '成交量'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }],
        series: [{
          type: 'candlestick',
          name: name,
          color: '#28a745',
          lineColor: '#28a745',
          upColor: '#dc3545',
          upLineColor: '#dc3545',
          tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
                '開盤: {point.open}<br/>' +
                '最高: {point.high}<br/>' +
                '最低: {point.low}<br/>' +
                '收盤: {point.close}<br/>'
          },
          data: this.ohlcv,
        }, {
          name: '成交量',
          type: 'column',
          data: this.volume,
          tooltip: {
            split: false,
            shared: true,
          },
          yAxis: 1,
        }]
      }
    }
  },
  computed: mapState({
    kLineData: 'kLineData',
    clickItemId: 'clickItemId',
    nowMainItem: 'nowMainItem',
    mainStyle: state => state.localStorage.customSetting.mainStyle,
  }),
  watch: {
    clickItemId(id) {
      this.loading = true
      this.ohlcv = []
    },
    kLineData() {
      this.waitForSetKlineData()
    },
    mainStyle() {
      this.waitForSetKlineData(true)
    },
  },
  mounted () {
    this.waitForSetKlineData()
  },
}
</script>

<style>
  .highcharts-color-0 {
    fill: #5fa3cb;
    stroke: #5fa3cb;
  }
</style>