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
            button.button__white(v-if="scope.row.Operation[1]" @click="deleteOrder(scope.row)") 刪
            button.button__white(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平
            button.button__white(v-if="scope.row.Operation[0] || !notSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row)") 改
        vxe-table-column(title='不留倉')
          template(slot-scope='scope')
            label.checkbox
              input.checkbox__input(type="checkbox" style="margin: 0" :checked="scope.row.DayCover" @click="changeDayCover(scope.row)")
              span.checkbox__label 不留倉
        vxe-table-column(field='Serial' title='序號' width="80")
        vxe-table-column(field='Name' title='商品' width="94")
        vxe-table-column(title='倒')
          template(slot-scope='scope') {{ scope.row.InvertedPoint }}
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
          template(slot-scope='scope') {{ parseInt(scope.row.LossPoint) }}
        vxe-table-column(title='獲利點數' align="center" width="74")
          template(slot-scope='scope') {{ parseInt(scope.row.WinPoint) }}
        vxe-table-column(field='FinalTime' width='150' title='完成時間')
        vxe-table-column(title='狀態' width='130')
          template(slot-scope='scope')
            span.blink(v-if="scope.row.State == '未成交'") {{ scope.row.State }}
            span(v-else) {{ scope.row.State }}
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
          el-form-item(label="口數")
            el-input-number(v-model="edit.submit" :max="edit.submitMax" :step="0.25")
          el-form-item
            label.radio.inline
              input.radio__input(type="radio" v-model='edit.buyType' value='0')
              span.radio__label 市價單
            label.radio.inline
              input.radio__input(type="radio" v-model='edit.buyType' value='1')
              span.radio__label 限價單
          el-form-item(label="限價" v-if="edit.buyType == '1'")
            el-input-number(v-model="edit.nowPrice")
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
      deleteConfirm: false,
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