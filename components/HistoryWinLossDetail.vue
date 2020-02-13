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
    table.custom__table.large
      thead.thead
        tr
          th 序號
          th(style="width: 100px;") 商品
          th 多空
          th 委託價
          th 口數
          th 成交價
          th(style="width: 150px;") 下單時間
          th(style="width: 150px;") 完成時間
          th 型別
          th 損失點數
          th 獲利點數
          th 狀態
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in orderArray" @click="trClick($event)")
          td {{ row.Serial }}
          td(style="width: 100px;") {{ row.Name }}
          td
            span(:class="row.BuyOrSell == 0 ? 'text__danger' : 'text__success'") {{ row.BuyOrSell == 0 ? '多' : '空' }}
          td {{ row.OrderPrice }}
          td {{ row.Quantity }}
          td {{ row.FinalPrice }}
          td(style="width: 150px;") {{ row.OrderTime }}
          td(style="width: 150px;") {{ row.FinalTime }}
          td {{ row.Odtype }}
          td {{ parseInt(row.LossPoint) }}
          td {{ parseInt(row.WinPoint) }}
          td
            span.blink(v-if="row.State == '未成交'") {{ row.State }}
            span(v-else) {{ row.State }}
        tr(class="non-data" v-if="orderArray.length == 0")
          td 無資料
  .content(v-show="type == 2")
    table.custom__table.large
      thead.thead
        tr
          th 序號
          th(style="width: 100px;") 商品
          th 多空
          th 成交價
          th 口數
          th 手續費
          th 損失點
          th 獲利點
          th 報價
          th 浮動損益
          th 天數
          th 狀態
          th 昨日損益
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in uncoveredArray" @click="trClick($event)")
          td {{ row.Serial }}
          td(style="width: 100px;") {{ row.Name }}
          td
            span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
          td {{ row.FinalPrice }}
          td {{ row.Quantity }}
          td {{ row.TotalFee }}
          td {{ row.LossPoint }}
          td {{ row.WinPoint }}
          td {{ row.ClosePrice }}
          td
            span(:class="getMoneyColor(row.OldToNewMoney)") {{ row.OldToNewMoney }}
          td {{ row.Day }}
          td {{ row.State }}
          td
            span(:class="getMoneyColor(row.OriginalMoney)") {{ row.OriginalMoney }}
        tr(class="non-data" v-if="uncoveredArray.length == 0")
          td 無資料
  .content(v-show="type == 3")
    table.custom__table.large
      thead.thead
        tr
          th 序號
          th(style="width: 100px;") 商品
          th 多空
          th(style="width: 150px;") 成交日期
          th 成交價
          th 口數
          th 手續費
          th 平倉序號
          th(style="width: 150px;") 平倉時間
          th 成交價
          th 損益
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in coveredArray" @click="trClick($event)")
          td {{ row.NewSerial }}
          td(style="width: 100px;") {{ row.Name }}
          td
            span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
          td(style="width: 150px;") {{ row.NewDate }}
          td {{ row.NewPrice }}
          td {{ row.SerialCoveredNum }}
          td {{ row.TotalFee }}
          td {{ row.CoverSerial }}
          td(style="width: 150px;") {{ row.CoverDate }}
          td {{ row.CoverPrice }}
          td
            span(:class="getMoneyColor(row['Money'])") {{ row['Money'] }}
        tr(class="non-data" v-if="coveredArray.length == 0")
          td 無資料
  .content(v-show="type == 4")
    table.custom__table.large
      thead.thead
        tr
          th(style="width: 100px;") 商品
          th 未平多
          th 未平空
          th 已平倉
          th 總口數
          th 損益
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in commodityArray" @click="trClick($event)")
          td(style="width: 100px;") {{ row.Name }}
          td
            span(class="text__danger") {{ row.TotalBuySubmit }}
          td
            span(class="text__success") {{ row.TotalSellSubmit }}
          td {{ coveredArray.length }}
          td {{ row.TotalSubmit }}
          td
            span(:class="getMoneyColor(row['TodayMoney'])") {{ row['TodayMoney'] }}
        tr(class="non-data" v-if="commodityArray.length == 0")
          td 無資料
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
  mounted() {
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang

    this.query()
    this.computedTableContent()
  },
  watch: {
    type() {
      this.computedTableContent()
    }
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