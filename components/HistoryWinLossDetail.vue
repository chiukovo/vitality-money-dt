<template lang='pug'>
div
  .title(style="background: #f7f7f7; padding: 10px;")
    span 昨日權益數
    span(:class="getMoneyColor(detail.yesterdayInterestNum)") {{ detail.yesterdayInterestNum | currency }}
    span(style="margin-left: 10px") 今日損益
    span(:class="getMoneyColor(detail.todayMoney)") {{ detail.todayMoney | currency }}
    span(style="margin-left: 10px") 餘額
    span(:class="getMoneyColor(detail.remainingMoney)") {{ detail.remainingMoney | currency }}
  .tabs.tabs-nav
    .tabs__item(@click="type = 1" :class="type == 1 ? 'is-active' : ''") 全部單
    .tabs__item(@click="type = 2" :class="type == 2 ? 'is-active' : ''") 未平倉單
    .tabs__item(@click="type = 3" :class="type == 3 ? 'is-active' : ''") 已平倉單
    .tabs__item(@click="type = 4" :class="type == 4 ? 'is-active' : ''") 統計
  .content(v-show="type == 1")
    client-only
      vxe-table(
        :data='orderArray'
        max-width="100%"
        height="300"
        size="mini"
        align="center"
        border
        auto-resize)
        vxe-table-column(field="Serial" title='序號' width="80px")
        vxe-table-column(field="Name" title='商品' width="80px")
        vxe-table-column(title='多空' width="40px" align="center")
          template(slot-scope='scope')
            span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
        vxe-table-column(field='OrderPrice' title='委託價' width="80px")
        vxe-table-column(field='Quantity' title='口數' width="40px" align="center")
        vxe-table-column(field='FinalPrice' title='成交價' width="80px")
        vxe-table-column(field='OrderTime' width='150' title='下單時間')
        vxe-table-column(field='FinalTime' width='150' title='完成時間')
        vxe-table-column(field='Odtype' title='型別' width="80px")
        vxe-table-column(title='損失點數' align="center")
          template(slot-scope='scope') {{ parseInt(scope.row.LossPoint) }}
        vxe-table-column(title='獲利點數' align="center")
          template(slot-scope='scope') {{ parseInt(scope.row.WinPoint) }}
        vxe-table-column(title='狀態' width='100')
          template(slot-scope='scope')
            span.blink(v-if="scope.row.State == '未成交'") {{ scope.row.State }}
            span(v-else) {{ scope.row.State }}
  .content(v-show="type == 2")
    client-only
      vxe-table(
        :data='uncoveredArray'
        max-width="100%"
        height="300"
        size="mini"
        align="center"
        border
        auto-resize)
        vxe-table-column(field='Serial' title='序號' width="80px")
        vxe-table-column(field='Name' title='商品' width="80px")
        vxe-table-column(title='多空')
          template(slot-scope='scope')
            span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
        vxe-table-column(field='FinalPrice' title='成交價' width="80px")
        vxe-table-column(field='Quantity' title='口數')
        vxe-table-column(field='Fee' title='手續費')
        vxe-table-column(title='損失點數' align="center")
          template(slot-scope='scope') {{ scope.row.LossPoint }}
        vxe-table-column(title='獲利點數' align="center")
          template(slot-scope='scope') {{ scope.row.WinPoint }}
        vxe-table-column(title='點數')
          template(slot-scope='scope')
            .change-icon(v-if="typeof scope.row['thisSerialPointDiff'] != 'undefined'")
              .icon-arrow(v-if="scope.row['thisSerialPointDiff'] != 0" :class="scope.row['thisSerialPointDiff'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
            span(v-if="scope.row['thisSerialPointDiff'] == 0" class="text__black") {{ scope.row['thisSerialPointDiff'] }}
            span(v-else :class="scope.row['thisSerialPointDiff'] > 0 ? 'text__up' : 'text__down'") {{ scope.row['thisSerialPointDiff'] }}
        vxe-table-column(field='thisSerialTotalMoney', title='浮動損益')
          template(slot-scope='scope')
            span(v-if="scope.row['thisSerialTotalMoney'] == 0" class="text__black") {{ scope.row['thisSerialTotalMoney'] }}
            span(v-else :class="scope.row['thisSerialTotalMoney'] > 0 ? 'text__up' : 'text__down'") {{ scope.row['thisSerialTotalMoney'] }}
        vxe-table-column(field='Day', title='天數')
        vxe-table-column(field='State', title='狀態' width="150px" fixed="right")
  .content(v-show="type == 3")
    client-only
      vxe-table(
        :data='coveredArray'
        max-width="100%"
        height="300"
        size="mini"
        align="center"
        border
        auto-resize)
        vxe-table-column(field="NewSerial" title='序號' width="80px")
        vxe-table-column(field="Name" title='商品' width="80px")
        vxe-table-column(title='多空')
          template(slot-scope='scope')
            span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
        vxe-table-column(field="NewDate" title='成交日期' width="150px")
        vxe-table-column(field="NewPrice" title='成交價' width="80px")
        vxe-table-column(field="SerialCoveredNum" title='口數')
        vxe-table-column(field="Fee" title='手續費')
        vxe-table-column(title='損失點')
        vxe-table-column(title='獲利點')
        vxe-table-column(field="CoverSerial" title='平倉序號' width="150px")
        vxe-table-column(field="CoverDate" title='平倉時間' width="150px")
        vxe-table-column(field="CoverPrice" title='成交價' width="80px")
        vxe-table-column(title='損益' width="80px")
          template(slot-scope='scope')
            span(:class="getMoneyColor(scope.row['Money'])") {{ scope.row['Money'] }}
  .content(v-show="type == 4")
    client-only
      vxe-table(
        :data='commodityArray'
        max-width="100%"
        height="300"
        size="mini"
        align="center"
        border
        auto-resize)
        vxe-table-column(field="Name" title='商品' width="80px")
        vxe-table-column(title='未平多')
          template(slot-scope='scope')
            span(class="text__danger") {{ scope.row.TotalBuySubmit }}
        vxe-table-column(title='未平空')
          template(slot-scope='scope')
            span(class="text__success") {{ scope.row.TotalSellSubmit }}
        vxe-table-column(title='已平倉')
          template(slot-scope='scope') {{ coveredArray.length }}
        vxe-table-column(field="TotalSubmit" title='總口數')
        vxe-table-column(title='損益')
          template(slot-scope='scope')
            span(:class="getMoneyColor(scope.row['TodayMoney'])") {{ scope.row['TodayMoney'] }}
</template>
<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      userId: '',
      token: '',
      lang: '',
      type: 1,
      orderArray: [],
      uncoveredArray: [],
      coveredArray: [],
      commodityArray: [],
    }
  },
  props: ['detail'],
  mounted () {
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang

    this.query()
  },
  methods: {
    async query() {
      const _this = this
      _this.orderArray = []
      _this.uncoveredArray = []
      _this.coveredArray = []
      _this.commodityArray = []

      //明細
      await axios.post(process.env.NUXT_ENV_API_URL + "/query_moneylist_detail?lang=" + this.lang, qs.stringify({
        UserID: this.userId,
        Token: this.token,
        StartDate: this.detail.date,
        EndDate: this.detail.date,
        DaySelect: -1,
      }))
      .then(response => {
        const result = response.data

        if (result.Code > 0) {
          _this.orderArray = result.OrderArray
          _this.uncoveredArray = result.UncoveredArray
          _this.coveredArray = result.CoveredArray
          _this.commodityArray = result.CommodityArray

          let YesterdayRemainingMoney = 0

          //昨日權益數
          _this.commodityArray.forEach(function(val) {
            YesterdayRemainingMoney += Number(val.YesterdayRemainingMoney)
          })
        }
      })
    }
  }
}
</script>