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
      .area(style="height: calc(100% - 40px); overflow-y: scroll;")
        ul.area-tran-list
          li.hs-edit(@click="getDetailData(item)" v-for="item in items" v-if="items.length > 0")
            ul.tran-item
              li.tran-item__yellow {{ item.Date }}
              li
                div
                  span.label 額度:
                  span(:class="item.TouchPoint > 0 ? 'text__danger' : 'text__success'") {{ item.TouchPoint | currency }}
                div
                  span.label 損益:
                  span(:class="item.TodayMoney > 0 ? 'text__danger' : 'text__success'") {{ item.TodayMoney | currency }}
                div
                  span.label 餘額:
                  span(:class="item.RemainingMoney > 0 ? 'text__danger' : 'text__success'") {{ item.RemainingMoney | currency }}
              li
                .label 口數: {{ item.TotalSubmit }}
                .label 交收:
                span(:class="item.Uppay > 0 ? 'text__danger' : 'text__success'") {{ item.Uppay | currency }}
          li(v-else) 無資料
        template(v-if='showDetail')
          .modals.HistoryWinLoss__detail
            .page
              .header
                .header__left
                  .page__title {{ detailDay }}下單明細
                .header__title
                .header__right
                  button.button.header-button.back(@click='showDetail = false') 返回
              .main
                BetDetail(:day="detailDay")
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
      this.detailDay = item.Date
    },
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        const userId = this.$store.state.localStorage.userAuth.userId
        const token = this.$store.state.localStorage.userAuth.token
        const lang = this.$store.state.localStorage.lang

        await axios.post(process.env.NUXT_ENV_API_URL + "/query_moneylist?lang=" + lang, qs.stringify({
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
          }
        })
      }
    }
  }
}
</script>