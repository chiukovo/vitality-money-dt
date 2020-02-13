<template lang="pug">
div(class="h-100")
  Dialog(
    :click-type="dialog.clickType",
    :visible.sync="dialog.isOpen"
    :title="dialog.title"
    :size="dialog.size"
    :onlyItem="dialog.onlyItem"
    :itemId="dialog.itemId"
  )
  div(style="height: calc(100% - 64px);" v-show="!firstIn")
    ul.table-dropdown.dropdown-menu(id="customSettingContent" v-show="customSetting")
      li.dropdown-item(href="#", @click="openModal('showHideItem', '自訂商品')") 自訂商品
      li.dropdown-item(href="#", @click="openModal('showHideItemField', '自訂欄位')") 自訂欄位
      .dropdown-divider
      li.dropdown-item.dropdown-toggle(href="#") 字型大小
        MainFontSize
      li.dropdown-item.dropdown-toggle(href="#") 切換漲跌顏色
        SetListDataColor
    table.custom__table.table__dark(:class="'fontStyle-' + fontStyle")
      thead.thead
        tr
          th
            span(v-if="checkHide('商品')") 商品
            .table-toggle
              a(@click.stop="customSetting = !customSetting")
          th(v-if="checkHide('倉位多')") 倉位多
          th(v-if="checkHide('倉位空')") 倉位空
          th(v-if="checkHide('買進價')") 買進價
          th(v-if="checkHide('賣出價')") 賣出價
          th(v-if="checkHide('成交價')") 成交價
          th(v-if="checkHide('漲跌')") 漲跌
          th(v-if="checkHide('漲幅%')") 漲幅%
          th(v-if="checkHide('單量')") 單量
          th(v-if="checkHide('總量')") 總量
          th(v-if="checkHide('昨收價')") 昨收價
          th(v-if="checkHide('開盤價')") 開盤價
          th(v-if="checkHide('最高價')") 最高價
          th(v-if="checkHide('最低價')") 最低價
          th(v-if="checkHide('時間')") 時間
          th(v-if="checkHide('交易')") 交易
          th(v-if="checkHide('最後成交價')" style="width: 100px;") 最後成交價
          th(v-if="checkHide('最後交易日')" style="width: 100px;") 最後交易日
          th(v-if="checkHide('說明')") 說明
          th(v-if="checkHide('商品類別')") 商品類別
      tbody.tbody(@scroll="tbodyScroll($event, true)")
        tr(v-for="row in mainItem" v-if="!row.row_hide" @click="trClick($event)")
          td(v-if="checkHide('商品')")
            .cell(:class="clickItemId == row.product_id ? 'bg__danger' : ''" @click="clickItem(row)")
              span(:class="row.state != 2 ? 'text__secondary' : ''") {{ row.product_name }}
          td(v-if="checkHide('倉位多')")
            .cell(v-if="typeof uncoveredCountDetail[row.product_id] != 'undefined' && uncoveredCountDetail[row.product_id] > 0" class="text__center bg__danger") {{ uncoveredCountDetail[row.product_id] }}
          td(v-if="checkHide('倉位空')")
            .cell(v-if="typeof uncoveredCountDetail[row.product_id] != 'undefined' && uncoveredCountDetail[row.product_id] < 0" class="text__center bg__success") {{ Math.abs(uncoveredCountDetail[row.product_id]) }}
          td(v-if="checkHide('買進價')")
            span(:class="[row.bp_price_change,row.computed_color]") {{ row['bp_price'] }}
          td(v-if="checkHide('賣出價')")
            span(:class="[row.sp_price_change,row.computed_color]") {{ row['sp_price'] }}
          td(v-if="checkHide('成交價')")
            span(:class="[row.newest_price_change,row.computed_color]") {{ row.newest_price }}
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
          td(v-if="checkHide('時間')")
            span(:class="row.newest_time_change") {{ row.newest_time }}
          td(v-if="checkHide('交易')")
            span(:class="row.state_color") {{ row.state_name }}
          td(v-if="checkHide('最後成交價')" style="width: 100px;")
            span(:class="[row.newest_price_change,row.computed_color]") {{ row.newest_price }}
          td(v-if="checkHide('最後交易日')" style="width: 100px;")
            span {{ row.end_date }}
          td(v-if="checkHide('說明')")
            a.table-link(href="#" @click="openModal('userDetail', '商品資訊', '', true, row.product_id)") 說明
          td(v-if="checkHide('商品類別')") CFD
</template>

<script>

import Dialog from "~/components/Dialog"
import MainFontSize from "~/components/UserSetting/MainFontSize"
import SetListDataColor from "~/components/UserSetting/SetListDataColor"
import { mapState } from 'vuex'

export default {
	data() {
	  return {
      dialog: {
        clickType: '',
        isOpen: false,
        title: '',
        size: '',
        onlyItem: '',
        itemId: '',
      },
      customSetting: false,
      firstIn: true,
	  }
	},
  computed: mapState({
    mainItem: 'mainItem',
    clickItemId: 'clickItemId',
    uncoveredCountDetail: 'uncoveredCountDetail',
    fontStyle: state => state.localStorage.customSetting.fontStyle,
    listColorStyle: state => state.localStorage.customSetting.listColorStyle,
  }),
  components: {
    Dialog,
    MainFontSize,
    SetListDataColor,
  },
  mounted() {
    this.firstIn = false
  },
  watch: {
    fontStyle() {
      this.customSetting = false
      this.computedTableContent()
    },
    listColorStyle() {
      this.customSetting = false
    }
  },
  methods: {
    closeSetting() {
      this.customSetting = false
    },
    openModal(type, title, size, onlyItem, itemId) {
      this.dialog.size = ''
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true
      this.customSetting = false
      this.computedTableContent()

      if (typeof onlyItem != 'undefined' && typeof itemId != 'undefined') {
        this.dialog.onlyItem = true
        this.dialog.itemId = itemId
      }
    },
    clickItem(row) {
      //開始新的
      this.preSetClickItemId(row.product_id, row.product_name)
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