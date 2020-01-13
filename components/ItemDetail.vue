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
      .itemDetail-content(:style="'height: calc(100% - ' + $store.state.userInfoStyleHeight + ')'")
        client-only
          vxe-table.table__dark.table__stripe(
            ref="xTable"
            :data="items2"
            :cell-class-name="tableCellClassName"
            max-width="100%"
            height="100%"
            size="mini"
            align="center"
            border
            auto-resize)
            vxe-table-column(field="flocalTime" title='時間')
            vxe-table-column(field="price" title='成交價')
            vxe-table-column(field="amount" title='單量')
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
  computed: mapState([
    'items2',
  ]),
  watch: {
    clickItemId() {
      this.setAutoScroll()
    },
    items2(items) {
      this.setAutoScroll()
    }
  },
  methods: {
    setAutoScroll() {
      if (this.autoScroll) {
        //自動置底
        this.$refs.xTable.scrollTo(0, 99999)
      }
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
          return 'text__danger';
        } else {
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