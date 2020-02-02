<template lang='pug'>
.page
  .main
    .title(style="padding: 10px;")
      span 昨餘
      span(:class="getMoneyColor(detail.yesterdayInterestNum)") {{ detail.yesterdayInterestNum | currency }}
      span(style="margin-left: 10px") 今損
      span(:class="getMoneyColor(detail.todayMoney)") {{ detail.todayMoney | currency }}
      span(style="margin-left: 10px") 餘額
      span(:class="getMoneyColor(detail.remainingMoney)") {{ detail.remainingMoney | currency }}
    .transaction-tabs.tabs-nav.tabs-nav-theme1
      .tabs__item(@click="historyShow = 1" :class="{'is-active': historyShow == 1}") 全部
      .tabs__item(@click="historyShow = 2" :class="{'is-active': historyShow == 2}") 未平
      .tabs__item(@click="historyShow = 3" :class="{'is-active': historyShow == 3}") 已平
      .tabs__item(@click="historyShow = 4" :class="{'is-active': historyShow == 4}") 統計
    .area(v-if='historyShow == 1' style="height: calc(100% - 20px);overflow-y: auto;")
      ul.area-tran-list
        li(v-for="item in orderArray")
          ul.tran-item
            li
              .tran-item__name
                span(v-if="item.State != '已刪除'") {{ item.Name }}
                s(v-else) {{ item.Name }}
              .tran-item__yellow {{ item.Serial }}
            li
              .text__danger.text__lg {{ item.BuyOrSell == 0 ? '多' : '空' }}
            li
              .tran-item__hey.text__lg {{ item.Quantity }}
            li
              div
                span.text__secondary 獲利
                span.tran-item__ha {{ parseInt(item.WinPoint) }}
              div
                span.text__secondary 損失
                span.tran-item__ha {{ parseInt(item.LossPoint) }}
            li
              div
                span.text__secondary {{ item.State }}
                span.text__secondary {{ dateOnlyHis(item.OrderTime) }}
              div
                span 12097
                span {{ dateOnlyHis(item.FinalTime) }}
            li
              .tran-item__yo 轉新單
              div 已成交
    .area(v-if='historyShow == 2' style="height: calc(100% - 40px);overflow-y: auto;")
      ul.area-tran-list
        li(v-for="item in uncoveredArray")
          ul.tran-item
            li(style="width: 75px;")
              .tran-item__name  {{ item.Name }}
              .tran-item__yellow {{ item.Serial }}
                span {{ item.Day }}天
            li
              .text__center.text__lg(:class="item.BuyOrSell == 0 ? 'text__danger' : 'text__success'" style="width: 20px;") {{ item.BuyOrSell == 0 ? '多' : '空' }}
            li
              .tran-item__hey {{ item.Quantity }}
              .tran-item__fee {{ item.TotalFee }}
            li(style="min-width: 56px")
              div
                span.text__secondary 獲利
                span.tran-item__ha {{ parseInt(item.WinPoint) }}
              div
                span.text__secondary 損失
                span.tran-item__ha {{ parseInt(item.LossPoint) }}
            //-成交價
            li {{ item.FinalPrice }}
            li
              div
                //-收盤價
                span.tran-item__ha
                  span {{ item.ClosePrice }}
              div
                //-過帳損益
                span.tran-item__ha
                  div
                    span(:class="getMoneyColor(item.OldToNewMoney)") ${{ item.OldToNewMoney }}
    .area(v-if='historyShow == 3' style="height: calc(100% - 40px);overflow-y: auto;")
      ul.area-tran-list
        li(v-for="item in coveredArray")
          ul.tran-item
            li
              .tran-item__name {{ item.Name }}
            li
              .text__danger.text__lg {{ item.BuyOrSell == 0 ? '多' : '空' }}
            li
              .tran-item__hey {{ item.SerialCoveredNum }}
              .tran-item__fee {{ item.TotalFee }}
            li
              div
                span.text__secondary 成交
                span.tran-item__ha
                  span.tran-item__yellow {{ item.NewPrice }}
                  span -
              div
                span.text__secondary 平倉
                span.tran-item__ha
                  span.tran-item__yellow {{ item.CoverPrice }}
                  span -
            li
              span(:class="item.Money < 0 ? 'text__success' : 'text__danger'") {{ item.Money | currency }}
    .area(v-if='historyShow == 4' style="height: calc(100% - 40px);overflow-y: auto;")
      ul.area-tran-list
        li(v-for="item in commodityArray")
          ul.tran-item
            li
              .tran-item__name.text__lg {{ item.Name }}
            li
              .tran-item__put.bg__danger {{ item.TotalBuySubmit　}}
              .tran-item__put.bg__success {{ item.TotalSellSubmit}}
            li
              .tran-item__hey.text__lg {{ item.TotalSubmit}}
            li
              div
                span.text__secondary 手續費
                span {{ item.TotalFee }}
            li
              .text__danger.text__lg
                span.text__success(v-if="item.TotalPoint < 0") {{ item.TotalPoint}}
                span.text__danger(v-else) {{ item.TotalPoint}}
</template>

<script>

import axios from 'axios'
import qs from 'qs'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      historyShow: 1,
      orderArray: [],
      uncoveredArray: [],
      coveredArray: [],
      commodityArray: [],
    };
  },
  props: ['detail'],
  mounted() {
    this.query()
  },
  methods: {
    async query() {
      let _this = this

      if (this.detail.date != '') {
        const userId = this.$store.state.localStorage.userAuth.userId
        const token = this.$store.state.localStorage.userAuth.token
        const lang = this.$store.state.localStorage.lang

        await axios.post(process.env.NUXT_ENV_API_URL + "/query_moneylist_detail?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          StartDate: this.detail.date,
          EndDate: this.detail.date,
          DaySelect: -1,
        }))
        .then(response => {
          _this.orderArray = []
          _this.uncoveredArray = []
          _this.coveredArray = []
          _this.commodityArray = []

          if (response.data.Code == 1) {
            _this.orderArray = response.data.OrderArray
            _this.uncoveredArray = response.data.UncoveredArray
            _this.coveredArray = response.data.CoveredArray
            _this.commodityArray = response.data.CommodityArray
          }
        })
      }
    }
  }
}
</script>