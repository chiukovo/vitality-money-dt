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
  div(id="mainItemContent" style="height: calc(100% - 64px);")
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
            .cell(:style="computedStyleWidth(50)")
              span(v-if="checkHide('商品')") 商品
              .table-toggle
                a(@click.stop="customSetting = !customSetting")
          th(v-if="checkHide('倉位多')")
            .cell 倉位多
          th(v-if="checkHide('倉位空')")
            .cell 倉位空
          th(v-if="checkHide('買進價')")
            .cell 買進價
          th(v-if="checkHide('賣出價')")
            .cell 賣出價
          th(v-if="checkHide('成交價')")
            .cell 成交價
          th(v-if="checkHide('漲跌')")
            .cell 漲跌
          th(v-if="checkHide('漲幅%')")
            .cell 漲幅%
          th(:v-if="checkHide('單量')")
            .cell 單量
          th(v-if="checkHide('總量')")
            .cell(:style="computedStyleWidth(50)") 總量
          th(v-if="checkHide('昨收價')")
            .cell 昨收價
          th(v-if="checkHide('開盤價')")
            .cell 開盤價
          th(v-if="checkHide('最高價')")
            .cell 最高價
          th(v-if="checkHide('最低價')")
            .cell 最低價
          th(v-if="checkHide('時間')")
            .cell(:style="computedStyleWidth(50)") 時間
          th(v-if="checkHide('交易')")
            .cell 交易
          th(v-if="checkHide('最後成交價')")
            .cell(:style="computedStyleWidth(70)") 最後成交價
          th(v-if="checkHide('最後交易日')")
            .cell(:style="computedStyleWidth(70)") 最後交易日
          th(v-if="checkHide('說明')")
            .cell 說明
          th(v-if="checkHide('商品類別')")
            .cell(:style="computedStyleWidth(30)") 商品類別
      tbody.tbody(@scroll="tbodyScroll")
        tr(v-for="row in mainItem")
          td(v-if="checkHide('商品')")
            .cell(:style="computedStyleWidth(50)" :class="clickItemId == row.product_id ? 'bg__danger' : ''" @click="clickItem(row)") {{ row.product_name }}
          td(v-if="checkHide('倉位多')")
            .cell(v-if="typeof $store.state.uncoveredCountDetail[row.product_id] != 'undefined'")
              span(class="text__center bg__danger" v-if="$store.state.uncoveredCountDetail[row.product_id] > 0") {{ $store.state.uncoveredCountDetail[row.product_id] }}
          td(v-if="checkHide('倉位空')")
            .cell(v-if="typeof $store.state.uncoveredCountDetail[row.product_id] != 'undefined'")
              span(class="text__center bg__success" v-if="$store.state.uncoveredCountDetail[row.product_id] < 0") {{ Math.abs($store.state.uncoveredCountDetail[row.product_id]) }}
          td(v-if="checkHide('買進價')")
            .cell(:class="row.computed_color")
              span(:class="row.bp_price_change") {{ row['bp_price'] }}
          td(v-if="checkHide('賣出價')")
            .cell(:class="row.computed_color")
              span(:class="row.sp_price_change") {{ row['sp_price'] }}
          td(v-if="checkHide('成交價')")
            .cell(:class="row.computed_color")
              span(:class="row.newest_price_change") {{ row.newest_price }}
          td(v-if="checkHide('漲跌')")
            .cell(:class="row.computed_color")
              span(:class="row.gain_change") {{ row.gain }}
          td(v-if="checkHide('漲幅%')")
            .cell(:class="row.computed_color")
              span(:class="row.gain_percent_change") {{ row.gain_percent }}%
          td(v-if="checkHide('單量')")
            span(:class="row.newest_qty_change") {{ row.newest_qty }}
          td(v-if="checkHide('總量')")
            .cell(:style="computedStyleWidth(50)" :class="row.computed_color")
              span(:class="row.total_qty_change") {{ row.total_qty }}
          td(v-if="checkHide('昨收價')")
            .cell
              span {{ row.yesterday_close_price }}
          td(v-if="checkHide('開盤價')")
            .cell
              span {{ row.open_price }}
          td(v-if="checkHide('最高價')")
            .cell
              span(:class="row.computed_color") {{ row.highest_price }}
          td(v-if="checkHide('最低價')")
            .cell
              span(:class="row.computed_color") {{ row.lowest_price }}
          td(v-if="checkHide('時間')")
            .cell(:style="computedStyleWidth(50)")
              span(:class="row.newest_time_change") {{ row.newest_time }}
          td(v-if="checkHide('交易')")
            .cell
              span(:class="row.state_color") {{ row.state_name }}
          td(v-if="checkHide('最後成交價')")
            .cell(:style="computedStyleWidth(70)" :class="row.computed_color")
              span(:class="row.newest_price_change") {{ row.newest_price }}
          td(v-if="checkHide('最後交易日')")
            .cell(:style="computedStyleWidth(70)")
              span {{ row.end_date }}
          td(v-if="checkHide('說明')")
            .cell
              a.table-link(href="#" @click="openModal('userDetail', '商品資訊', '', true, row.product_id)") 說明
          td(v-if="checkHide('商品類別')")
            .cell(:style="computedStyleWidth(30)") CFD
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
	  }
	},
  computed: mapState({
    mainItem: 'mainItem',
    clickItemId: 'clickItemId',
    fontStyle: state => state.localStorage.customSetting.fontStyle,
    listColorStyle: state => state.localStorage.customSetting.listColorStyle,
  }),
  components: {
    Dialog,
    MainFontSize,
    SetListDataColor,
  },
  updated() {
    const _this = this

    _this.$nextTick(function () {
      _this.computedMainItemContent()
    })
  },
  watch: {
    fontStyle() {
    }
  },
  methods: {
    computedMainItemContent() {
      let content = document.querySelector('#mainItemContent')
      let tbody = document.querySelector('.custom__table .tbody')
      let thead = document.querySelector('.custom__table .thead')
      let w = content.offsetWidth
      let h = content.offsetHeight

      if (w + 'px' == tbody.style.width && w + 'px' == thead.style.width) {
        if (tbody.style.height == h - 20 + 'px') {
          return
        }
      }

      tbody.style.width = w + 'px'
      thead.style.width = w + 'px'
      tbody.style.height = h - 20 + 'px'
    },
    tbodyScroll() {
      //tbody scrollleft
      let tbody = document.querySelector('.custom__table .tbody')
      let thead = document.querySelector('.custom__table .thead')
      let tbodyFirst = document.querySelectorAll('.custom__table .tbody td:nth-child(1)')
      let theadFirst = document.querySelector('.custom__table .thead th:nth-child(1)')
      const scrollLeft = tbody.scrollLeft

      thead.style.left = '-' + scrollLeft + 'px'
      theadFirst.style.left = scrollLeft + 'px'

      for (let num = 0; num < tbodyFirst.length; num++) {
        tbodyFirst[num].style.left = scrollLeft + 'px'
      }
    },
    computedStyleWidth(sourceWidth) {
      let needAdd = 0
      let result = 0
      sourceWidth = typeof sourceWidth == 'undefined' ? 50 : sourceWidth

      switch (this.fontStyle) {
        case 0:
        case 1:
          result = sourceWidth + 50
          break
        case 2:
          result = sourceWidth + 70
          break
        case 3:
          result = sourceWidth + 80
          break
      }

      return 'width:' + result + 'px'
    },
    closeSetting() {
      this.customSetting = false
    },
    openModal(type, title, size, onlyItem, itemId) {
      this.dialog.size = ''
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true

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
    rowClass({ row, column, columnIndex }) {
      if (row.row_hide) {
        return 'hide'
      }
    },
  }
}
</script>