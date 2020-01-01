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
        .dialog__content
          ul
            li(v-for="item in items")
              div {{ item.Name }}
              div 開盤/交易時間:
                span(v-html="item.TradeTime")
              div 禁新時間: {{ item.not_new_start_time1 }}
              div 禁新時間: {{ item.not_new_end_time1 }}
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