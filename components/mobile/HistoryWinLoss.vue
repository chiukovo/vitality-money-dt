<template lang='pug'>
.modals.HistoryWinLoss
  .page
    .header
      .header__left
        .page__title 帳戶歷史
          span(style="font-size: 10px; color: #fff;") ({{ form.start }} ~ {{ form.end }})
      .header__title
      .header__right
        button.button.header-button.back(@click='$parent.systemShow = 0') 返回
    .main
      .area
        .area__header
          .selectDayType-tabs.tabs-nav.tabs-nav-theme1
            .tabs__item(@click="changeType('today')" :class="checkTypeClass('today')") 今日
            .tabs__item(@click="changeType('thisWeek')" :class="checkTypeClass('thisWeek')") 本週
            .tabs__item(@click="changeType('beforeWeek')" :class="checkTypeClass('beforeWeek')") 上週
            .tabs__item(@click="changeType('thisMonth')" :class="checkTypeClass('thisMonth')") 本月
            .tabs__item(@click="changeType('beforeMonth')" :class="checkTypeClass('beforeMonth')") 上月
      .area(style="height: calc(100% - 40px); overflow-y: scroll; font-size: 10px;")
        ul.area-tran-list
          li.hs-edit(@click="getDetailData(item)" v-for="item in items" v-if="items.length > 0")
            .tran-item-wrap(style="overflow: scroll;")
              ul.tran-item
                li.tran-item__yellow {{ item.Date }}
                li
                  div
                    span.label 昨餘:
                    span(:class="getMoneyColor(item.YesterdayInterestNum)") {{ item.YesterdayInterestNum | currency }}
                  div
                    span.label 今損:
                    span(:class="getMoneyColor(item.TodayMoney)") {{ item.TodayMoney | currency }}
                  div
                    span.label 餘額:
                    span(:class="getMoneyColor(item.RemainingMoney)") {{ item.RemainingMoney | currency }}
                li
                  div
                    span.label(style="width: 42px;") 手續費:
                    span {{ item.TotalFee }}
                  div
                    span.label 口數:
                    span {{ item.TotalSubmit }}
                  div
                    span.label 轉出:
                    //-正數=儲值 負數=轉出
                    span(v-if="itemsTotal.SaveMoney < 0")
                      span(:class="getMoneyColor(itemsTotal.SaveMoney)") {{ itemsTotal.SaveMoney | currency }}
                    span(v-else) 0
                  div
                    span.label 儲值:
                    //-正數=儲值 負數=轉出
                    span(v-if="itemsTotal.SaveMoney > 0")
                      span(:class="getMoneyColor(itemsTotal.SaveMoney)") {{ itemsTotal.SaveMoney | currency }}
                    span(v-else) 0
          li
            .tran-item-wrap(style="overflow: scroll;")
              ul.tran-item
                li.tran-item__yellow(style="width: 73px") 合計
                li(style="width: 98px")
                  div
                    span.label 昨餘:
                    span -
                  div
                    span.label 今損:
                    span(:class="getMoneyColor(itemsTotal.TodayMoney)") {{ itemsTotal.TodayMoney | currency }}
                  div
                    span.label 餘額:
                    span -
                li
                  div
                    span.label(style="width: 42px;") 手續費:
                    span {{ itemsTotal.TotalFee }}
                  div
                    span.label 口數:
                    span {{ itemsTotal.TotalSubmit }}
                  div
                    span.label 轉出:
                    //-正數=儲值 負數=轉出
                    span(v-if="itemsTotal.SaveMoney < 0")
                      span(:class="getMoneyColor(itemsTotal.SaveMoney)") {{ itemsTotal.SaveMoney | currency }}
                    span(v-else) 0
                  div
                    span.label 儲值:
                    //-正數=儲值 負數=轉出
                    span(v-if="itemsTotal.SaveMoney > 0")
                      span(:class="getMoneyColor(itemsTotal.SaveMoney)") {{ itemsTotal.SaveMoney | currency }}
                    span(v-else) 0
          li(v-if="items.length == 0") 無資料
        template(v-if='showDetail')
          .modals.HistoryWinLoss__detail
            .page
              .header
                .header__left
                  .page__title {{ this.detail.title }}
                .header__title
                .header__right
                  button.button.header-button.back(@click='showDetail = false') 返回
              .main
                BetDetail(:day="detailDay" :detail="detail")
</template>
<script>

import axios from 'axios'
import qs from 'qs'
import BetDetail from "~/components/mobile/BetDetail"

export default {
  data () {
    return {
      showDetail: false,
      form: {
        start: '',
        end: '',
      },
      type: 'today',
      items: [],
      itemsTotal: {
        YesterdayInterestNum: '-',
        TodayMoney: 0,
        RemainingMoney: 0,
        TotalFee: 0,
        TotalSubmit: 0,
        Uppay: 0,
        SaveMoney: 0,
      },
      detailDay: '',
      detail: [],
      coveredArray: [],
      totalLossWinPoint: 0,
    }
  },
  mounted () {
    this.selectDayType('today')
  },
  components: {
    BetDetail,
  },
  methods: {
    checkTypeClass(type) {
      return this.type == type ? 'is-active' : ''
    },
    changeType(type) {
      this.type = type
      this.selectDayType(type)
    },
    getDetailData(item) {
      this.showDetail = true
      this.detail.date = item.Date
      this.detail.todayMoney = item.TodayMoney
      this.detail.remainingMoney = item.RemainingMoney
      this.detail.yesterdayInterestNum = item.YesterdayInterestNum
      this.detail.title = this.detail.date + '下單明細'
    },
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        const userId = this.$store.state.localStorage.userAuth.userId
        const token = this.$store.state.localStorage.userAuth.token
        const lang = this.$store.state.localStorage.lang

        await axios.post(process.env.NUXT_ENV_API_URL + "/query_history_moneylist?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          _this.items = []

          if (response.data.Code == 1) {
            _this.items = response.data.MoneyArray

            //計算昨日權益數
            _this.items = _this.items.map(function (val) {
              val.YesterdayInterestNum = Number(val.RemainingMoney) - Number(val.TouchPoint) + Number(val.Withholding) - Number(val.TodayMoney)
              return val
            })

            //計算total
            _this.items.forEach(function(val) {
              _this.itemsTotal.TodayMoney += Number(val.TodayMoney)
              _this.itemsTotal.TotalFee += Number(val.TotalFee)
              _this.itemsTotal.TotalSubmit += Number(val.TotalSubmit)
              _this.itemsTotal.Uppay += Number(val.Uppay)
              _this.itemsTotal.SaveMoney += Number(val.SaveMoney)
            })
          }
        })
      }
    }
  }
}
</script>