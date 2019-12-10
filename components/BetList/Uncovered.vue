<template lang='pug'>
.history-content
  .history-content__header(id="uncoveredHeader")
    div(style="padding: 2px 0")
      button.button(@click="openMultiOrder") 平倉
      button.button(@click="multiOrderAllClick(true)") 全選
      button.button(@click="multiOrderAllClick(false)") 全不選
  .history-content__body(:style="{height: height.uncovered}")
    client-only
      vxe-table(
        :data='$store.state.uncovered'
        :cell-class-name='uncoveredTableCellClassName',
        ref="multipleTable"
        max-width="100%"
        height="100%"
        size="mini"
        column-min-width="60"
        border
        auto-resize
        highlight-current-row)
        vxe-table-column(width="30" align="center")
          template(slot-scope='scope')
            input(type="checkbox" v-model="multiOrderSelect" :value="scope.row.Serial" :disabled="!scope.row.Operation[2]")
        vxe-table-column(title='操作' align="center")
          template(slot-scope='scope')
            button.button(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平倉
        vxe-table-column(field='Serial' title='序號')
        vxe-table-column(field='Name' title='商品')
        vxe-table-column(title='型別')
          template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
        vxe-table-column(field='FinalPrice' title='成交價')
        vxe-table-column(field='Quantity' title='口數')
        vxe-table-column(field='Fee' title='手續費')
        vxe-table-column(title='損失點數' align="center")
          template(slot-scope='scope')
            button.button.button_border__success(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('lossPointDialog', scope.row)") {{ scope.row.LossPoint }}
        vxe-table-column(title='獲利點數' align="center")
          template(slot-scope='scope')
            button.button.button_border__danger(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('winPointDialog', scope.row)") {{ scope.row.WinPoint }}
        vxe-table-column(title='倒限(利)' align="center")
          template(slot-scope='scope')
            button.button(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('profitPointDialog', scope.row)") {{ scope.row.InvertedPoint }}
        vxe-table-column(field='thisSerialTotalMoney', title='未平損益')
          template(slot-scope='scope')
            span(v-if="scope.row['thisSerialTotalMoney'] == 0" class="text__black") {{ scope.row['thisSerialTotalMoney'] }}
            span(v-else :class="scope.row['thisSerialTotalMoney'] > 0 ? 'text__up' : 'text__down'") {{ scope.row['thisSerialTotalMoney'] }}
        vxe-table-column(title='點數')
          template(slot-scope='scope')
            .change-icon
              .icon-arrow(v-if="scope.row['thisSerialPointDiff'] != 0" :class="scope.row['thisSerialPointDiff'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
            span(v-if="scope.row['thisSerialPointDiff'] == 0" class="text__black") {{ scope.row['thisSerialPointDiff'] }}
            span(v-else :class="scope.row['thisSerialPointDiff'] > 0 ? 'text__up' : 'text__down'") {{ scope.row['thisSerialPointDiff'] }}
        vxe-table-column(field='Day', title='天數')
        vxe-table-column(field='State', title='狀態' width="150px" fixed="right")
  //-新倒限利點數
  el-dialog(
    :visible.sync='profitPointDialog'
    :modal='false'
    width="400px"
    title='新倒限利點數'
    v-dialogDrag)
    .header-custom(slot='title') 新倒限利點數
    template
      .dialog__body
        p.text__center
          span [{{ editPoint.name }}]
          span 報價:
            span.text__bold {{ editPoint.nowPrice }}
          span 類型:
            span.text__bold {{ editPoint.buyOrSellName }}
          span 成交:
            span.text__bold {{ editPoint.nowPrice - editPoint.limitPoint }}
              span(v-if="editPoint.limitPoint >= 0" class="text__danger") (+{{editPoint.limitPoint}})
              span(v-else class="text__success") ({{editPoint.limitPoint}})
        p.text__center 新倒限利不得大於:
          span.text__bold.bg-colr-warring [ {{ editPoint.limitPoint }} ]
        p.text__center 新倒限利需大於會員最低停損點數:
          span.text__bold.bg-colr-warring [ {{ editPoint.stopPoint }} ]
        p.text__center 新倒限利
        p.text__center
          button.button(@click="editPoint.price -= 10") -10
          button.button(@click="editPoint.price -= 5") -5
          el-input-number.changeNumButton(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
          button.button(@click="editPoint.price += 5") +5
          button.button(@click="editPoint.price += 10") +10
        p.text__center 計算結果:
          span.text__bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
      .dialog__footer
        button.button__light(@click="editPoint.price = 0") 清除設定
        button.button__light(@click="profitPointDialog = false") 取消
        button.button(type='primary' @click="doEditPoint") 送出
  //-新獲利點數
  el-dialog(
    :visible.sync='winPointDialog'
    :modal='false'
    width="400px"
    title='新獲利點數'
    v-dialogDrag)
    .header-custom(slot='title') 新獲利點數
    template
      .dialog__body
        p.text__center
          span [{{ editPoint.name }}]
          span 報價:
            span.text__bold {{ editPoint.nowPrice }}
          span 類型:
            span.text__bold {{ editPoint.buyOrSellName }}
          span 成交:
            span.text__bold {{ editPoint.nowPrice - editPoint.limitPoint }}
              span(v-if="editPoint.limitPoint >= 0" class="text__danger") (+{{editPoint.limitPoint}})
              span(v-else class="text__success") ({{editPoint.limitPoint}})
        p.text__center 新獲利點需大於:
          span.text__bold.bg-colr-warring [ {{ editPoint.limitPoint }} ]
        p.text__center 新獲利點需大於會員最低停損點數:
          span.text__bold.bg-colr-warring [ {{ editPoint.stopPoint }} ]
        p.text__center 新獲利點
        p.text__center
          button.button(@click="editPoint.price -= 10") -10
          button.button(@click="editPoint.price -= 5") -5
          el-input-number.changeNumButton(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
          button.button(@click="editPoint.price += 5") +5
          button.button(@click="editPoint.price += 10") +10
        p.text__center 計算結果:
          span.text__bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
      .dialog__footer
        button.button__light(@click="editPoint.price = 0") 清除設定
        button.button__light(@click="winPointDialog = false") 取消
        button.button(type='primary' @click="doEditPoint") 送出
  //-新損失點數
  el-dialog(
    :visible.sync='lossPointDialog'
    :modal='false'
    width="450px"
    title='新損失點數'
    v-dialogDrag)
    .header-custom(slot='title') 新損失點數
    template
      .dialog__body
        p.text__center
          span [{{ editPoint.name }}]
          span 報價:
            span.text__bold {{ editPoint.nowPrice }}
          span 類型:
            span.text__bold {{ editPoint.buyOrSellName }}
          span 成交:
            span.text__bold {{ editPoint.nowPrice - editPoint.limitPoint }}
              span(v-if="editPoint.limitPoint >= 0" class="text__danger") (+{{editPoint.limitPoint}})
              span(v-else class="text__success") ({{editPoint.limitPoint}})
        p.text__center 新損失點需大於:
          span.text__bold.bg-colr-warring [ {{ editPoint.limitPoint }} ]
        p.text__center 新損失點需大於會員最低停損點數:
          span.text__bold.bg-colr-warring [ {{ editPoint.stopPoint }} ]
        p.text__center 新損點
        p.text__center
          button.button(@click="editPoint.price -= 10") -10
          button.button(@click="editPoint.price -= 5") -5
          el-input-number.changeNumButton(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
          button.button(@click="editPoint.price += 5") +5
          button.button(@click="editPoint.price += 10") +10
        p.text__center 計算結果:
          span.text__bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
      .dialog__footer
        button.button__light(@click="editPoint.price = 0") 清除設定
        button.button__light(@click="lossPointDialog = false") 取消
        button.button(type='primary' @click="doEditPoint") 送出
  //-改價減量
  el-dialog(
    :visible.sync='editDialog'
    :modal='false'
    width="600"
    title='改價減量'
    v-dialogDrag)
    .header-custom(slot='title') 改價減量
    template
      .dialog__body
        .d-flex.justify-content-around
          .form
            .input
              span.label 序號
              input(:value="edit.serial" :disabled="true")
            .input
              span.label 商品
              input(:value="edit.itemName" :disabled="true")
            .input
              span.label 會員
              input(:value="$store.state.userInfo.Account" :disabled="true")
            .input
              span.label 買賣
              input(:value="edit.buyOrSellName" :disabled="true")
          el-form(size="mini")
            el-form-item(lable="口數")
              el-input-number(v-model="edit.submit" :min="1" :max="edit.submitMax")
            el-form-item
              label.radio.inline
                input.radio__input(type="radio" v-model='edit.buyType' value='0')
                span.radio__label 市價單
              label.radio.inline
                input.radio__input(type="radio" v-model='edit.buyType' value='1')
                span.radio__label 限價單
            el-form-item(title="限價" v-if="edit.buyType == '1'")
              el-input-number(v-model="edit.nowPrice")
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
      i.el-icon-info
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
</template>

<script>

import { mapState } from 'vuex'
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
      editDialog: false,
      deleteConfirm: false,
      multiOrderConfirm: false,
      lossPointDialog: false,
      winPointDialog: false,
      profitPointDialog: false,
      orderReport: true,
      valueDateInterval: [],
      allCommodity: [],
      openEditPointRow: [],
      selectToDelete: [],
      multiOrderData: [],
      multiOrderSelect: [],
      multiDeleteData: [],
      multiDeleteSelect: [],
    }
  },
  mounted() {
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang
    this.isMobile = this.$store.state.isMobile
  },
  watch: {
  },
  methods: {
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
    openEditPoint(type, row) {
      this.openEditPointRow = row
      this.udpateEditPointData(type, row)
      //新損
      if (type == 'lossPointDialog') {
        this.editPoint.price = row.LossPoint
        this.lossPointDialog = true
      } else if (type == 'winPointDialog') {
        this.editPoint.price = row.WinPoint
        this.winPointDialog = true
      } else if (type == 'profitPointDialog') {
        this.editPoint.price = row.InvertedPoint
        this.profitPointDialog = true
      }
    },
    udpateEditPointData(type, row) {
      //商品現價
      const allNowPrices = this.$store.state.nowNewPrice
      let nowPrice = allNowPrices[row.ID]
      //買單or賣單
      const buyOrSell = row.BuyOrSell
      //成交價
      let finalPrice = row.FinalPrice == '' ? row.OrderPrice : row.FinalPrice

      //沒 OrderPrice && 沒 成交價 就不用判斷了
      if (row.OrderPrice == '' && row.FinalPrice == '') {
        finalPrice = 0
        this.editPoint.needLimit = false
      }

      //目前獲利點數
      let nowWin = 0
      //目前損失點數
      let nowLoss = 0
      //會員最低停損點數
      let memberStopPoint = 0

      this.allCommodity.forEach(function(val) {
        if (val.ID == row.ID) {
          memberStopPoint = val.StopPoint
        }
      })

      this.editPoint.name = row.Name
      this.editPoint.type = type
      this.editPoint.itemId = row.ID
      this.editPoint.serial = row.Serial
      this.editPoint.nowPrice = nowPrice
      this.editPoint.stopPoint = memberStopPoint
      this.editPoint.buyOrSellName = row.BuyOrSell == 0 ? '多' : '空'

      //新損
      if (type == 'lossPointDialog') {
        //買單的話：成交點數 - 商品現在價格
        if (buyOrSell == 0) {
          nowLoss = finalPrice - nowPrice
        } else {
          //賣單的話：商品現在價格 - 成交點數
          nowLoss = nowPrice - finalPrice
        }
        //獲利點數
        this.editPoint.limitPoint = nowLoss
      } else if (type == 'winPointDialog') {
        //新獲利
        //買單的話：商品現在價格 - 成交點數
        if (buyOrSell == 0) {
          nowWin = nowPrice - finalPrice
        } else {
          //賣單的話：成交點數 - 商品現在價格
          nowWin = finalPrice - nowPrice
        }
        //獲利點數
        this.editPoint.limitPoint = nowWin
      } else if (type == 'profitPointDialog') {
        //新倒利
        //買單的話：商品現在價格 - 成交點數
        if (buyOrSell == 0) {
          nowWin = nowPrice - finalPrice
        } else {
          //賣單的話：成交點數 - 商品現在價格
          nowWin = finalPrice - nowPrice
        }
        //獲利點數
        this.editPoint.limitPoint = nowWin
      }
    },
    doEditPoint() {
      let sendText = ''

      //判斷限制點數
      if (this.editPoint.price != 0) {
        if (this.editPoint.type == 'profitPointDialog') {
          //倒利限
          if (this.editPoint.price >= this.editPoint.limitPoint && this.editPoint.needLimit) {
            this.$alert('不得大於: ' + this.editPoint.limitPoint + '點', '警告!')
            return
          }
          //損+利
        } else {
          if (this.editPoint.price <= this.editPoint.limitPoint && this.editPoint.needLimit) {
            this.$alert('必須大於: ' + this.editPoint.limitPoint + '點', '警告!')
            return
          }
        }

        //不得小於會員最低停損點數
        if (this.editPoint.price < this.editPoint.stopPoint) {
          this.$alert('必須大於會員最低停損點數: ' + this.editPoint.stopPoint + '點', '警告!')
          return
        }
      }

      sendText = 'e:' + this.userId + ',0,' + this.editPoint.itemId + ','

      if (this.editPoint.type == 'lossPointDialog') {
        sendText += '0,' + this.editPoint.price + ',0,3,'
        this.lossPointDialog = false
      } else if (this.editPoint.type == 'winPointDialog') {
        sendText += this.editPoint.price + ',0,0,1,'
        this.winPointDialog = false
      } else if (this.editPoint.type == 'profitPointDialog') {
        sendText += this.editPoint.price + ',0,0,5,'
        this.profitPointDialog = false
      }

      sendText += this.editPoint.serial + ',' + this.token + ',' + this.isMobile
      this.$socketOrder.send(sendText)
    },
    openEdit(row) {
      this.editDialog = true
      let buyType = '0'

      if (row.Odtype == '限價單' || row.Inverted == '1') {
        buyType = '1'
      }

      this.edit = {
        itemId: row.ID,
        serial: row.Serial,
        itemName: row.Name,
        submit: row.Quantity,
        submitMax: parseInt(row.Quantity),
        buyType: buyType,
        sourceBuyType: buyType,
        buyOrSellName: row.BuyOrSell == 0 ? '多' : '空',
        nowPrice: row.OrderPrice,
      }
    },
    doEdit() {
      let sendText

      //限價改市價
      if (this.edit.buyType == '0' && this.edit.sourceBuyType == '1') {
        sendText = 'e:' + this.userId + ',0,' + this.edit.itemId + ',0,0,0,6,' + this.edit.serial + ',' + this.token + ',' + this.isMobile
        this.$socketOrder.send(sendText)
      } else {
        //改數量 + 價格
        sendText = 'e:' + this.userId + ',' + this.edit.submit + ',' + this.edit.itemId + ',0,0,' + this.edit.nowPrice + ',2,' + this.edit.serial + ',' + this.token + ',' + this.isMobile
        this.$socketOrder.send(sendText)
      }

      this.editDialog = false
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

      switch (count) {
        case 1:
          sendText = 't:' + userId + ',' + row.Serial + ',' + token + ',' + isMobile + ',' + row.ID
          _this.$socketOrder.send(sendText)
          break
      }
    },
    buySelltableCellClassName({ row, column, columnIndex }) {
      //判斷是否顯示
      if (this.seeAllOrder == 0 && row.State != '未成交') {
        return 'hide'
      }

      if (columnIndex >= 3 && columnIndex <= 12) {
        if (row.BuyOrSell == 0) {
          return 'text__danger'
        } else {
          return 'text__success'
        }
      }
    },
    uncoveredTableCellClassName({ row, column, columnIndex }) {
      if (columnIndex >= 1 && columnIndex <= 13) {
        if (row.BuyOrSell == 0) {
          return 'text__danger'
        } else {
          return 'text__success'
        }
      }
    }
  }
}
</script>