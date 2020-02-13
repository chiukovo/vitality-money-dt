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
    table.custom__table.large
      thead.thead
        tr
          th 明細
          th(style="width: 100px;") 日期
          th(style="width: 100px;") 昨日權益數
          th 今日損益
          th 餘額
          th 手續費
          th 投注口數
          th 轉出
          th 儲值
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in items" @click="trClick($event)")
          td
            button(@click="clickDetail(row)") 明細
          td(style="width: 100px;") {{ row.Date }}
          td(style="width: 100px;")
            span(:class="getMoneyColor(row.YesterdayInterestNum)") {{ row.YesterdayInterestNum | currency }}
          td
            span(:class="getMoneyColor(row.TodayMoney)") {{ row.TodayMoney | currency }}
          td
            span(:class="getMoneyColor(row.RemainingMoney)") {{ row.RemainingMoney | currency }}
          td {{ row.TotalFee }}
          td {{ row.TotalSubmit }}
          td
            span(v-if="row.SaveMoney < 0")
              span(:class="getMoneyColor(row.SaveMoney)") {{ row.SaveMoney | currency }}
            span(v-else) 0
          td
            span(v-if="row.SaveMoney > 0")
              span(:class="getMoneyColor(row.SaveMoney)") {{ row.SaveMoney | currency }}
            span(v-else) 0
        tr(class="non-data" v-if="items.length == 0")
          td 無資料
  el-dialog(
    width="50%"
    height="500px"
    :title="detail.title"
    :visible.sync="innerVisible"
    append-to-body
    v-if="innerVisible")
    HistoryWinLossDetail(:detail="detail" v-if="innerVisible")
</template>
<script>

import axios from 'axios'
import HistoryWinLossDetail from "~/components/HistoryWinLossDetail"
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
        date: '',
        title: '',
        todayMoney: '',
        remainingMoney: '',
      },
      detailDate: '',
    }
  },
  components: {
    HistoryWinLossDetail,
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
      this.detail.date = row.Date
      this.detail.todayMoney = row.TodayMoney
      this.detail.remainingMoney = row.RemainingMoney
      this.detail.yesterdayInterestNum = row.YesterdayInterestNum
      this.detail.title = this.detail.date + '下單明細'

      _this.innerVisible = true
    },
    async query() {
      let _this = this

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
              val.YesterdayInterestNum = Number(val.RemainingMoney) - Number(val.TouchPoint) + Number(val.Withholding) - Number(val.TodayMoney)
              return val
            })

            _this.computedTableContent()
          }
        })
      }
    }
  }
}
</script>