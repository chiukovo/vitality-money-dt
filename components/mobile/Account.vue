<template lang='pug'>
.page
  .main
    .area
      ul.area-account-list
        li
          .area-account-item(@click='handleSystem(1)')
            img(src="~static/images/theme_dt/icon_about_mobile.png")
            .title 會員資訊
        li
          .area-account-item(@click='handleSystem(2)')
            img(src="~static/images/theme_dt/icon_edit_mobile.png")
            .title 修改密碼
        li
          .area-account-item(@click='handleSystem(3)')
            img(src="~static/images/theme_dt/icon_paper_mobile.png")
            .title 公告
        li
          .area-account-item(@click='handleSystem(4)')
            img(src="~static/images/theme_dt/icon_history2_mobile.png")
            .title 帳戶歷史
        li
          .area-account-item(@click='handleSystem(5)')
            img(src="~static/images/theme_dt/icon_cash_mobile.png")
            .title 儲值記錄
        li
          .area-account-item(@click='handleSystem(6)')
            img(src="~static/images/theme_dt/icon_history_mobile.png")
            .title 系統規劃
        li
          .area-account-item(@click="needPoint()")
            img(src="~static/images/theme_dt/icon_getcash2_mobile.png")
            .title 領取試玩
        li
          .area-account-item(@click="openDialog(7, '自訂市場')")
            img(src="~static/images/theme_dt/icon_setsymbol_mobile.png")
            .title 自訂市場
        li
          .area-account-item(@click="openDialog(8, '下單模式')")
            img(src="~static/images/theme_dt/icon_seticon_mobile.png")
            .title 下單模式
        li
          .area-account-item(@click="openDialog(9, '貨幣')")
            img(src="~static/images/theme_dt/icon_exchange_mobile.png")
            .title 貨幣
        li
          .area-account-item(@click="openDialog(10, '下單匣設定')")
            img(src="~static/images/theme_dt/icon_seticon_mobile.png")
            .title 下單匣設定
    UserDetail(v-if='systemShow == 1')
    ChangPassword(v-if='systemShow == 2')
    News(v-if='systemShow == 3')
    HistoryWinLoss(v-if='systemShow == 4')
    StoredRecords(v-if='systemShow == 5')
    SystemItem(v-if='systemShow == 6')
    el-dialog(
      :visible.sync='dialogShow'
      :modal='false'
      v-dialogDrag
      width="300px"
      title='dialogTitle')
      .header-custom(slot='title') {{ dialogTitle }}
      CustomItem(v-if='systemShow == 7')
      div(v-if='systemShow == 8')
        .area-button-group
          button.button(style="padding: 30px 18px;" :class="orderMode == 1 ? 'is-active': ''" @click="setOrderMode(1)" :disabled="orderMode == 1") 模式1
          button.button(style="padding: 30px 18px;" :class="orderMode == 2 ? 'is-active': ''" @click="setOrderMode(2)" :disabled="orderMode == 2") 模式2
        .area-button-group
          button.button(@click="dialogShow = false") 關閉
      div(v-if='systemShow == 9')
        .area
          ul.area-select-list
            li: label.radio
              input.radio__input(type="radio" v-model="moneyType" value="USD" disabled)
              span.radio__label USD
            li: label.radio
              input.radio__input(type="radio" v-model="moneyType" value="EUR" disabled)
              span.radio__label EUR
            li: label.radio
              input.radio__input(type="radio" v-model="moneyType" value="JPY" disabled)
              span.radio__label JPY
            li: label.radio
              input.radio__input(type="radio" v-model="moneyType" value="HKD" disabled)
              span.radio__label HKD
            li: label.radio
              input.radio__input(type="radio" v-model="moneyType" value="NTD" disabled)
              span.radio__label NTD
        .area-button-group
          button.button(@click="dialogShow = false") 關閉
      div(v-if='systemShow == 10')
        .area(style="padding: 10px 0 20px; text-align: center;")
          el-input-number(v-model="defaultQuantity")
        .area-button-group
          button.button(@click="setDefaultQuantity") 確定
          button.button(@click="dialogShow = false") 取消
</template>

<script>

import UserDetail from "~/components/mobile/UserDetail"
import News from "~/components/mobile/News"
import Setting from "~/components/mobile/Setting"
import ChangPassword from "~/components/mobile/ChangPassword"
import HistoryWinLoss from "~/components/mobile/HistoryWinLoss"
import StoredRecords from "~/components/mobile/StoredRecords"
import SystemItem from "~/components/mobile/SystemItem"
import CustomItem from "~/components/mobile/CustomItem"

import { mapState } from 'vuex'

export default {
  components: {
    UserDetail,
    News,
    Setting,
    ChangPassword,
    HistoryWinLoss,
    StoredRecords,
    SystemItem,
    CustomItem,
	},
  data () {
    return {
      systemShow: 0,
      dialogShow: false,
      dialogTitle: '',
      orderMode: 1,
      moneyType: 'NTD',
      defaultQuantity: 1,
    };
  },
  mounted() {
    const orderMode = this.$store.state.localStorage.customSetting.orderMode
    const defaultQuantity = this.$store.state.localStorage.customSetting.defaultQuantity

    if (typeof orderMode != 'undefined') {
      this.orderMode = orderMode
    }

    if (typeof defaultQuantity != 'undefined') {
      this.defaultQuantity = defaultQuantity
    }
  },
  methods: {
    setOrderMode(type) {
      this.orderMode = type
      this.$store.commit('setOrderMode', type)
      this.dialogShow = false
    },
    setDefaultQuantity() {
      this.$store.commit('setDefaultQuantity', this.defaultQuantity)
      this.dialogShow = false
    },
    openDialog(e, title) {
      this.dialogShow = true
      this.dialogTitle = title
      this.systemShow = e
    },
    handleSystem(e) {
      this.systemShow = e
    },
    needPoint() {
      this.$alert('請聯繫客服人員', '注意', {
        confirmButtonText: '確定',
        callback: action => {
        }
      });
    }
  }
}
</script>