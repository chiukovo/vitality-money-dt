<template lang="pug">
.page
  el-dialog(
    :visible.sync='settingShow'
    :modal='false'
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
      :click-type="dialog.clickType",
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
            th(style="width: 120px")
            th(v-if="checkHide('成交價')") 成交
            th(v-if="checkHide('買進價')") 買進
            th(v-if="checkHide('賣出價')") 賣出
            th(v-if="checkHide('漲跌')") 漲跌
            th(v-if="checkHide('漲幅%')") 漲幅%
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
            td(v-if="checkHide('商品')" style="width:120px")
            td(v-if="checkHide('成交價')")
              span(:class="[row.newest_price_change,row.computed_color]") {{ row.newest_price }}
            td(v-if="checkHide('買進價')")
              span(:class="[row.bp_price_change,row.computed_color]") {{ row['bp_price'] }}
            td(v-if="checkHide('賣出價')")
              span(:class="[row.sp_price_change,row.computed_color]") {{ row['sp_price'] }}
            td(v-if="checkHide('漲跌')")
              span(:class="[row.gain_change,row.computed_color]") {{ row.gain }}
            td(v-if="checkHide('漲幅%')")
              span(:class="[row.gain_percent_change,row.computed_color]") {{ row.gain_percent }}%
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
              span(:class="[row.newest_price_change,row.computed_color]") {{ row.newest_price }}
            td(v-if="checkHide('最後交易日')" style="width: 130px;")
              span {{ row.end_date }}
      table.custom__table.mob__table(:class="'fontStyle-' + fontStyle")
        thead.thead
          tr
            th(style="width:120px")
              span 商品
                .table-toggle
                  a(@click.stop="settingShow = true")
        tbody.tbody
          tr(v-for="row in mainItem" v-show="!row.row_hide")
            td(v-if="checkHide('商品')" style="width:120px")
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
  .swiper-scrollbar(slot="scrollbar")
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
      userInfoHeaderShow: false,
      costomShow: false,
      settingShow: false,
      customItemShow: false,
      settingType: 1,
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
    fontStyle: state => state.localStorage.customSetting.fontStyle,
    listColorStyle: state => state.localStorage.customSetting.listColorStyle,
  }),
  watch: {
    fontStyle() {
      this.computedTableContent(true)
    },
  },
  mounted() {
    this.computedTableContent(true)
  },
  methods: {
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
    clickItem({ row }) {
      this.preSetClickItemId(row.product_id, row.product_name)
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