<template lang='pug'>
  el-dialog(
    :visible.sync='show'
    :before-close='handleClose'
    :close-on-click-modal='false'
    width='60%'
    :modal='false')
    .header-custom(slot='title')
      |  訊息
    template {{ $store.state.tipsContent }}
</template>
<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      show: false
    }
  },
  computed: mapState({
    tipsShow: 'tipsShow',
  }),
  watch: {
    tipsShow(show) {
      this.show = show
    }
  },
  methods: {
    handleClose (done) {
      this.$store.commit('tipsStateChange', false)
    }
  }
}
</script>