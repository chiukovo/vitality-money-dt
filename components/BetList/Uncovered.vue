<template lang='pug'>
.history-content
  .history-content__header(id="uncoveredHeader")
    button.button__white(@click="openMultiOrder") 全部平倉
  .history-content__body(:style="{height: $parent.height.uncovered}")
    client-only
      vxe-table.table__dark(
        :data='$store.state.uncovered'
        :cell-class-name='uncoveredTableCellClassName',
        ref="multipleTable"
        max-width="100%"
        height="100%"
        size="mini"
        column-min-width="60"
        stripe
        border
        auto-resize)
        vxe-table-column(title='操作' align="center" width="120")
          template(slot-scope='scope')
            button.button__white(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平
            button.button__white(v-if="!notSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row)") 設損
        vxe-table-column(field='Serial' title='序號' width="80")
        vxe-table-column(field='Name' title='商品' width="94")
        vxe-table-column(title='多空')
          template(slot-scope='scope')
            span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
        vxe-table-column(field='FinalPrice' title='成交價')
        vxe-table-column(field='Quantity' title='口數')
        vxe-table-column(field='Fee' title='手續費')
        vxe-table-column(title='損失點' align="center" width="74")
          template(slot-scope='scope') {{ parseInt(scope.row.LossPoint) }}
        vxe-table-column(title='獲利點' align="center" width="74")
          template(slot-scope='scope') {{ parseInt(scope.row.WinPoint) }}
        vxe-table-column(title='倒限(利)' align="center" width="70px")
          template(slot-scope='scope') {{ parseInt(scope.row.InvertedPoint) }}
        vxe-table-column(title='不留倉')
          template(slot-scope='scope')
            label.checkbox
              input.checkbox__input(type="checkbox" style="margin: 0" :checked="scope.row.DayCover" @click="changeDayCover(scope.row)")
              span.checkbox__label 不留倉
        vxe-table-column(field='PointMoney' title='報價')
        vxe-table-column(field='thisSerialTotalMoney', title='浮動損益' width="74")
          template(slot-scope='scope')
            span(v-if="scope.row['thisSerialTotalMoney'] == 0" class="text__black") {{ scope.row['thisSerialTotalMoney'] }}
            span(v-else :class="getMoneyColor(scope.row.thisSerialTotalMoney)") {{ scope.row['thisSerialTotalMoney'] }}
        vxe-table-column(title='點數')
          template(slot-scope='scope')
            .change-icon(v-if="typeof scope.row['thisSerialPointDiff'] != 'undefined'")
              .icon-arrow(v-if="scope.row['thisSerialPointDiff'] != 0" :class="scope.row['thisSerialPointDiff'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
            span(v-if="scope.row['thisSerialPointDiff'] == 0" class="text__black") {{ scope.row['thisSerialPointDiff'] }}
            span(v-else :class="getMoneyColor(scope.row.thisSerialPointDiff)") {{ scope.row['thisSerialPointDiff'] }}
        vxe-table-column(field='Day', title='天數')
        vxe-table-column(field='State', title='狀態' width="150px")
        vxe-table-column(title='昨日損益' width="74")
          template(slot-scope='scope' v-if="scope.row.OriginalMoney > 0")
            span(:class="getMoneyColor(scope.row.OriginalMoney)" style="text-decoration:underline;" @click="openDetail(scope.row)") {{ scope.row.OriginalMoney | currency }}
  //-改價減量
  el-dialog(
    :visible.sync='editDialog'
    :modal='false'
    width="320px"
    title='改價減量'
    v-dialogDrag)
    .header-custom(slot='title') 改價減量
    template
      .dialog__body
        .d-flex.justify-content-around.mb-3
          ul.flex-fill.fistrtitle
            li
              .label 序號
              span {{ edit.serial }}
            li
              .label 商品
              span {{ edit.itemName }}
            li
              .label 多空
              span(:class="edit.BuyOrSell == 0 ? 'bg__danger' : 'bg__success'" class="text__white") {{ edit.BuyOrSell == 0 ? '多' : '空' }}
          //-這個是右邊那個大框框 有紅色or綠色的
          .PriceBox.flex-fill(v-if="findMainItemById(edit.itemId) != ''" :class="findMainItemById(edit.itemId).gain > 0 ? 'bg__danger' : 'bg__success'")
            //-成交價
            .title {{ findMainItemById(edit.itemId).newest_price }}
            //-帳跌
            div
              span
                .change-icon
                  .icon-arrow(:class="findMainItemById(edit.itemId).gain > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                div(style="display: inline") {{ findMainItemById(edit.itemId).gain }}
              //-帳跌%
              span.ml-2 {{ findMainItemById(edit.itemId).gain_percent }}
        el-form(ref='form' size='mini' label-width='70px')
          p.text__center 新獲利點需大於:
            span.text__bold.bg-colr-warring [ {{ win.limitPoint }} ]
          el-form-item(label="獲利點")
            el-input-number(v-model="edit.winPoint")
          p.text__center 新損失點需大於:
            span.text__bold.bg-colr-warring [ {{ loss.limitPoint }} ]
          el-form-item(label="損失點")
            el-input-number(v-model="edit.lossPoint")
          p.text__center 新倒限點不得大於:
            span.text__bold.bg-colr-warring [ {{ inverted.limitPoint }} ]
          el-form-item(label="倒限點")
            el-input-number(v-model="edit.invertedPoint")
        .badge.badge-warning 口數只能減少或不變， 損失點/ 獲利點 為
          span.badge-rr 點數
          | 設定
      .dialog__footer
        button.button__light(@click="editDialog = false") 取消
        button.button(type='primary' @click="doEdit") 送出
  //-多單平倉
  el-dialog(
    :visible.sync='multiOrderConfirm'
    :modal='false'
    :show-close='false'
    width="600px"
    title='確認平倉'
    v-dialogDrag)
    .header-custom(slot='title')
      |  確認平倉
    client-only
      vxe-table(
        :data="multiOrderData"
        height="100px"
        size="mini"
        column-min-width="60"
        border)
        vxe-table-column(field="serial" title='序號')
        vxe-table-column(field="name" title='目標商品')
        vxe-table-column(field="userName" title='用戶名稱')
        vxe-table-column(field="buy" title='買賣')
        vxe-table-column(field="price" title='價格')
        vxe-table-column(field="submit" title='口數')
      .dialog__footer
        button.button__light(@click="multiOrderConfirm = false") 取消
        button.button(type='primary' @click="doMultiCovered") 確認
  el-dialog(
    width="50%"
    height="500px"
    :title="detail.title"
    :visible.sync="innerVisible"
    append-to-body)
    HistoryWinLossDetail(:detail="detail" v-if="innerVisible")
</template>

<script>

import { mapState } from 'vuex'
import HistoryWinLossDetail from "~/components/HistoryWinLossDetail"
import axios from 'axios'
import qs from 'qs'

export default {
  data() {
    return {
      autoGoButtom: 1,
      isMobile: '',
      userId: '',
      token: '',
      lang: '',
      deleteConfirm: false,
      multiOrderConfirm: false,
      orderReport: true,
      innerVisible: false,
      selectToDelete: [],
      multiOrderData: [],
      multiOrderSelect: [],
      multiDeleteData: [],
      multiDeleteSelect: [],
      detail: {
        date: '',
        title: '',
        todayMoney: 0,
        remainingMoney: 0,
      },
    }
  },
  components: {
    HistoryWinLossDetail,
  },
  mounted() {
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang
    this.isMobile = this.$store.state.isMobile
  },
  methods: {
    notSetWinLoss(operation) {
      return operation[0] == 0 && operation[1] == 0 && operation[2] == 0 && operation[4] == 0
    },
    changeDayCover(row) {
      const _this = this
      const setDayCover = row.DayCover ? 0 : 1

      axios.post(process.env.NUXT_ENV_API_URL + "/set_serial_daycover?lang=" + this.lang, qs.stringify({
        UserID: this.userId,
        Token: this.token,
        DayCover: setDayCover,
        DayCoverSerialId: row.Serial,
      }))
      .then(response => {
        _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
        _this.$store.dispatch('CALL_MEMBER_INFO')
      })
    },
    openDetail(row) {
      const _this = this
      this.detail.date = this.getYesterdayDay()

      //call list
      axios.post(process.env.NUXT_ENV_API_URL + "/query_history_moneylist?lang=" + this.lang, qs.stringify({
        UserID: this.userId,
        Token: this.token,
        StartDate: this.detail.date,
        EndDate: this.detail.date,
        DaySelect: -1,
      }))
      .then(response => {
        const result = response.data
        this.detail.todayMoney = 0
        this.detail.remainingMoney = 0
        this.detail.yesterdayInterestNum = 0
        this.detail.title = this.detail.date + '下單明細'

        if (result.Code > 0) {
          if (result.MoneyArray.length > 0) {
            this.detail.todayMoney = result.MoneyArray[0].TodayMoney
            this.detail.remainingMoney = result.MoneyArray[0].RemainingMoney
            this.detail.yesterdayInterestNum = Number(result.MoneyArray[0].RemainingMoney) - Number(result.MoneyArray[0].TouchPoint) + Number(result.MoneyArray[0].Withholding) - Number(result.MoneyArray[0].TodayMoney)
          }
        }
      })

      _this.innerVisible = true
    },
    multiOrderAllClick(allChecked) {
      let _this = this

      if (!allChecked) {
        _this.multiOrderSelect = []
        return
      }

      _this.multiOrderSelect = _this.$store.state.uncovered.map(function(val) {
        if (val.Operation[2]) {
          return val.Serial
        }
      })
    },
    openMultiOrder() {
      let _this = this
      this.multiOrderData = []

      _this.$store.state.uncovered.forEach(function(row) {
        if (row.Operation[2]) {
          _this.multiOrderData.push({
            name: row.Name,
            userName: _this.$store.state.userInfo.Account,
            buy: row.BuyOrSell == 0 ? '多' : '空',
            price: row.Odtype,
            submit: row.Quantity,
            itemId: row.ID,
            serial: row.Serial,
          })
        }
      })

      this.multiOrderConfirm = true
    },
    doMultiCovered() {
      if (this.multiOrderData.length > 0) {
        let itemIdStr = ''
        let serialStr = ''
        const count = this.multiOrderData.length
        let sendText

        this.multiOrderData.forEach(function(val, key) {
          if (count == key + 1) {
            itemIdStr += val.itemId
            serialStr += val.serial
          } else {
            itemIdStr += val.itemId + ';'
            serialStr += val.serial + ';'
          }
        })

        sendText = 't:' + this.userId + ',' + serialStr + ',' + this.token + ',' + this.isMobile + ',' + itemIdStr
        this.$socketOrder.send(sendText)
      }

      this.multiOrderConfirm = false
    },
    doCovered(row, count) {
      const isMobile = this.isMobile
      const userId = this.userId
      const token = this.token
      let _this = this
      let sendText

      this.$confirm('確認平倉' + row.Name + ' 序號: ' + row.Serial + '?', '注意! ', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        switch (count) {
          case 1:
            sendText = 't:' + userId + ',' + row.Serial + ',' + token + ',' + isMobile + ',' + row.ID
            _this.$socketOrder.send(sendText)
            break
        }
      }).catch(() => {
      })
    },
    uncoveredTableCellClassName({ row, column, columnIndex }) {
    }
  }
}
</script>