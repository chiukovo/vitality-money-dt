<template lang='pug'>
//-全平提示
el-dialog(
  :visible.sync='$parent.overAllConfirm'
  :modal='false'
  width="500px"
  v-dialogDrag)
  .header-custom(slot='title')
    |  {{ title }}
  client-only
    //-全平
    div.p-2
      .title(style="color: #0477b6;") 全部平倉
      vxe-table(
        :data="overAllList"
        size="mini"
        column-min-width="60"
        border)
        vxe-table-column(field="Serial" title='序號')
        vxe-table-column(field="Name" title='商品')
        vxe-table-column(field="FinalPrice" title='成交價')
        vxe-table-column(title='多空')
          template(slot-scope='scope')
            span(:class="scope.row.BuyOrSell == 0 ? 'bg_danger' : 'bg_success'" class="text__white") {{ scope.row.BuyOrSell == 0 ? '多' : '空' }}
        vxe-table-column(field="Quantity" title='口數')
    //-刪單
    div.p-2(v-if="dayCover == 1")
      .title(style="color: #0477b6;") 刪單
      vxe-table(
        :data="deleteList"
        size="mini"
        column-min-width="60"
        border)
        vxe-table-column(field="Serial" title='序號')
        vxe-table-column(field="Name" title='商品')
        vxe-table-column(field="OrderPrice" title='委託')
        vxe-table-column(title='多空')
          template(slot-scope='scope')
            span(:class="scope.row.BuyOrSell == 0 ? 'bg_danger' : 'bg_success'" class="text__white") {{ scope.row.BuyOrSell == 0 ? '多' : '空' }}
        vxe-table-column(field="Quantity" title='口數')
        vxe-table-column(title='時間')
          template(slot-scope='scope') {{ dateOnlyHis(scope.row.OrderTime) }}
    .dialog__footer
      button.button.button__light(@click="cancel") 取消
      button.button(type='primary' @click="doSendOverAll") 確認
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      title: '全部平倉',
      dayCover: '',
      sendText: '',
      overAllList: [],
      deleteList: [],
    };
  },
  computed: mapState([
    'uncovered',
  ]),
  mounted() {
    //確認
    const _this = this
    const uncovered = this.$store.state.uncovered
    const buySell = this.$store.state.buySell
    const commidyArray = this.$store.state.commidyArray
    const clickItem = this.$store.state.clickItemId

    _this.overAllList = []
    _this.deleteList = []

    uncovered.forEach(function(val) {
      if (val.Operation[2] && val.ID == clickItem) {
        _this.overAllList.push(val)
      }
    })

    //確認是否含刪單
    commidyArray.forEach(function(val) {
      if (val.ID == clickItem) {
        _this.dayCover = val.DayCover
      }
    })

    //含刪單
    if (_this.dayCover == 1) {
      buySell.forEach(function(val) {
        if (val.Operation[1] && val.ID == clickItem) {
          _this.deleteList.push(val)
        }
      })

      this.title = '全部平倉+刪單'
    }
  },
  methods: {
    doSendOverAll() {
      const _this = this
      const clickItem = this.$store.state.clickItemId
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      let sendText = 't:' + userId + ',0,' + token + ',' + isMobile + ',' + clickItem

      this.$socketOrder.send(sendText)
      this.$emit('closeOverAllConfirm')

      //如有刪單
      if (this.dayCover == 1 && this.deleteList.length > 0) {
        _this.deleteList.forEach(function(val) {
          //send
          sendText = 'e:' + userId + ',0,' + val.ID + ',0,0,0,0,' + val.Serial + ',' + token + ',' + isMobile
          _this.$socketOrder.send(sendText)
        })
      }
    },
    cancel() {
      this.$emit('closeOverAllConfirm')
    }
  }
}
</script>