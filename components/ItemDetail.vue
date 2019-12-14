<template lang='pug'>
.itemDetail
  .itemDetail-wrap
    div(class="h-100")
      .itemDetail-header
        .header__title 報價明細
          .badge.badge-warning {{ $store.state.itemName }}
          button.button(@click="openModal('historyPrices', '報價查詢')") 查詢
          label.checkbox
            input.checkbox__input(type="checkbox" checked)
            span.checkbox__label 置底
      .itemDetail-content
        client-only
          vxe-table(
            :data="$store.state.items2"
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
  UserInfo
  Dialog(
    :click-type="dialog.clickType",
    :visible.sync="dialog.isOpen"
    :title="dialog.title")
</template>
<script>
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
      }
    }
  },
  methods: {
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
      if(columnIndex >= 2) {
        if(row.change == 'up') {
          return 'text__up';
        } else {
          return 'text__down';
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