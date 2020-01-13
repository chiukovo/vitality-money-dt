<template lang='pug'>
//-全平提示
el-dialog(
  :visible.sync='$parent.overAllConfirm'
  :modal='false'
  width="400px"
  title='全部平倉'
  v-dialogDrag)
  .header-custom(slot='title')
    |  全部平倉
  client-only
    vxe-table(
      :data="overAllList"
      height="100px"
      size="mini"
      column-min-width="60"
      border)
      vxe-table-column(field="Serial" title='序號')
      vxe-table-column(field="Name" title='商品')
      vxe-table-column(field="FinalPrice" title='成交價')
      vxe-table-column(title='多空')
        template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
      vxe-table-column(field="Quantity" title='口數')
    .dialog__footer
      button.button__light(@click="cancel") 取消
      button.button(type='primary' @click="doSendOverAll") 確認
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      sendText: '',
      overAllList: [],
    };
  },
  computed: mapState([
    'uncovered',
  ]),
  mounted() {
    //確認
    const _this = this
    const uncovered = this.$store.state.uncovered
    _this.overAllList = []

    uncovered.forEach(function(val) {
      if (val.Operation[2] && val.ID == _this.$store.state.clickItemId) {
        _this.overAllList.push(val)
      }
    })
  },
  methods: {
    doSendOverAll() {
      const clickItem = this.$store.state.clickItemId
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const sendText = 't:' + userId + ',0,' + token + ',' + isMobile + ',' + clickItem

      this.$socketOrder.send(sendText)
      this.$emit('closeOverAllConfirm')
    },
    cancel() {
      this.$emit('closeOverAllConfirm')
    }
  }
}
</script>