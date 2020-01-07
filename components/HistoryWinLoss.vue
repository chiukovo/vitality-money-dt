<template lang='pug'>
.dialog
  .dialog__header
    .row
      .col-lg-auto
        el-form(ref='form' size='mini' :inline='true')
          el-form-item(label='日期:')
            el-form-item
              el-date-picker(type='date' placeholder='開始日期' v-model="form.start" style="width: 130px;")
          el-form-item
            el-date-picker(type='date' placeholder='結束日期' v-model="form.end" style="width: 130px;")
          button.button(type="button" @click="query") 送出
      .col-lg-auto
        button.button(@click="selectDayType('today')") 今日
        button.button(@click="selectDayType('yesterday')") 昨日
        button.button(@click="selectDayType('thisWeek')") 本週
        button.button(@click="selectDayType('beforeWeek')") 上週
        button.button(@click="selectDayType('thisMonth')") 本月
        button.button(@click="selectDayType('beforeMonth')") 上月
  .dialog__content
    client-only
      vxe-table(
        :data='items'
        max-width="100%"
        height="500"
        column-min-width="74"
        size="mini"
        align="center"
        border
        auto-resize)
        vxe-table-column
          template(slot-scope='scope')
            button(@click="clickDetail(scope.row)") 明細
        vxe-table-column(field="Date" title='日期')
        vxe-table-column(title='昨日權益數')
          template(slot-scope='scope')
            span(:class="getMoneyColor(scope.row.YesterdayInterestNum)") {{ scope.row.YesterdayInterestNum | currency }}
        vxe-table-column(title='今日損益')
          template(slot-scope='scope')
            span(:class="getMoneyColor(scope.row.TodayMoney)") {{ scope.row.TodayMoney | currency }}
        vxe-table-column(title='餘額')
          template(slot-scope='scope')
            span(:class="getMoneyColor(scope.row.RemainingMoney)") {{ scope.row.RemainingMoney | currency }}
        vxe-table-column(field="TotalFee" title='手續費')
        vxe-table-column(field="TotalSubmit" title='投注口數')
        vxe-table-column(field="Uppay" title='轉出')
          template(slot-scope='scope')
            span(:class="getMoneyColor(scope.row.Uppay)") {{ scope.row.Uppay | currency }}
        vxe-table-column(field="SaveMoney" title='儲值')
          template(slot-scope='scope')
            span(:class="getMoneyColor(scope.row.SaveMoney)") {{ scope.row.SaveMoney | currency }}
  el-dialog(
    width="50%"
    height="500px"
    :title="detail.title"
    :visible.sync="innerVisible"
    append-to-body)
      .title(style="background: #f7f7f7; padding: 10px;")
        span 昨日權益數
        span(:class="getMoneyColor(detail.yesterdayInterestNum)") {{ detail.yesterdayInterestNum | currency }}
        span(style="margin-left: 10px") 今日損益
        span(:class="getMoneyColor(detail.todayMoney)") {{ detail.todayMoney | currency }}
        span(style="margin-left: 10px") 餘額
        span(:class="getMoneyColor(detail.remainingMoney)") {{ detail.remainingMoney | currency }}
      .tabs.tabs-nav
        .tabs__item(@click="detail.type = 1" :class="detail.type == 1 ? 'is-active' : ''") 全部單
        .tabs__item(@click="detail.type = 2" :class="detail.type == 2 ? 'is-active' : ''") 未平倉單
        .tabs__item(@click="detail.type = 3" :class="detail.type == 3 ? 'is-active' : ''") 已平倉單
        .tabs__item(@click="detail.type = 4" :class="detail.type == 4 ? 'is-active' : ''") 統計
      .content(v-show="detail.type == 1")
        client-only
          vxe-table(
            :data='detail.orderArray'
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
            vxe-table-column(title='狀態' width='110' fixed="right")
              template(slot-scope='scope')
                span.blink(v-if="scope.row.State == '未成交'") {{ scope.row.State }}
                span(v-else) {{ scope.row.State }}
      .content(v-show="detail.type == 2")
        client-only
          vxe-table(
            :data='detail.uncoveredArray'
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
      .content(v-show="detail.type == 3")
        client-only
          vxe-table(
            :data='detail.coveredArray'
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
            vxe-table-column(field="CoverPrice" title='成交價')
            vxe-table-column(title='損益')
              template(slot-scope='scope')
                span(:class="scope.row['Money'] > 0 ? 'text__success' : 'text__danger'") {{ scope.row['Money'] }}
      .content(v-show="detail.type == 4")
        client-only
          vxe-table(
            :data='detail.commodityArray'
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
              template(slot-scope='scope') {{ detail.coveredArray.length }}
            vxe-table-column(field="TotalSubmit" title='總口數')
            vxe-table-column(title='損益')
              template(slot-scope='scope')
                span(:class="scope.row['TodayMoney'] < 0 ? 'text__success' : 'text__danger'") {{ scope.row['TodayMoney'] }}
</template>
<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      form: {
        start: '',
        end: '',
      },
      userId: '',
      token: '',
      lang: '',
      innerVisible: false,
      items: [],
      detail: {
        type: 1,
        title: '',
        todayMoney: '',
        remainingMoney: '',
        orderArray: [],
        uncoveredArray: [],
        coveredArray: [],
        commodityArray: [],
      },
      detailDate: '',
    }
  },
  mounted () {
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yyyy = today.getFullYear();

    this.today = yyyy + '/' + mm + '/' + dd;

    this.selectDayType('today')
  },
  methods: {
    async clickDetail(row) {
      const _this = this
      const date = row.Date
      this.detail.todayMoney = row.TodayMoney
      this.detail.remainingMoney = row.RemainingMoney
      this.detail.yesterdayInterestNum = row.YesterdayInterestNum
      this.detail.orderArray = []
      this.detail.uncoveredArray = []
      this.detail.coveredArray = []
      this.detail.commodityArray = []
      this.detail.title = date + '下單明細'

      //明細
      await axios.post(process.env.NUXT_ENV_API_URL + "/query_moneylist_detail?lang=" + this.lang, qs.stringify({
        UserID: this.userId,
        Token: this.token,
        StartDate: date,
        EndDate: date,
        DaySelect: -1,
      }))
      .then(response => {
        const result = response.data

        if (result.Code > 0) {
          _this.detail.orderArray = result.OrderArray
          _this.detail.uncoveredArray = result.UncoveredArray
          _this.detail.coveredArray = result.CoveredArray
          _this.detail.commodityArray = result.CommodityArray
          _this.innerVisible = true
        }
      })
    },
    async query() {
      let _this = this
      const money = this.$store.state.userInfo.Money

      if (this.form.start != '' && this.form.end != '') {
        await axios.post(process.env.NUXT_ENV_API_URL + "/query_history_moneylist?lang=" + this.lang, qs.stringify({
          UserID: this.userId,
          Token: this.token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          const result = response.data

          if (result.Code > 0) {
            _this.items = result.MoneyArray

            //計算昨日權益數
            _this.items = _this.items.map(function (val) {
              val.YesterdayInterestNum = money - val.TouchPoint + val.Withholding - val.TodayMoney

              return val
            })
          }
        })
      }
    }
  }
}
</script>