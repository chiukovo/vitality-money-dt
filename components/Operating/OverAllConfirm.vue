<template lang='pug'>
//-全平提示
el-dialog(
  :visible.sync='$parent.overAllConfirm'
  :modal='false'
  v-dialogDrag
  width="500px")
  .header-custom(slot='title')
    |  {{ title }}
  //-全平
  div
    .title.m-1(style="color: #0477b6;") 全部平倉
    table.custom__table.general
      thead.thead
        tr
          th 序號
          th 商品
          th 成交價
          th 多空
          th 口數
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in overAllList" @click="trClick($event)")
         td {{ row.Serial }}
         td {{ row.Name }}
         td {{ row.FinalPrice }}
         td
            span(:class="row.BuyOrSell == 0 ? 'bg_danger' : 'bg_success'" class="text__white") {{ row.BuyOrSell == 0 ? '多' : '空' }}
         td {{ row.Quantity }}
        tr(class="non-data" v-if="overAllList.length == 0")
          td 無資料
  //-刪單
  div(v-show="dayCover == 1")
    .title.m-1(style="color: #0477b6;") 刪單
    table.custom__table.general
      thead.thead
        tr
          th 序號
          th 商品
          th 委託
          th 多空
          th 口數
          th 時間
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in deleteList" @click="trClick($event)")
          td(field="Serial" title='序號') {{ row.Serial }}
          td(field="Name" title='商品') {{ row.Name }}
          td(field="OrderPrice" title='委託') {{ row.OrderPrice }}
          td
            span(:class="row.BuyOrSell == 0 ? 'bg_danger' : 'bg_success'" class="text__white") {{ row.BuyOrSell == 0 ? '多' : '空' }}
          td(field="Quantity" title='口數') {{ row.Quantity }}
          td {{ dateOnlyHis(row.OrderTime) }}
        tr(class="non-data" v-if="deleteList.length == 0")
          td 無資料
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

    this.computedTableContent()
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