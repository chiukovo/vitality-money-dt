<template lang="pug">
div(class="h-100")
  Dialog(
    :click-type="dialog.clickType",
    :visible.sync="dialog.isOpen"
    :title="dialog.title"
    :size="dialog.size"
    :onlyItem="dialog.onlyItem"
  )
  div(style="height: calc(100% - 64px);")
    client-only
      vxe-table.table__dark(
        ref="xTable"
        id="mainItemTable"
        :data='mainItem',
        :header-cell-class-name='headerCellClassName',
        :cell-class-name='tableCellClassName',
        max-width="100%"
        height="100%"
        size="mini"
        column-min-width="60"
        align="right"
        stripe
        border
        auto-resize)
        vxe-table-column(width="100px" fixed="left" align="left" show-header-overflow)
          template(v-slot:header="{column}") 商品
            .table-toggle
              a(@click.stop="customSetting = !customSetting")
            ul.table-dropdown.dropdown-menu(id="customSettingContent" v-show="customSetting")
              li.dropdown-item(href="#", @click="openModal('showHideItem', '自訂商品')") 自訂商品
              li.dropdown-item(href="#") 自訂欄位
              .dropdown-divider
              li.dropdown-item.dropdown-toggle(href="#") 字型大小
                ul.dropdown-submenu
                  li(@click="setFontStyle(3)" :class="fontStyle == '3' ? 'is-active' : ''") 特大
                  li(@click="setFontStyle(2)" :class="fontStyle == '2' ? 'is-active' : ''") 大
                  li(@click="setFontStyle(1)" :class="fontStyle == '1' ? 'is-active' : ''") 中
                  li(@click="setFontStyle(1)" :class="fontStyle == '0' ? 'is-active' : ''") 小
              li.dropdown-item(href="#") 自訂風格
          template(slot-scope='scope')
            div(:class="clickItemId == scope.row['product_id'] ? 'bg__success' : ''"  @click="clickItem(scope.row)") {{ scope.row['product_name'] }}
        vxe-table-column(title='倉位多' width="70px" align="center")
          template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
            span(class="text__center bg__danger" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] > 0") {{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}
        vxe-table-column(title='倉位空' width="70px" align="center")
          template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
            span(class="text__center bg__success" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] < 0") {{ Math.abs($store.state.uncoveredCountDetail[scope.row['product_id']]) }}
        vxe-table-column(title='買進價')
          template(slot-scope='scope')
            span(:class="scope.row['bp_price_change']") {{ scope.row['bp_price'] }}
        vxe-table-column(title='賣出價')
          template(slot-scope='scope')
            span(:class="scope.row['sp_price_change']") {{ scope.row['sp_price'] }}
        vxe-table-column(title='成交價')
          template(slot-scope='scope')
            span(:class="scope.row['newest_price_change']") {{ scope.row['newest_price'] }}
        vxe-table-column(title='漲跌')
          template(slot-scope='scope')
            span(:class="scope.row['gain_change']") {{ scope.row['gain'] }}
        vxe-table-column(title='漲幅%')
          template(slot-scope='scope')
            span(:class="scope.row['gain_percent_change']") {{ scope.row['gain_percent'] }}%
        vxe-table-column(title='單量')
          template(slot-scope='scope')
            span(:class="scope.row['newest_qty_change']") {{ scope.row['newest_qty'] }}
        vxe-table-column(title='總量')
          template(slot-scope='scope')
            span(:class="scope.row['total_qty_change']") {{ scope.row['total_qty'] }}
        vxe-table-column(title='昨收價')
          template(slot-scope='scope') {{ scope.row['yesterday_close_price'] }}
        vxe-table-column(title='開盤價')
          template(slot-scope='scope') {{ scope.row['open_price']}}
        vxe-table-column(title='最高價')
          template(slot-scope='scope') {{ scope.row['highest_price']}}
        vxe-table-column(title='最低價')
          template(slot-scope='scope') {{ scope.row['lowest_price']}}
        vxe-table-column(title='時間' width="70px")
          template(slot-scope='scope')
            span(:class="scope.row['newest_time_change']") {{ scope.row['newest_time'] }}
        vxe-table-column(title='交易' align="center")
          template(slot-scope='scope') {{ scope.row['state_name'] }}
        vxe-table-column(title='最後成交價' width="90px")
          template(slot-scope='scope')
            span(:class="scope.row['newest_price_change']") {{ scope.row['newest_price'] }}
        vxe-table-column(title='最後交易日' width="90px")
          template(slot-scope='scope') {{ scope.row['end_date'] }}
        vxe-table-column(title='說明' align="center")
          template(slot-scope='scope')
            a(href="#" @click="openModal('userDetail', '商品資訊', '', true)") 說明
        vxe-table-column(title='商品類別' align="center")
          template(slot-scope='scope') CFD
</template>

<script>

import Dialog from "~/components/Dialog"
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
      },
      customSetting: false,
      tabs: 1,
	  }
	},
  computed: mapState({
    mainItem: 'mainItem',
    clickItemId: 'clickItemId',
    fontStyle: state => state.localStorage.customSetting.fontStyle
  }),
  components: {
    Dialog,
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
      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'kline',
        'num': 2
      })
    }
  },
  methods: {
    setFontStyle(num) {
      this.$store.commit('setFontStyle', num)
    },
    closeSetting() {
      this.customSetting = false
    },
    openModal (type, title, size, onlyItem) {
      this.dialog.size = ''
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true

      if (typeof onlyItem != 'undefined') {
        this.dialog.onlyItem = true
      }
    },
    clickItem(row) {
      //取消
      this.$socket.send('f:' + this.$store.state.clickItemId)
      this.$store.commit('setClickItemId', {
        id: row.product_id,
        name: row.product_name
      })
    },
    tableCellClassName({ row, column, columnIndex }) {
      //判斷整行顏色
      if(columnIndex >= 3 && columnIndex != 8 && columnIndex != 9 && columnIndex != 10 && columnIndex != 11 && columnIndex != 14 && columnIndex != 15 && columnIndex != 17 && columnIndex != 19) {
        return row.color + ' fontStyle-' + this.fontStyle
      }

      //判斷狀態
      if(columnIndex == 15) {
        if (row.state != 2) {
          return 'text__secondary' + ' fontStyle-' + this.fontStyle
        }
      }
    },
    headerCellClassName({ row, column, columnIndex }) {
      return 'fontStyle-' + this.fontStyle
    },
  }
}
</script>