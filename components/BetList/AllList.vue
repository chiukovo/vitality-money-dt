<template lang='pug'>
.history-content
  .history-content__header(id="buySellHeader")
    .d-flex.align-items-center
      button.button__white(@click="openMultiDelete") 全部刪單
      div(style="margin-left: 10px;")
        label.radio.inline
          input.radio__input(type="radio" v-model='seeAllOrder' value='1')
          span.radio__label 全部單
        label.radio.inline
          input.radio__input(type="radio" v-model='seeAllOrder' value='0')
          span.radio__label 未成交單
        label.radio.inline
          input.radio__input(type="radio" v-model='seeAllOrder' value='2')
          span.radio__label 已成交單
  .history-content__body(:style="{height: $parent.height.buySell}")
    client-only
      vxe-table.table__dark(
        :data='$store.state.buySell'
        :cell-class-name='buySelltableCellClassName',
        max-width="100%"
        height="100%"
        size="mini"
        column-min-width="60"
        stripe
        border
        auto-resize)
        vxe-table-column(width="120" align="center")
          template(slot-scope='scope')
            button.button__white(v-if="scope.row.Operation[0] || !notSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row)") 改
            //-改單
            button.button__white(v-if="scope.row.Operation[1]" @click="deleteOrder(scope.row)") 刪
            button.button__white(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平
        vxe-table-column(title='不留倉')
          template(slot-scope='scope')
            label.checkbox
              input.checkbox__input(type="checkbox" style="margin: 0" :checked="scope.row.DayCover" @click="changeDayCover(scope.row)")
              span.checkbox__label 不留倉
        vxe-table-column(field='Serial' title='序號' width="80")
        vxe-table-column(field='Name' title='商品' width="94")
        vxe-table-column(title='倒')
        vxe-table-column(title='多空' width="40px" align="center")
          template(slot-scope='scope')
            span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
        vxe-table-column(field='OrderPrice' title='委託價')
        vxe-table-column(field='Quantity' title='口數' width="40px" align="center")
        vxe-table-column(field='FinalPrice' title='成交價')
        vxe-table-column(field='OrderTime' width='150' title='下單時間')
        vxe-table-column(field='FinalTime' width='150' title='完成時間')
        vxe-table-column(field='Odtype' title='型別')
        vxe-table-column(title='損失點數' align="center" width="74")
          template(slot-scope='scope')
            button.button.button__success(:disabled="notSetWinLoss(scope.row.Operation)" @click="openEditPoint('lossPointDialog', scope.row)") {{ parseInt(scope.row.LossPoint) }}
        vxe-table-column(title='獲利點數' align="center" width="74")
          template(slot-scope='scope')
            button.button.button__danger(:disabled="notSetWinLoss(scope.row.Operation)" @click="openEditPoint('winPointDialog', scope.row)") {{ parseInt(scope.row.WinPoint) }}
        vxe-table-column(field='FinalTime' width='150' title='完成時間')
        vxe-table-column(title='狀態' width='130')
          template(slot-scope='scope')
            span.blink(v-if="scope.row.State == '未成交'") {{ scope.row.State }}
            span(v-else) {{ scope.row.State }}
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
              span.label 序號 {{ edit.serial }}
            .input
              span.label 商品 {{ edit.itemName }}
            .input
              span.label 多空
                span(:class="edit.BuyOrSell == 0 ? 'text__danger bg__danger' : 'text__success bg__success'" class="text__white") {{ edit.BuyOrSell == 0 ? '多' : '空' }}
          //-這個是右邊那個大框框 有紅色or綠色的
          div(v-if="findMainItemById(edit.itemId) != ''" :class="findMainItemById(edit.itemId).gain > 0 ? 'bg__danger' : 'bg__success'" class="text__white")
            ul
              //-成交價
              li {{ findMainItemById(edit.itemId).newest_price }}
              //-帳跌
              li
                span
                  .change-icon
                    .icon-arrow(:class="findMainItemById(edit.itemId).gain > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                  div(style="display: inline") {{ findMainItemById(edit.itemId).gain }}
              //-帳跌%
              li {{ findMainItemById(edit.itemId).gain_percent }}
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
            el-form-item(label="限價" v-if="edit.buyType == '1'")
              el-input-number(v-model="edit.nowPrice")
            el-form-item(label="獲利點")
              el-input-number(v-model="edit.winPoint")
            el-form-item(label="損失點")
              el-input-number(v-model="edit.lossPoint")
      .dialog__footer
        button.button__light(@click="editDialog = false") 取消
        button.button(type='primary' @click="doEdit") 送出
  //-刪除
  el-dialog(
    :visible.sync='deleteConfirm'
    :modal='false'
    :show-close='false'
    width="600px"
    title='確認刪除'
    v-dialogDrag)
    .header-custom(slot='title')
      |  確認刪除
    vxe-table(
      :data="multiDeleteData"
      max-width="100%"
      height="100px"
      size="mini"
      column-min-width="60"
      borde)
      vxe-table-column(field="serial" title='序號')
      vxe-table-column(field="name" title='目標商品')
      vxe-table-column(field="userName" title='用戶名稱')
      vxe-table-column(field="buy" title='買賣')
      vxe-table-column(field="price" title='價格')
      vxe-table-column(field="submit" title='口數')
    .dialog__footer
      button.button(@click="deleteConfirm = false") 取消
      button.button(type='primary' @click="doDelete") 確認
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data() {
    return {
      autoGoButtom: 1,
      showAllOrder: 1,
      seeAllOrder: 1,
      historyTabShow: 1,
      isMobile: '',
      userId: '',
      token: '',
      lang: '',
      edit: {
        itemId: '',
        serial: '',
        itemName: '',
        submit: 0,
        submitMax: 0,
        buyType: '',
        sourceBuyType: '',
        buyOrSellName: '',
        nowPrice: 0,
        lossPoint: 0,
        winPoint: 0,
      },
      editPoint: {
        name: '',
        type: '',
        itemId: '',
        serial: '',
        price: 0,
        nowPrice: 0,
        limitPoint: 0,
        stopPoint: 0,
        buyOrSellName: '',
        needLimit: true,
      },
      editDialog: false,
      deleteConfirm: false,
      lossPointDialog: false,
      winPointDialog: false,
      allCommodity: [],
      openEditPointRow: [],
      selectToDelete: [],
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
  methods: {
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
    notSetWinLoss(operation) {
      return operation[0] == 0 && operation[1] == 0 && operation[2] == 0 && operation[4] == 0
    },
    openMultiDelete() {
      let _this = this
      this.multiDeleteData = []

        _this.$store.state.buySell.forEach(function(row) {
          if (row.Operation[1]) {
            _this.multiDeleteData.push({
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

      if (this.$store.state.localStorage.customSetting.noConfirmDelete) {
        this.doDelete()
      } else {
        this.deleteConfirm = true
      }
    },
    multiDeleteAllClick(allChecked) {
      let _this = this

      if (!allChecked) {
        _this.multiDeleteSelect = []
        return
      }

      _this.$store.state.buySell.forEach(function(val) {
        if (val.Operation[1]) {
          _this.multiDeleteSelect.push(val.Serial)
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
        lossPoint: parseInt(row.LossPoint),
        winPoint: parseInt(row.WinPoint),
      }
    },
    deleteOrder(row) {
      this.multiDeleteData = [{
        name: this.$store.state.itemName,
        userName: this.$store.state.userInfo.Account,
        buy: row.BuyOrSell == 0 ? '多' : '空',
        price: row.Odtype,
        submit: row.Quantity,
        itemId: row.ID,
        serial: row.Serial,
      }]

      //如果勾選刪單不確認
      if (this.$store.state.localStorage.customSetting.noConfirmDelete) {
        this.doDelete()
      } else {
        this.deleteConfirm = true
      }
    },
    doDelete() {
      let _this = this

      this.multiDeleteData.forEach(function(val) {
        //send
        let sendText = 'e:' + _this.userId + ',0,' + val.itemId + ',0,0,0,0,' + val.serial + ',' + _this.token + ',' + _this.isMobile
        _this.$socketOrder.send(sendText)
      })

      this.multiDeleteData = []
      this.deleteConfirm = false
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
    buySelltableCellClassName({ row, column, columnIndex }) {
      //判斷是否顯示
      if (this.seeAllOrder == 0 && row.State != '未成交') {
        return 'hide'
      }
      if (this.seeAllOrder == 2 && row.State == '未成交') {
        return 'hide'
      }
    },
  }
}
</script>