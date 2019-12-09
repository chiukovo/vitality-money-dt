<template lang="pug">
.mainItem
  .mainItem-content
    Dialog(
      :click-type="dialog.clickType",
      :visible.sync="dialog.isOpen"
      :title="dialog.title"
      :size="dialog.size"
      :onlyItem="dialog.onlyItem"
    )
    client-only
      vxe-table(
        ref="xTable"
        id="mainItemTable"
        :data='mainItem',
        :cell-class-name='tableCellClassName',
        @current-change="clickItem"
        max-width="100%"
        height="100%"
        size="mini"
        column-min-width="60"
        border
        auto-resize
        highlight-current-row
        highlight-hover-row)
        vxe-table-column(width="100px" fixed="left" show-header-overflow)
          template(v-slot:header="{column}") 商品
            button(@click.stop="customSetting = !customSetting") click
            ul(id="customSettingContent" class="test" v-show="customSetting")
              li 自訂商品
              li 自訂欄位
              li 字型大小
              li 自訂風格
          template(slot-scope='scope')
            span(:class="clickItemId == scope.row['product_id'] ? 'bg__success' : ''") {{ scope.row['product_name'] }}
        vxe-table-column(title='倉位多' width="50px" align="center")
          template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
            span(class="bg__danger" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] > 0") {{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}
        vxe-table-column(title='倉位空' width="50px" align="center")
          template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
            span(class="bg__success" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] < 0") {{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}
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
        vxe-table-column(title='交易')
          template(slot-scope='scope') {{ scope.row['state_name'] }}
        vxe-table-column(title='最後成交價' width="70px")
          template(slot-scope='scope')
            span(:class="scope.row['newest_price_change']") {{ scope.row['newest_price'] }}
        vxe-table-column(title='最後交易日' width="70px")
          template(slot-scope='scope') {{ scope.row['end_date'] }}
        vxe-table-column(title='說明')
          template(slot-scope='scope')
            a(href="#" @click="openModal('userDetail', '商品資訊', '', true)") 說明
        vxe-table-column(title='商品類別')
          template(slot-scope='scope') CFD
</template>

<style>
  .test {
    position: fixed;
    z-index: 99;
    background: #fff;
    color: #333;
  }
</style>
<script>

import Vue from 'vue'
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
      customSetting: false
	  }
	},
  computed: mapState([
    'mainItem',
    'clickItemId',
  ]),
  components: {
    Dialog,
  },
  mounted() {
    const _this = this

    document.body.addEventListener("click", function(e) {
      _this.closeSetting()
    });
  },
  methods: {
    closeSetting() {
      this.customSetting = false
    },
    openModal (type, title, size, onlyItem) {
      this.dialog.size = ''
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true

      if (typeof size != 'undefined') {
        this.dialog.size = size
      }

      if (typeof onlyItem != 'undefined') {
        this.dialog.onlyItem = true
      }
    },
    clickItem({ row }) {
      this.$store.commit('setClickItemId', {
        id: row.product_id,
        name: row.product_name
      })
    },
    tableCellClassName({ row, column, columnIndex }) {
      //判斷整行顏色
      if(columnIndex >= 3 && columnIndex != 8 && columnIndex != 9 && columnIndex != 10 && columnIndex != 11 && columnIndex != 14 && columnIndex != 15 && columnIndex != 17 && columnIndex != 19) {
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