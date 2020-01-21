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
  div(style="height: calc(100% - 64px);")
    ul.table-dropdown.dropdown-menu(id="customSettingContent" v-show="customSetting")
      li.dropdown-item(href="#", @click="openModal('showHideItem', '自訂商品')") 自訂商品
      li.dropdown-item(href="#", @click="openModal('showHideItemField', '自訂欄位')") 自訂欄位
      .dropdown-divider
      li.dropdown-item.dropdown-toggle(href="#") 字型大小
        MainFontSize
      li.dropdown-item.dropdown-toggle(href="#") 切換漲跌顏色
        SetListDataColor
    client-only
      vxe-table.table__dark(
        ref="xTable"
        :class="'fontStyle-' + fontStyle"
        id="mainItemTable"
        :data='mainItem'
        :cell-class-name='tableCellClassName'
        max-width="100%"
        height="100%"
        size="mini"
        column-min-width="60"
        align="right"
        stripe
        border
        auto-resize
        highlight-hover-row)
        vxe-table-column(:width="computedStyleWidth(50)" fixed="left" align="left" show-header-overflow)
          template(v-slot:header="{column}") 商品
            .table-toggle
              a(@click.stop="customSetting = !customSetting")
          template(slot-scope='scope' v-if="checkHide('商品')")
            div(:class="clickItemId == scope.row['product_id'] ? 'bg__danger' : ''"  @click="clickItem(scope.row)")
              span(:class="scope.row.state_name == '未開盤' ? 'text__secondary' : ''") {{ scope.row['product_name'] }}{{ scope.row['monthday'] }}
        vxe-table-column(:width="computedStyleWidth(10)" title='倉位多' align="center" v-if="checkHide('倉位多')")
          template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
            span(class="text__center bg__danger" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] > 0") {{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}
        vxe-table-column(:width="computedStyleWidth(10)" title='倉位空' align="center" v-if="checkHide('倉位空')")
          template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
            span(class="text__center bg__success" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] < 0") {{ Math.abs($store.state.uncoveredCountDetail[scope.row['product_id']]) }}
        vxe-table-column(:width="computedStyleWidth(10)" title='買進價' v-if="checkHide('買進價')")
          template(slot-scope='scope')
            span(:class="scope.row['bp_price_change']") {{ scope.row['bp_price'] }}
        vxe-table-column(:width="computedStyleWidth(10)" title='賣出價' v-if="checkHide('賣出價')")
          template(slot-scope='scope')
            span(:class="scope.row['sp_price_change']") {{ scope.row['sp_price'] }}
        vxe-table-column(:width="computedStyleWidth(10)" title='成交價' v-if="checkHide('成交價')")
          template(slot-scope='scope')
            span(:class="scope.row['newest_price_change']") {{ scope.row['newest_price'] }}
        vxe-table-column(title='漲跌' v-if="checkHide('漲跌')")
          template(slot-scope='scope')
            span(:class="scope.row['gain_change']") {{ scope.row['gain'] }}
        vxe-table-column(:width="computedStyleWidth(10)" title='漲幅%' v-if="checkHide('漲幅%')")
          template(slot-scope='scope')
            span(:class="scope.row['gain_percent_change']") {{ scope.row['gain_percent'] }}%
        vxe-table-column(title='單量' v-if="checkHide('單量')")
          template(slot-scope='scope')
            span(:class="scope.row['newest_qty_change']") {{ scope.row['newest_qty'] }}
        vxe-table-column(:width="computedStyleWidth(50)" title='總量' v-if="checkHide('總量')")
          template(slot-scope='scope')
            span(:class="scope.row['total_qty_change']") {{ scope.row['total_qty'] }}
        vxe-table-column(:width="computedStyleWidth(10)" title='昨收價' v-if="checkHide('昨收價')")
          template(slot-scope='scope') {{ scope.row['yesterday_close_price'] }}
        vxe-table-column(:width="computedStyleWidth(10)" title='開盤價' v-if="checkHide('開盤價')")
          template(slot-scope='scope') {{ scope.row['open_price']}}
        vxe-table-column(:width="computedStyleWidth(10)" title='最高價' v-if="checkHide('最高價')")
          template(slot-scope='scope') {{ scope.row['highest_price']}}
        vxe-table-column(:width="computedStyleWidth(10)" title='最低價' v-if="checkHide('最低價')")
          template(slot-scope='scope') {{ scope.row['lowest_price']}}
        vxe-table-column(:width="computedStyleWidth(50)" title='時間' v-if="checkHide('時間')")
          template(slot-scope='scope')
            span(:class="scope.row['newest_time_change']") {{ scope.row['newest_time'] }}
        vxe-table-column(:width="computedStyleWidth(10)" title='交易' align="center" v-if="checkHide('交易')")
          template(slot-scope='scope') {{ scope.row['state_name'] }}
        vxe-table-column(:width="computedStyleWidth(70)" title='最後成交價' v-if="checkHide('最後成交價')")
          template(slot-scope='scope')
            span(:class="scope.row['newest_price_change']") {{ scope.row['newest_price'] }}
        vxe-table-column(:width="computedStyleWidth(70)" title='最後交易日' v-if="checkHide('最後交易日')")
          template(slot-scope='scope') {{ scope.row['end_date'] }}
        vxe-table-column(title='說明' align="center" v-if="checkHide('說明')")
          template(slot-scope='scope')
            a.table-link(href="#" @click="openModal('userDetail', '商品資訊', '', true, scope.row.product_id)") 說明
        vxe-table-column(:width="computedStyleWidth(30)" title='商品類別' align="center" v-if="checkHide('商品類別')")
          template(slot-scope='scope') CFD
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
  props: ['tabs'],
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
  mounted() {
    const _this = this

    document.body.addEventListener("click", function(e) {
      _this.closeSetting()
    })
  },
  watch: {
    clickItemId(id) {
      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'chart',
        'num': 1
      })

      this.$store.dispatch('CALL_CHANGE_CHART_SYMBOL', id);
    },
    fontStyle() {
      this.$refs.xTable.refreshColumn()
    }
  },
  methods: {
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

      return result + 'px'
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
      //取消
      this.$store.commit('sendMessage', this.cancelAllFive())
      this.$store.commit('setClickItemId', {
        id: row.product_id,
        name: row.product_name
      })
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
    tableCellClassName({ row, column, columnIndex }) {
      //判斷是否顯示
      //指數
      if (this.tabs == 2) {
        if (row.type != 'index') {
          return 'hide'
        }
      }
      //指數期貨
      if (this.tabs == 3) {
        if (row.type != 'index_futures') {
          return 'hide'
        }
      }
      //商品期貨
      if (this.tabs == 4) {
        if (row.type != 'commodity_futures') {
          return 'hide'
        }
      }

      //判斷整行顏色
      if(columnIndex >= 3 && columnIndex != 8 && columnIndex != 9 && columnIndex != 10 && columnIndex != 11 && columnIndex != 14 && columnIndex != 15 && columnIndex != 17 && columnIndex != 19) {
        if (this.listColorStyle == 2) {
          //相反
          if (row.color == 'text__danger') {
            return 'text__success'
          }
          if (row.color == 'text__success') {
            return 'text__danger'
          }
        }

        return row.color
      }

      //判斷狀態
      if(columnIndex == 15) {
        if (row.state != 2) {
          return 'text__secondary'
        }
      }
    },
  }
}
</script>