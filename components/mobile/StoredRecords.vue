<template lang='pug'>
.modals.StoredRecords
  .page
    .header
      .header__left
        .page__title 儲值紀錄
      .header__title
      .header__right
        button.button.header-button.back(@click='$parent.systemShow = 0') 返回
    .main
      .area
        .area__header
          .tabs-nav.tabs-nav-theme1
            .tabs__item(@click="changeType('today')" :class="checkTypeClass('today')") 今日
            .tabs__item(@click="changeType('thisWeek')" :class="checkTypeClass('thisWeek')") 本週
            .tabs__item(@click="changeType('beforeWeek')" :class="checkTypeClass('beforeWeek')") 上週
            .tabs__item(@click="changeType('thisMonth')" :class="checkTypeClass('thisMonth')") 本月
            .tabs__item(@click="changeType('beforeMonth')" :class="checkTypeClass('beforeMonth')") 上月
      table.custom__table.large
        thead.thead
          tr
            th 儲值金額
            th 類型
            th 儲值日期
        tbody.tbody(@scroll="tbodyScroll($event)")
          tr(v-for="row in items")
            td {{ row.SaveMoney }}
            td
              span {{ row['MoneyType'] == 0 ? '餘額' : '信用額度' }}
            td {{ row.MoneyDate }}
          tr(class="non-data" v-if="items.length == 0")
            td 無資料
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
      items: [],
      type: 'today',
    }
  },
  mounted () {
    this.selectDayType('today')
  },
  methods: {
    checkTypeClass(type) {
      return this.type == type ? 'is-active' : ''
    },
    changeType(type) {
      this.type = type
      this.selectDayType(type)
    },
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        const userId = this.$store.state.localStorage.userAuth.userId
        const token = this.$store.state.localStorage.userAuth.token
        const lang = this.$store.state.localStorage.lang

        await axios.post(process.env.NUXT_ENV_API_URL + "/query_savemoneylist?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          const result = response.data

          if (result.Code == 1) {
            _this.items = result.MoneyArray
            _this.computedTableContent()
          }
        })
      }
    }
  }
}
</script>