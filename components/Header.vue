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
        a.nav-link(@click.prevent="logout(true)") 登出
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
          li.dropdown-item(@click="openModal('showHideItem', '自訂商品')") 自訂商品
          li.dropdown-item(@click="openModal('showHideItemField', '自訂欄位')") 自訂欄位
          li.dropdown-item(@click="openModal('userDetail', '會員資訊')") 開盤風控設定
          .dropdown-divider
          li.dropdown-item.dropdown-toggle 選擇版面
            ul.dropdown-submenu
              li(@click="changeMainStyle(1)" :class="mainStyle == '1' ? 'is-active' : ''") 版面1
              li(@click="changeMainStyle(2)" :class="mainStyle == '2' ? 'is-active' : ''") 版面2
              li(@click="changeMainStyle(3)" :class="mainStyle == '3' ? 'is-active' : ''") 版面3
              li(@click="changeMainStyle(4)" :class="mainStyle == '4' ? 'is-active' : ''") 版面4
              li(@click="changeMainStyle(5)" :class="mainStyle == '5' ? 'is-active' : ''") 版面5
          li.dropdown-item.dropdown-toggle(href="#") 字型大小
            MainFontSize
          li.dropdown-item.dropdown-toggle 損益設定
            ul.dropdown-submenu
              li.is-active 行情輸入
          li.dropdown-item.dropdown-toggle 音效
            ul.dropdown-submenu
              li(:class="$store.state.localStorage.customSetting.sound ? 'is-active': ''" @click="setCustomSetting('sound')") 開啟
              li(:class="$store.state.localStorage.customSetting.sound ? '': 'is-active'" @click="setCustomSetting('sound')") 關閉
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
        button(class="themeBtn" style="background: #d4d4d4;" @click="changeTheme('white')" :class="theme == 'white' ? 'active' : ''")
        button(class="themeBtn" style="background: #333;" @click="changeTheme('default')" :class="theme == 'default' ? 'active' : ''")
</template>

<script>

import Dialog from "~/components/Dialog"
import MainFontSize from "~/components/UserSetting/MainFontSize"
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
    MainFontSize,
  },
  computed: mapState({
    clickItemId: 'clickItemId',
    mainStyle: state => state.localStorage.customSetting.mainStyle,
    theme: state => state.localStorage.customSetting.theme,
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
    changeTheme(type) {
      this.$store.commit('setTheme', type)
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
  }
}
</script>