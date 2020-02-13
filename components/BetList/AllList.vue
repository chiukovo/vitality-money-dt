<template lang='pug'>
.history-content
  .history-content__header(id="buySellHeader")
    .d-flex.align-items-center
      button.button__white(@click="deleteAll") 全部刪單
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
    table.custom__table.table__dark
      thead.thead
        tr
          th
          th 不留倉
          th 序號
          th(style="width: 100px;") 商品
          th 倒
          th 多空
          th 委託價
          th 口數
          th 成交價
          th(style="width: 150px;") 下單時間
          th(style="width: 150px;") 完成時間
          th 型別
          th 損失點數
          th 獲利點數
          th(style="width: 130px;") 狀態
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in $store.state.buySell" v-if="checkRowShow(row)" @click="trClick($event)")
          td
            button.button__white(v-if="row.Operation[1]" @click="deleteOrder(row)") 刪
            button.button__white(v-if="row.Operation[2]" @click="doCovered(row, 1)") 平
            button.button__white(v-if="row.Operation[0] || !cantSetWinLoss(row.Operation)" @click="openEdit(row, 'edit')") 改
          td
            div(v-if="row.Operation[2]")
              label.checkbox
                input.checkbox__input(type="checkbox" style="margin: 0" :checked="row.DayCover" @click="changeDayCover(row, $event)" :disabled="dayCoverIsDisabled(row.ID)")
                span.checkbox__label 不留倉
          td {{ row.Serial }}
          td(style="width: 100px;")
            span(v-if="row.State != '已刪除'") {{ row.Name }}
            s(v-else) {{ row.Name }}
          td {{ row.InvertedPoint }}
          td
            span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
          td {{ row.OrderPrice }}
          td {{ row.Quantity }}
          td {{ row.FinalPrice }}
          td(style="width: 150px;") {{ row.OrderTime }}
          td(style="width: 150px;") {{ row.FinalTime }}
          td {{ row.Odtype }}
          td {{ parseInt(row.LossPoint) }}
          td {{ parseInt(row.WinPoint) }}
          td(style="width: 130px;")
            span.blink(v-if="row.State == '未成交'") {{ row.State }}
            span(v-else) {{ row.State }}
        tr(class="non-data" v-if="$store.state.buySell.length == 0")
          td 無資料
  //-改價減量
  el-dialog(
    :visible.sync='editDialog'
    :modal='false'
    width="330px")
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
              span.ml-2 {{ findMainItemById(edit.itemId).gain_percent }}%
        el-form(ref='form' size='mini' label-width='94px')
          .edit-base(v-if="editType == 'edit' && edit.operation[0]")
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
              span.pl-4 新獲利點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPoint }} ]
              el-form-item(label="獲利點" style="margin-bottom: 16px;")
                el-input-number(v-model="edit.winPoint")
            .loss-point.text__center
              span.pl-4 新損失點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitLossPoint }} ]
              el-form-item(label="損失點")
                el-input-number(v-model="edit.lossPoint")
          //-行情輸入
          .money-input(v-show="pointInputType == 2")
            .win-point.text__center
              span.pl-4 新獲利點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPrice }} ]
              el-form-item(label="獲利點")
                el-input-number(v-model="changeWinPrice")
            .loss-point.text__center
              span.pl-4 新損失點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitLossPrice }} ]
              el-form-item(label="損失點")
                el-input-number(v-model="changeLossPrice")
        .badge.badge-warning(v-show="editType == 'edit'") 口數只能減少或不變，損失點/獲利點/倒限點 為
          span.badge-rr 點數
          | 設定
      .dialog__footer
        button.button.button__light(@click="editDialog = false") 取消
        button.button(type='primary' @click="doEdit") 送出
  //-刪除
  el-dialog(
    :visible.sync='deleteConfirm'
    :modal='false'
    :show-close='false'
    width="600px"
    title='確認刪除'
    v-if="deleteConfirm")
    .header-custom(slot='title')
      |  確認刪除
    div
      table.custom__table.general
        thead.thead
          tr
            th 序號
            th(style="width: 100px") 目標商品
            th 用戶名稱
            th 買賣
            th 價格
            th 口數
            th 時間
        tbody.tbody
          tr(v-for="row in multiDeleteData")
            td {{ row.serial }}
            td(style="width: 100px") {{ row.name }}
            td {{ row.userName }}
            td
              div
                span(:class="row.buy == 0 ? 'bg__danger' : 'bg__success'" class="text__white") {{ row.buy == 0 ? '多' : '空' }}
            td {{ row.price }}
            td {{ row.submit }}
            td {{ dateOnlyHis(row.orderTime) }}
          tr(class="non-data" v-if="multiDeleteData.length == 0")
            td 無資料
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
    v-if="multiOrderConfirm")
    .header-custom(slot='title')
      |  確認平倉
    div
      table.custom__table.general
        thead.thead
          tr
            th 序號
            th(style="width: 100px") 目標商品
            th 用戶名稱
            th 買賣
            th 價格
            th 口數
        tbody.tbody
          tr(v-for="row in multiOrderData")
            td {{ row.serial }}
            td(style="width: 100px") {{ row.name }}
            td {{ row.userName }}
            td
              div
                span(:class="row.buy == 0 ? 'bg__danger' : 'bg__success'" class="text__white") {{ row.buy == 0 ? '多' : '空' }}
            td {{ row.price }}
            td {{ row.submit }}
          tr(class="non-data" v-if="multiOrderData.length == 0")
            td 無資料
    .dialog__footer
      button.button.button__light(@click="multiOrderConfirm = false") 取消
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
    this.computedTableContent()
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
    checkRowShow(row) {
      //判斷是否顯示
      if (this.seeAllOrder == 0 && row.State != '未成交') {
        return false
      }

      if (this.seeAllOrder == 2 && row.State == '未成交') {
        return false
      }

      return true
    },
  }
}
</script>