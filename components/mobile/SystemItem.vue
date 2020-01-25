<template lang='pug'>
.modals.documents
  .header
    .header__left
      .page__title 商品交易時間
    .header__title
    .header__right
      button.button.header-button.back(@click='$parent.systemShow = 0') 返回
  .main(style="height: calc(100% - 40px);overflow-y: auto;")
    .area
      .collapse
        ul.collapse__list
          li
            span 時間以冬令
            span(style="color: #ecdf7c;") (每年十一月第一個星期天開始)
            span 為主，歐美商品於夏令
            span(style="color: #ecdf7c;") (每年三月第二個星期天開始)
            span 提前一小時開盤、收盤
      .collapse
        .dialog__content
          ul.collapse__list_theme2.collapse__list_theme3
            li(v-for="item in items")
              div {{ item.Name }}
              div
                div.label 開盤/交易時間:
                span(v-html="item.TradeTime")
              div
                span.label 禁新時間:
                |{{ item.not_new_start_time1 }}
              div
                span.label 禁新時間:
                |{{ item.not_new_end_time1 }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      items: [],
    }
  },
  mounted() {
    const sourceCommidyArray = this.$store.state.commidyArray
    this.getUserInfo(sourceCommidyArray)
  },
  computed: mapState([
    'commidyArray',
    'mainItem',
    'userInfo',
  ]),
  watch: {
    commidyArray(sourceCommidyArray) {
      this.getUserInfo(sourceCommidyArray)
    },
  },
  methods: {
    getUserInfo(sourceCommidyArray) {
      this.items = JSON.parse(JSON.stringify(sourceCommidyArray))
    }
  }
}
</script>