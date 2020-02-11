<template lang='pug'>
.itemDetail
  .itemDetail-wrap
    div(class="h-100")
      .itemDetail-header
        .header__title 報價明細
          .badge.badge-warning {{ $store.state.itemName }}
          button.button(@click="openModal('historyPrices', '報價查詢')") 查詢
          label(style="margin-left: 20px")
            input(type="checkbox" v-model="autoScroll")
            span 自動捲動
      #itemDetail.itemDetail-content(:style="'height: calc(100% - ' + $store.state.userInfoStyleHeight + ')'")
        table.custom__table.table__dark
          thead.thead
            tr
              th 時間
              th 成交價
              th 單量
          tbody.tbody(@scroll="tbodyScroll('itemDetail')")
            tr(v-for="row in items2")
              td {{ row.flocalTime }}
              td {{ row.price }}
              td {{ row.amount }}
      UserInfo(ref="userInfo")
  Dialog(
    :click-type="dialog.clickType",
    :visible.sync="dialog.isOpen"
    :title="dialog.title")
</template>
<script>

import { mapState } from 'vuex'
import Dialog from "~/components/Dialog"
import UserInfo from "~/components/UserInfo"

export default {
  components: {
    Dialog,
    UserInfo,
  },
  data() {
    return {
      dialog: {
        clickType: '',
        isOpen: false,
        title: ''
      },
      autoScroll: true
    }
  },
  computed: mapState({
    items2: 'items2',
    clickItemId: 'clickItemId',
    listColorStyle: state => state.localStorage.customSetting.listColorStyle,
  }),
  mounted() {
    const _this = this

    _this.$nextTick(function() {
      _this.computedTableContent('itemDetail')

      if (this.autoScroll) {
        //自動置底
         document.querySelector('#itemDetail .custom__table .tbody').scrollTop = 9999
      }
    })
  },
  watch: {
  },
  methods: {
    setAutoScroll() {
    },
    handleItemDetailTabs(e) {
      this.itemDetailTabShow = e
    },
    tableCenterHeightLight({ row, rowIndex }) {
      // 在列表垂置置中的位置加入 border-tr
      if(rowIndex == 5) {
        return 'border-tr';
      }
    },
    tableCellClassName({ row, column, columnIndex }) {
      if(columnIndex == 1) {
        if(row.change == 'up') {
          //相反
          if (this.listColorStyle == 2) {
            return 'text__success';
          }

          return 'text__danger';
        } else {
          //相反
          if (this.listColorStyle == 2) {
            return 'text__danger';
          }

          return 'text__success';
        }
      }
    },
    openModal (type, title) {
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true
    }
  }
}
</script>