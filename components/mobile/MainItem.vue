<template lang="pug">
.page
  el-dialog(
    :visible.sync='settingShow'
    :modal='false'
    v-dialogDrag
    :width="customItemShow ? '300px' : ''"
    :before-close='handleClose')
    .header-custom(slot='title') 設定
    CustomItem(v-if='customItemShow')
    ul.el-dialog__list(v-else)
      li.button(@click="clickMainItem()") 市場總覽
      li.button(@click="customItemShow = true") 自訂市場
      li.button(@click="clickUserDetailList()") 會員明細
  .main.mainItem
    Dialog(
      :click-type="dialog.clickType"
      :visible.sync="dialog.isOpen")
    .mainItem-tabs.tabs-nav
      .tabs__item(@click="clickTab(1)" :class="{'is-active': $store.state.mainItemTabs == 1}") 自訂
      .tabs__item(@click="clickTab(2)" :class="{'is-active': $store.state.mainItemTabs == 2}") 指數
      .tabs__item(@click="clickTab(3)" :class="{'is-active': $store.state.mainItemTabs == 3}") 指數期貨
      .tabs__item(@click="clickTab(4)" :class="{'is-active': $store.state.mainItemTabs == 4}") 商品期貨
      .tabs__item(@click="clickTab(5)" :class="{'is-active': $store.state.mainItemTabs == 5}") 加密貨幣
    //-市場總覽
    div(v-if="settingType == 1" style="height: calc(100% - 43px)")
      table.custom__table(:class="'fontStyle-' + fontStyle")
        thead.thead
          tr
            th(style="width: 110px")
            th(v-if="checkHide('成交價')") 成交
            th(v-if="checkHide('漲跌')") 漲跌
            th(v-if="checkHide('漲幅%')") 漲幅%
            th(v-if="checkHide('買進價')") 買進
            th(v-if="checkHide('賣出價')") 賣出
            th(v-if="checkHide('單量')") 單量
            th(v-if="checkHide('總量')") 總量
            th(v-if="checkHide('昨收價')") 昨收
            th(v-if="checkHide('開盤價')") 開盤
            th(v-if="checkHide('最高價')") 最高
            th(v-if="checkHide('最低價')") 最低
            th(v-if="checkHide('時間')" style="width: 100px") 時間
            th(v-if="checkHide('交易')") 交易
            th(v-if="checkHide('最後成交價')" style="width: 130px;") 最後成交價
            th(v-if="checkHide('最後交易日')" style="width: 130px;") 最後交易日
        tbody.tbody(@scroll="tbodyScroll($event, false, true)")
          tr(v-for="row in mainItem" v-show="!row.row_hide")
            td(v-if="checkHide('商品')" style="width:110px")
              .first
                .myname
                  .mycfdw(:class="row.state_name == '未開盤' ? 'text__secondary' : ''") {{ row['product_name'] }}{{ row['monthday'] }}
                  .mycfd
                .mybox(v-if="typeof $store.state.uncoveredCountDetail[row['product_id']] != 'undefined'")
                  .nopingb {{ $store.state.uncoveredCountDetail[row['product_id']] > 0 ? $store.state.uncoveredCountDetail[row['product_id']] : 0 }}
                  .nopings {{ $store.state.uncoveredCountDetail[row['product_id']] < 0 ? Math.abs($store.state.uncoveredCountDetail[row['product_id']]) : 0 }}
            td(v-if="checkHide('成交價')" @click="openOperation(row)")
              span(:class="[row.newest_price_change,row.computed_color]") {{ row.newest_price }}
            td(v-if="checkHide('漲跌')")
              span(:class="[row.gain_change,row.computed_color]") {{ row.gain }}
            td(v-if="checkHide('漲幅%')")
              span(:class="[row.gain_percent_change,row.computed_color]") {{ row.gain_percent }}%
            td(v-if="checkHide('買進價')")
              span(:class="[row.bp_price_change,row.computed_color]") {{ row['bp_price'] }}
            td(v-if="checkHide('賣出價')")
              span(:class="[row.sp_price_change,row.computed_color]") {{ row['sp_price'] }}
            td(v-if="checkHide('單量')")
              span(:class="row.newest_qty_change") {{ row.newest_qty }}
            td(v-if="checkHide('總量')")
              span(:class="[row.total_qty_change,row.computed_color]") {{ row.total_qty }}
            td(v-if="checkHide('昨收價')")
              span {{ row.yesterday_close_price }}
            td(v-if="checkHide('開盤價')")
              span {{ row.open_price }}
            td(v-if="checkHide('最高價')")
              span(:class="row.computed_color") {{ row.highest_price }}
            td(v-if="checkHide('最低價')")
              span(:class="row.computed_color") {{ row.lowest_price }}
            td(v-if="checkHide('時間')" style="width: 100px")
              span(:class="row.newest_time_change") {{ row.newest_time }}
            td(v-if="checkHide('交易')")
              span(:class="row.state_color") {{ row.state_name }}
            td(v-if="checkHide('最後成交價')" style="width: 130px;")
              span {{ row.yesterday_last_price }}
            td(v-if="checkHide('最後交易日')" style="width: 130px;")
              span {{ row.end_date }}
      table.custom__table.mob__table(:class="'fontStyle-' + fontStyle")
        thead.thead
          tr
            th(style="width:110px")
              span 商品
                .table-toggle
                  a(@click.stop="settingShow = true")
        tbody.tbody(@scroll="tbodyScroll($event, false, true)")
          tr(v-for="row in mainItem" v-show="!row.row_hide")
            td(v-if="checkHide('商品')" style="width:110px" :class="row.state_color" @click="clickItem(row)")
              .first
                .myname
                  .mycfdw(:class="row.state_name == '未開盤' ? 'text__secondary' : ''") {{ row['product_name'] }}{{ row['monthday'] }}
                  .mycfd
                .mybox(v-if="typeof $store.state.uncoveredCountDetail[row['product_id']] != 'undefined'")
                  .nopingb {{ $store.state.uncoveredCountDetail[row['product_id']] > 0 ? $store.state.uncoveredCountDetail[row['product_id']] : 0 }}
                  .nopings {{ $store.state.uncoveredCountDetail[row['product_id']] < 0 ? Math.abs($store.state.uncoveredCountDetail[row['product_id']]) : 0 }}
                //- .mybar
                  .progress-bar.progress-bar__total
                    .progress-bar__inner(style="width: 10%")
    //-會員明細
    div(v-if="settingType == 3")
      UserDetailList
    //-下單打開
    div(v-if="operatingShow")
      el-dialog(
        :visible.sync='operatingShow'
        :modal='false'
        v-dialogDrag
        width="96%")
        .header-custom(slot='title')
          |  下單
        .area
          ul.area-order.area-order-theme3
            li
              label.title 商品
                span {{ nowMainItem.product_name }}
            li
              label.radio.inline
                input.radio__input(type="radio" v-model='buyType' value='0')
                span.radio__label 市價
              label.radio.inline
                input.radio__input(type="radio" v-model='buyType' value='2')
                span.radio__label 收盤單
              label.radio.inline
                input.radio__input(type="radio" v-model='buyType' value='1')
                span.radio__label 限價單
            li
              label.title 限價
              .number-input(:class="buyType != 1 ? 'disabled' : ''")
                button.button__decrease(@click="addLimitPoint('--')")
                input(type="text" v-model='nowPrice' :min="0")
                button.button__increase(@click="addLimitPoint('++')")
            li
              label.title 口數
              .number-input
                button.button__decrease(@click="changeSubmitNum('-')")
                input(type="text" v-model='submitNum' :min="0")
                button.button__increase(@click="changeSubmitNum('+')")
            li.flex-direction-column
              .text 獲利點需大於
                span  {{ profitMin }}
                |  點點數
              .number-input
                button.button__decrease(type="button" @click="profit--")
                input(type="text" v-model='profit')
                button.button__increase(type="button" @click="profit++")
            li.flex-direction-column
              .text 損失點需大於
                span  {{ damageMin }}
                |  點點數
              .number-input
                button.button__decrease(type="button" @click="damage--")
                input(type="text" v-model='damage')
                button.button__increase(type="button" @click="damage++")
            li.button-group
              button.button__danger(@click="checkOrder(0)") 多單
              button.button__success(@click="checkOrder(1)") 空單
    //-下單確認
    div(v-if="orderConfirm")
      el-dialog(
        :visible.sync='orderConfirm'
        :modal='false'
        v-dialogDrag
        width="60%"
        title='確認下單')
        .header-custom(slot='title')
          |  確認下單
        .p-2
          table.popupAllSingleSelectNo.my-2(v-for="item in confirmData")
            tbody
              tr
                td.title 會員
                td {{ item.userName }}
              tr
                td.title 商品
                td {{ item.name }}
              tr
                td.title 委託
                td {{ item.price }}
              tr
                td.title 多空
                td
                  span(:class="item.buy == 0 ? 'text__danger' : 'text__success'") {{ item.buy == 0 ? '多' : '空' }}
              tr
                td.title 口數
                td {{ item.submit }}
              tr
                td.title 獲利點
                td {{ item.profit }}
              tr
                td.title 損失點
                td {{ item.damage }}
        .dialog__footer
          button.button.button__light(@click="orderConfirm = false") 取消
          button.button(@click="doOrder") 確認
