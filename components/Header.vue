<template lang='pug'>
.header
  nav.navbar
    Dialog(
      :click-type="dialog.clickType",
      :visible.sync="dialog.isOpen"
      :title="dialog.title"
      :size="dialog.size")
    ul.navbar-nav.navbar-nav-left
      li.nav-item
        a.nav-link(href="#" @click="logout") 登出
      li.nav-item
        a.nav-link.dropdown-toggle(href="#") 檢視
        .dropdown-menu
          a.dropdown-item(href="#" @click="openModal('news', '公告總攬')") 公告總攬
          a.dropdown-item(href="#" @click="openModal('historyPrices', '報價明細')") 報價明細
          a.dropdown-item(href="#" @click="openModal('userDetail', '會員資訊')") 會員資訊
          a.dropdown-item(href="#" @click="openModal('historyWinLoss', '帳戶歷史')") 帳戶歷史
          a.dropdown-item(href="#" @click="openModal('storedRecords', '儲值記錄')") 儲值記錄
      li.nav-item
        a.nav-link.dropdown-toggle(href="#") 設定
        .dropdown-menu
          a.dropdown-item(href="#" @click="openModal('changePassword', '修改密碼', '360px')") 修改密碼
          a.dropdown-item(href="#") 自訂商品
          a.dropdown-item(href="#") 自訂欄位
          a.dropdown-item(href="#") 開盤風控設定
      li.nav-item
        a.nav-link.dropdown-toggle(href="#") 說明
        .dropdown-menu
          a.dropdown-item(href="/rules" target="_blank") 規則說明
          a.dropdown-item(href="#") 名詞說明
          a.dropdown-item(href="#") 商品交易時間
    .navbar-nav.navbar-nav-right
      .mybutoule
        button(@click="changeMainStyle(1)" :class="checkActive(1)") 1
        button(@click="changeMainStyle(2)" :class="checkActive(2)") 2
        button(@click="changeMainStyle(3)" :class="checkActive(3)") 3
        button(@click="changeMainStyle(4)" :class="checkActive(4)") 4
        button(@click="changeMainStyle(5)" :class="checkActive(5)") 5
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
      },
      targetItem: {}
    }
  },
  components: {
    Dialog,
  },
  mounted() {
  },
  computed: mapState([
    'clickItemId',
  ]),
  watch: {
    clickItemId (nowItems) {
      let _this = this
      let mainItem = this.$store.state.mainItem
      mainItem.forEach(function(val) {
        if (nowItems == val.product_id) {
          _this.targetItem = val
        }
      })
    }
  },
  methods: {
    checkActive(type) {
      if (type == this.$store.state.localStorage.customSetting.mainStyle) {
        return 'active'
      }
    },
    changeMainStyle(type) {
      this.$store.commit('setMainStyle', type)
    },
    openModal(type, title, size) {
      this.dialog.size = ''
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true

      if (typeof size != 'undefined') {
        this.dialog.size = size
      }
    },
    setCustomSetting(type) {
      this.$store.commit('setCustomSetting', type)
    },
    logout() {
      //unset cookie
      let token = this.$cookies.remove('token')

      location.href = "/"
    }
  }
}
</script>