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
        a.nav-link(@click.prevent="logout()") 登出
      li.nav-item
        a.nav-link.dropdown-toggle 檢視
        ul.dropdown-menu
          li.dropdown-item(@click="openModal('news', '公告總攬')") 公告總攬
          li.dropdown-item(@click="openModal('historyPrices', '報價明細')") 報價明細
          li.dropdown-item(@click="openModal('userDetail', '會員資訊')") 會員資訊
          li.dropdown-item(@click="openModal('historyWinLoss', '帳戶歷史')") 帳戶歷史
          li.dropdown-item(@click="openModal('storedRecords', '儲值記錄')") 儲值記錄
      li.nav-item
        a.nav-link.dropdown-toggle 設定
        ul.dropdown-menu
          li.dropdown-item(@click="openModal('changePassword', '修改密碼', '360px')") 修改密碼
          li.dropdown-item 自訂商品
          li.dropdown-item 自訂欄位
          li.dropdown-item 開盤風控設定
          .dropdown-divider
          li.dropdown-item.dropdown-toggle 風格切換
            ul.dropdown-submenu
              li.is-active 深色
              li 淺色
          li.dropdown-item.dropdown-toggle 選擇版面
            ul.dropdown-submenu
              li.is-active 版面1
              li 版面2
              li 版面3
              li 版面4
              li 版面5
          li.dropdown-item.dropdown-toggle(href="#") 字型大小
            ul.dropdown-submenu
              //- li(@click="setFontStyle(3)" :class="fontStyle == '3' ? 'is-active' : ''") 特大
              //- li(@click="setFontStyle(2)" :class="fontStyle == '2' ? 'is-active' : ''") 大
              //- li(@click="setFontStyle(1)" :class="fontStyle == '1' ? 'is-active' : ''") 中
              //- li(@click="setFontStyle(0)" :class="fontStyle == '0' ? 'is-active' : ''") 小
          li.dropdown-item.dropdown-toggle 損益設定
            ul.dropdown-submenu
              li.is-active 點數輸入
              li 行情輸入
          li.dropdown-item.dropdown-toggle 音效
            ul.dropdown-submenu
              li.is-active 開啟
              li 關閉
          li.dropdown-item.dropdown-toggle 貨幣
            ul.dropdown-submenu
              li USD
              li EUR
              li JPY
              li HKD
              li.is-active NTD
      li.nav-item
        a.nav-link.dropdown-toggle 說明
        ul.dropdown-menu
          li.dropdown-item(@click="openModal('rules', '規則說明')") 規則說明
          li.dropdown-item(@click="openModal('nounDescription', '名詞說明')") 名詞說明
          li.dropdown-item(@click="openModal('tradingTime', '商品交易時間')") 商品交易時間
    .navbar-nav.navbar-nav-right
      .mybutoule
        button(@click="changeMainStyle(1)" :class="mainStyle == '1' ? 'active' : ''") 1
        button(@click="changeMainStyle(2)" :class="mainStyle == '2' ? 'active' : ''") 2
        button(@click="changeMainStyle(3)" :class="mainStyle == '3' ? 'active' : ''") 3
        button(@click="changeMainStyle(4)" :class="mainStyle == '4' ? 'active' : ''") 4
        button(@click="changeMainStyle(5)" :class="mainStyle == '5' ? 'active' : ''") 5
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
  computed: mapState({
    clickItemId: 'clickItemId',
    mainStyle: state => state.localStorage.customSetting.mainStyle
  }),
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

      //unset user info
      this.$store.commit('setuserAuth', [])

      location.href = "/"
    }
  }
}
</script>