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
          tbody.tbody(@scroll="tbodyScroll($event)")
            tr(v-for="row in items2" @click="trClick($event)")
              td {{ row.flocalTime }}
              td(:class="getClass(row)") {{ row.price }}
              td {{ row.amount }}
            tr(class="non-data" v-if="items2.length == 0")
              td 無資料
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
    nowMainItem: 'nowMainItem',
    listColorStyle: state => state.localStorage.customSetting.listColorStyle,
  }),
  mounted() {
    const _this = this
  },
  watch: {
    items2() {
      this.setAutoScroll()
    }
  },
  methods: {
    setAutoScroll() {
      if (this.autoScroll) {
        //自動置底
         document.querySelector('#itemDetail .custom__table .tbody').scrollTop = 9999
      }
    },
    handleItemDetailTabs(e) {
      this.itemDetailTabShow = e
    },
    getClass(row) {
      let color = this.nowMainItem.color

      if(color == 'text__danger') {
        //相反
        if (this.listColorStyle == 2) {
          return 'text__success';
        }

        return color;
      } else {
        //相反
        if (this.listColorStyle == 2) {
          return 'text__success';
        }

        return color;
      }
    },
    openModal(type, title) {
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true
    }
  }
}
</script>