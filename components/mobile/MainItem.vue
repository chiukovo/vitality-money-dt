<template lang="pug">
.page
  el-dialog(
    :visible.sync='settingShow'
    :modal='false'
    :width="customItemShow ? '300px' : ''"
    :before-close='handleClose'
    v-dialogDrag)
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
      .tabs__item(@click="tabs = 1" :class="{'is-active' : tabs == 1}") 自訂
      .tabs__item(@click="tabs = 2" :class="{'is-active' : tabs == 2}") 指數
      .tabs__item(@click="tabs = 3" :class="{'is-active' : tabs == 3}") 指數期貨
      .tabs__item(@click="tabs = 4" :class="{'is-active' : tabs == 4}") 商品期貨
      .tabs__item(@click="tabs = 5" :class="{'is-active' : tabs == 5}") 加密貨幣
    .modals.mainItem(v-if="analysisShow")
      .header
        .header__left
          el-link(icon='el-icon-arrow-left' :underline='false' @click="analysisShow = false") 返回
        .header__title
          .select.header-select
            select(v-model='selectItemId')
              option(v-for="item in mainItem" :value='item.product_id') {{ item.product_name }}
      Analysis
    //-市場總覽
    client-only(v-if="settingType == 1")
      vxe-table.table(
        ref="xTable"
        :class="'fontStyle-' + fontStyle"
        id="mainItemTable"
        :data='mainItem',
        :cell-class-name='tableCellClassName'
        @current-change="clickItem"
        max-width="100%"
        height="100%"
        column-min-width="90"
        border
        auto-resize
        highlight-current-row)
        vxe-table-column(:width="computedStyleWidth(50)" fixed="left" align="left" show-header-overflow)
          template(v-slot:header="{column}") 商品
            .table-toggle
              a(@click.stop="settingShow = true")
          template(slot-scope='scope' ) {{ scope.row['product_name'] }}
        vxe-table-column(:width="computedStyleWidth(10)" title='倉位' align="center")
          template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
            <span class="bg__danger" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] > 0">{{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}</span>
            <span class="bg__success" v-else>{{ Math.abs($store.state.uncoveredCountDetail[scope.row['product_id']]) }}</span>
        vxe-table-column(:width="computedStyleWidth(35)" title='成交' fixed="left" align="right")
          template(slot-scope='scope')
            span(:class="scope.row['newest_price_change']") {{ scope.row['newest_price'] }}
        vxe-table-column(:width="computedStyleWidth(35)" title='買進')
          template(slot-scope='scope') {{ scope.row['bp_price'] }}
        vxe-table-column(:width="computedStyleWidth(35)" title='賣出')
          template(slot-scope='scope') {{ scope.row['sp_price'] }}
        vxe-table-column(:width="computedStyleWidth(35)" title='漲跌')
          template(slot-scope='scope')
            .change-icon
              .icon-arrow(:class="scope.row['gain'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
            span(:class="scope.row['gain'] > 0 ? 'text__danger' : 'text__success'") {{ scope.row['gain'] }}
        vxe-table-column(:width="computedStyleWidth(35)" title='漲跌幅')
          template(slot-scope='scope') {{ scope.row['gain_percent'] }}%
        vxe-table-column(:width="computedStyleWidth(35)" title='總量')
          template(slot-scope='scope')
            span(:class="scope.row['total_qty_change']") {{ scope.row['total_qty'] }}
        vxe-table-column(:width="computedStyleWidth(35)" title='開盤')
          template(slot-scope='scope') {{ scope.row['open_price'] }}
        vxe-table-column(:width="computedStyleWidth(35)" title='最高')
          template(slot-scope='scope') {{ scope.row['highest_price'] }}
        vxe-table-column(:width="computedStyleWidth(35)" title='最低')
          template(slot-scope='scope') {{ scope.row['lowest_price'] }}
        vxe-table-column(:width="computedStyleWidth(35)" title='昨收盤')
          template(slot-scope='scope') {{ scope.row['yesterday_last_price']  }}
        vxe-table-column(:width="computedStyleWidth(35)" title='昨結算')
          template(slot-scope='scope') {{ scope.row['yesterday_close_price']  }}
        vxe-table-column(:width="computedStyleWidth(35)" title='狀態')
          template(slot-scope='scope') {{ scope.row['state_name'] }}
    //-會員明細
    div(v-if="settingType == 3")
      UserDetailList
  .swiper-scrollbar(slot="scrollbar")
</template>

<script>

import UserInfoHeader from "~/components/mobile/UserInfoHeader"
import CustomItem from "~/components/mobile/CustomItem"
import Analysis from "~/components/mobile/Analysis"
import UserDetailList from "~/components/mobile/UserDetailList"
import Dialog from "~/components/Dialog"

import { mapState } from 'vuex'

export default {
	data() {
	  return {
      tabs: 1,
      selectItemId: '',
      userInfoHeaderShow: false,
      costomShow: false,
      analysisShow: false,
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
    Analysis,
    UserDetailList,
    Dialog
  },
  computed: mapState({
    mainItem: 'mainItem',
    clickItemId: 'clickItemId',
    fontStyle: state => state.localStorage.customSetting.fontStyle,
  }),
  watch: {
    clickItemId(id) {
      //目前選擇商品
      this.selectItemId = id
      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'chart',
        'num': 1
      })

      this.$store.dispatch('CALL_CHANGE_CHART_SYMBOL', id);
    },
    fontStyle() {
      this.$refs.xTable.refreshColumn()
    },
    mainItem() {
      const _this = this

      setTimeout(function(){
        const success = document.querySelectorAll("#mainItemTable .vxe-cell .border__success")
        const danger = document.querySelectorAll("#mainItemTable .vxe-cell .border__danger")

        success.forEach(function(el) {
          el.classList.remove("border")
          el.classList.remove("border__success")
        })

        danger.forEach(function(el) {
          el.classList.remove("border")
          el.classList.remove("border__danger")
        })
      }, 400)
    },
    selectItemId(id) {
      let name = ''
      //找出名稱
      this.$store.state.mainItem.forEach(function(val) {
        if (val.product_id == id) {
          name = val.product_name
        }
      })

      this.$store.commit('setClickItemId', {
        id: id,
        name: name
      })
    },
  },
  methods: {
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
    computedStyleWidth(sourceWidth) {
      let needAdd = 0
      let result = 0
      sourceWidth = typeof sourceWidth == 'undefined' ? 100 : sourceWidth

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
    clickItem({ row }) {
      this.$store.commit('setClickItemId', {
        id: row.product_id,
        name: row.product_name
      })
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
      if(columnIndex >= 2 && columnIndex != 5 && columnIndex != 7 && columnIndex != 13) {
        return row.color
      }

      //判斷狀態
      if(columnIndex == 13) {
        if (row.state != 2) {
          return 'text__secondary'
        }
      }
    },
    handleClose() {
      this.customItemShow = false
      this.settingShow = false
    },
  }
}
</script>