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
            button.button__white(v-if="scope.row.Operation[0] || !cantSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'edit')") 改
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
    width="330px"
    v-dialogDrag)
    .header-custom(slot='title')
      span 改價減量
      span.badge.badge-warning ({{ pointInputType == 1 ? '點數' : '行情' }})
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
              .label 成交
              span {{ editPoint.finalPrice }}
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
        el-form(ref='form' size='mini' label-width='94px')
          .edit-base(v-if="editType == 'edit'")
            el-form-item(label="口數")
              el-input-number(v-model="edit.submit" :max="edit.submitMax" :step="0.25")
            el-form-item
              label.radio.inline
                input.radio__input(type="radio" v-model='edit.buyType' value='1')
                span.radio__label 限價單
              label.radio.inline
                input.radio__input(type="radio" v-model='edit.buyType' value='0')
                span.radio__label 市價單
            el-form-item(label="限價" v-if="edit.buyType == '1'")
              el-input-number(v-model="edit.nowPrice")
          //-點數輸入
          .point-input(v-show="pointInputType == 1")
            .win-point.text__center
              p.pl-15 新獲利點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPoint }} ]
              el-form-item(label="獲利點")
                el-input-number(v-model="edit.winPoint")
            .loss-point.text__center
              p.pl-15 新損失點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitLossPoint }} ]
              el-form-item(label="損失點")
                el-input-number(v-model="edit.lossPoint")
          //-行情輸入
          .money-input(v-show="pointInputType == 2")
            .win-point.text__center
              p.pl-15 新獲利點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPrice }} ]
              el-form-item(label="獲利點")
                el-input-number(v-model="changeWinPrice")
            .loss-point.text__center
              p.pl-15 新損失點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitLossPrice }} ]
              el-form-item(label="損失點")
                el-input-number(v-model="changeLossPrice")
        .badge.badge-warning(v-show="editType == 'edit'") 口數只能減少或不變，損失點/獲利點/倒限點 為
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
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data() {
    return {
      //點數1 行情2
      pointInputType: 1,
      autoGoButtom: 1,
      showAllOrder: 1,
      seeAllOrder: 1,
      historyTabShow: 1,
      isMobile: '',
      userId: '',
      token: '',
      lang: '',
    }
  },
  mounted() {
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang
    this.isMobile = this.$store.state.isMobile
  },
  computed: mapState({
    mainItem: 'mainItem',
  }),
  watch: {
    mainItem() {
      if (this.editDialog) {
        this.computedPointLimit()
      }
    },
    changeWinPrice(newData, oldData) {
      const limitPoint = this.editPoint.limitWinPoint
      const limitPrice = this.editPoint.limitWinPrice

      //0案增加
      if (oldData == 0 && newData == 1) {
        //強制加到大於數值
        this.edit.winPoint = limitPoint
        this.changeWinPrice = limitPrice
      } else if (oldData == limitPrice && newData == limitPrice - 1) {
        this.edit.winPoint = 0
        this.changeWinPrice = 0
      } else if (Math.abs(newData - oldData) == 1) {
        this.edit.winPoint += newData - oldData
      }
    },
    'edit.winPoint': {
      handler(newData, oldData) {
        const limit = this.editPoint.limitWinPoint

        //0案增加
        if (oldData == 0 && newData == 1) {
          //強制加到大於數值
          this.edit.winPoint = limit
        }

        if (oldData == limit && newData == limit - 1) {
          this.edit.winPoint = 0
        }
      },
      immediate: true,
    },
    changeLossPrice(newData, oldData) {
      const limitPoint = this.editPoint.limitLossPoint
      const limitPrice = this.editPoint.limitLossPrice

      //0案增加
      if (oldData == 0 && newData == 1) {
        //強制加到大於數值
        this.edit.lossPoint = limitPoint
        this.changeLossPrice = limitPrice
      } else if (oldData == limitPrice && newData == limitPrice - 1) {
        this.edit.lossPoint = 0
        this.changeLossPrice = 0
      } else if (Math.abs(newData - oldData) == 1) {
        this.edit.lossPoint += newData - oldData
      }
    },
    'edit.lossPoint': {
      handler(newData, oldData) {
        const limit = this.editPoint.limitLossPoint

        //0案增加
        if (oldData == 0 && newData == 1) {
          //強制加到大於數值
          this.edit.lossPoint = limit
        }

        if (oldData == limit && newData == limit - 1) {
          //強制加到大於數值
          this.edit.lossPoint = 0
        }
      },
      immediate: true,
    },
    changeInvertedPrice(newData, oldData) {
      this.edit.invertedPoint += newData - oldData
    },
  },
  methods: {
    cantSetWinLoss(operation) {
      return operation[0] == 0 && operation[1] == 0 && operation[2] == 0 && operation[4] == 0
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