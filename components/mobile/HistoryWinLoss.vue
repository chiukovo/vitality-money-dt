<template lang='pug'>
.modals.HistoryWinLoss
  .page
    .header
      .header__left
        .page__title 帳戶歷史
      .header__title
      .header__right
        button.button.header-button.back(@click='$parent.systemShow = 0') 返回
    .main
      .area
        .area__header
          .selectDayType-tabs.tabs-nav.tabs-nav-theme1
            .tabs__item(@click="selectDayType('thisWeek')") 本週
            .tabs__item(@click="selectDayType('beforeWeek')") 上週
            .tabs__item(@click="selectDayType('thisMonth')") 本月
            .tabs__item(@click="selectDayType('beforeMonth')") 上月
      .area(style="height: calc(100% - 40px); overflow-y: scroll;")
        ul.area-list
          li(@click="getDetailData(item)" v-for="item in items")
            span {{ item.Date }}
            span 額度:
            span(:class="item.TouchPoint > 0 ? 'text__danger' : 'text__success'") {{ item.TouchPoint | currency }}
            span 損益:
            span(:class="item.TodayMoney > 0 ? 'text__danger' : 'text__success'") {{ item.TodayMoney | currency }}
            span 餘額:
            span(:class="item.RemainingMoney > 0 ? 'text__danger' : 'text__success'") {{ item.RemainingMoney | currency }}
            span 口數: {{ item.TotalSubmit }}
            span 交收:
            span(:class="item.Uppay > 0 ? 'text__danger' : 'text__success'") {{ item.Uppay | currency }}
            i.el-icon-arrow-right
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
      items: [],
      detailDay: '',
      detail: [],
      coveredArray: [],
      totalLossWinPoint: 0,
    }
  },
  mounted () {
    this.selectDayType('thisWeek')
  },
  components: {
    BetDetail,
  },
  methods: {
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