</template>

<script>

import UserInfoHeader from "~/components/mobile/UserInfoHeader"
import CustomItem from "~/components/mobile/CustomItem"
import UserDetailList from "~/components/mobile/UserDetailList"
import Dialog from "~/components/Dialog"

import { mapState } from 'vuex'

export default {
	data() {
	  return {
      tabs: 1,
      sendText: '',
      userInfoHeaderShow: false,
      costomShow: false,
      settingShow: false,
      customItemShow: false,
      operatingShow: false,
      orderConfirm: false,
      customGroup: [],
      settingType: 1,
      buyType: 0,
      profit: 0,
      profitMin: 0,
      damage: 0,
      damageMin: 0,
      nowPrice: 1,
      submitNum: 1,
      submitStep: 1,
      dialog: {
        clickType: '',
        isOpen: false,
      },
	  }
	},
  components: {
    UserInfoHeader,
    CustomItem,
    UserDetailList,
    Dialog
  },
  computed: mapState({
    mainItem: 'mainItem',
    clickItemId: 'clickItemId',
    nowMainItem: 'nowMainItem',
    fontStyle: state => state.localStorage.customSetting.fontStyle,
    listColorStyle: state => state.localStorage.customSetting.listColorStyle,
  }),
  watch: {
    clickItemId() {
      this.getNowPrice()
    },
    fontStyle() {
      this.computedTableContent(true)
    },
    damage() {
      //最小為零
      if (this.damage < 0) {
        this.damage = 0
      }
    },
    profit() {
      //最小為零
      if (this.profit < 0) {
        this.profit = 0
      }
    },
    submitNum(newNum, oldNum) {
      if (newNum == 0 && oldNum == 1) {
        this.submitNum = 0.9
        this.submitStep = 0.1
      }

      if (newNum == 1.1 && oldNum == 1) {
        this.submitNum = 2
        this.submitStep = 1
      }

      if (newNum < 0) {
        this.submitNum = 0
      }
    }
  },
  mounted() {
    this.computedTableContent(true)
  },
  methods: {
    getNowPrice() {
      const itemId = this.$store.state.clickItemId
      const nowNewPrice = this.$store.state.nowNewPrice

      this.nowPrice = nowNewPrice[itemId]
    },
    checkOrder(type) {
      const clickItem = this.$store.state.clickItemId
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const nowPrice = this.buyType == 1 ? this.nowPrice : 0
      const customGroup = this.$cookies.get('customGroup')

      if (typeof customGroup == 'undefined') {
        customGroup = []
      }

      //檢查是否有點獲利點or損失點 並小於最小值
      if (this.profit > 0 && this.profit < this.profitMin) {
        this.$alert('獲利點需大於等於: ' + this.profitMin + '點', '警告!')
        return
      }

      if (this.damage > 0 && this.damage < this.damageMin) {
        this.$alert('損失點需大於等於: ' + this.damageMin + '點', '警告!')
        return
      }

      this.sendText = 's:' + userId + ',' + type + ',' + this.submitNum + ',' + clickItem + ',' + this.profit + ',' + this.damage + ',' + nowPrice + ',' + this.buyType + ',' + token + ',' + isMobile

      let buyTypeName

      if (this.buyType == 0) {
        buyTypeName = '市價單'
      } else if (this.buyType == 1) {
        buyTypeName = '限價單'
      } else if (this.buyType == 2) {
        buyTypeName = '收盤單'
      }

      this.confirmData = [{
        name: this.$store.state.itemName,
        userName: this.$store.state.userInfo.Account,
        buy: type,
        price: buyTypeName,
        submit: this.submitNum,
        profit: this.profit,
        damage: this.damage,
      }]

      //看是否有勾選下單不確認
      let noConfirm = false

      customGroup.forEach(function(val){
        if (val == 'noConfirm') {
          noConfirm = true
        }
      })

      if (noConfirm) {
        this.doOrder()
        this.operatingShow = false
      } else {
        this.orderConfirm = true
        this.operatingShow = false
      }
    },
    doOrder() {
      const _this = this
      setTimeout(function(){ _this.$socketOrder.send(_this.sendText) }, 500)
      this.orderConfirm = false
    },
    addLimitPoint(type) {
      if (this.buyType != 1) {
        return
      }

      if (type == '++') {
        this.nowPrice++
      } else if (type == '--') {
        this.nowPrice--
      }
    },
    changeSubmitNum(type) {
      if (type == '+') {
        this.submitNum = parseFloat((this.submitNum + this.submitStep).toFixed(10))
      } else {
        this.submitNum = parseFloat((this.submitNum - this.submitStep).toFixed(10))
      }
    },
    openOperation(row) {
      const _this = this

      this.preSetClickItemId(row.product_id, row.product_name)
      this.$store.state.commidyArray.forEach(function(val) {
        if (val.ID == row.product_id) {
          _this.profitMin = val.StopPoint
          _this.damageMin = val.StopPoint
        }
      })

      this.getNowPrice()
      this.operatingShow = true
    },
    clickTab(type) {
      this.$store.commit('setTabs', type)
    },
    clickMainItem() {
      this.settingType = 1
      this.customItemShow = false
      this.settingShow = false
    },
    clickUserDetailList() {
      this.settingType = 3
      this.customItemShow = false
      this.settingShow = false
    },
    clickItem(row) {
      this.preSetClickItemId(row.product_id, row.product_name)
      this.$emit('handleTab', 3)
    },
    handleClose() {
      this.customItemShow = false
      this.settingShow = false
    },
    checkHide(name) {
      //判斷欄位是否顯示
      const customItemFieldSetting = this.$store.state.customItemFieldSetting
      let needShow = true

      if (customItemFieldSetting.length > 0) {
        customItemFieldSetting.forEach(function(check) {
          if (name == check.name) {
            needShow = check.show
          }
        })
      }

      return needShow
    },
  }
}
</script>