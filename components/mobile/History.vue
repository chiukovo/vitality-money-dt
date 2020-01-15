<template lang='pug'>
.page
  .main
    .transaction-tabs.tabs-nav.tabs-nav-theme1
      .tabs__item(@click="historyShow = 1" :class="{'is-active': historyShow == 1}") 全部
        span {{ $store.state.buySell.length }}
      .tabs__item(@click="historyShow = 2" :class="{'is-active': historyShow == 2}") 未平
        span {{ $store.state.uncovered.length }}
      .tabs__item(@click="historyShow = 3" :class="{'is-active': historyShow == 3}") 已平
      .tabs__item(@click="historyShow = 4" :class="{'is-active': historyShow == 4}") 統計
    .area(v-if='historyShow == 1' style="height: calc(100% - 40px);overflow-y: auto;")
      ul.area-tran-list
        li(:class="checkHasEdit(item)" v-for="item in $store.state.buySell" @click="openControl(item, '改價減量', false)")
          ul.tran-item
            li
              .tran-item__name(style="width: 60px;") {{ item.Name }}
              .tran-item__yellow {{ item.Serial }}
            li
              .text__center.text__danger.text__lg(style="width: 20px;") {{ item.BuyOrSell == 0 ? '多' : '空' }}
            li
              .tran-item__hey.text__lg {{ item.Quantity }}
            li
              div(style="min-width:60px")
                span.text__secondary 獲利
                span.tran-item__ha {{ parseInt(item.WinPoint) }}
              div
                span.text__secondary 損失
                span.tran-item__ha {{ parseInt(item.LossPoint) }}
            li
              div(style="width: 98px;")
                span.text__secondary {{ item.OrderPrice }}
                span.text__secondary {{ dateOnlyHis(item.OrderTime) }}
              div
                span {{ item.FinalPrice }}
                span {{ dateOnlyHis(item.FinalTime) }}
            li(style="width: 80px;")
              .tran-item__yo {{ item.Odtype }}
              div {{ item.State }}
    .area(v-if='historyShow == 2' style="height: calc(100% - 40px);overflow-y: auto;")
      .area-fixed
        button.button(@click="openMultiOrder") 全部平倉
      ul.area-tran-list
        li(:class="item.Operation[3] == 0 ? '' : 'hs-edit'" v-for="item in $store.state.uncovered" @click="openControl(item, '平倉設定', true)")
          ul.tran-item
            li
              .tran-item__name(style="width: 60px;")  {{ item.Name }}
              .tran-item__yellow {{ item.Serial }}
                //-span 1天
            li
              .text__center.text__danger.text__lg(style="width: 20px;") {{ item.BuyOrSell == 0 ? '多' : '空' }}
            li
              .tran-item__hey {{ item.WinPoint }}
              .tran-item__fee {{ item.LossPoint }}
            li
              div
                span.text__secondary 獲利
                span.tran-item__ha
                  div
                    .change-icon(v-if="typeof item.thisSerialPointDiff != 'undefined'")
                      .icon-arrow(v-if="item.thisSerialPointDiff != 0" :class="item.thisSerialPointDiff > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                    span(v-if="item.thisSerialPointDiff == 0" class="text__black") {{ item.thisSerialPointDiff }}
                    span(v-else :class="item.thisSerialPointDiff > 0 ? 'text__danger' : 'text__success'") {{ item.thisSerialPointDiff }}
              div
                span.text__secondary 損失
                span.tran-item__ha
                  div
                    span(v-if="item.thisSerialTotalMoney == 0" class="text__black") {{ item.thisSerialTotalMoney }}
                    span(v-else :class="item.thisSerialTotalMoney > 0 ? 'text__danger' : 'text__success'") {{ item.thisSerialTotalMoney }}
            li {{ item.FinalPrice }}
    .area(v-if='historyShow == 3' style="height: calc(100% - 40px);overflow-y: auto;")
      ul.area-tran-list
        li(v-for="item in $store.state.covered")
          ul.tran-item
            li
              .tran-item__name {{ item.Name }}
            li
              .text__danger.text__lg {{ item.BuyOrSell == 0 ? '多' : '空' }}
            li
              .tran-item__hey {{ item.SerialCoveredNum }}
              .tran-item__fee {{ item.Fee }}
            li
              div
                span.text__secondary 成交
                span.tran-item__ha
                  span.tran-item__yellow {{ item.NewPrice }}
                  span -
              div
                span.text__secondary 平倉
                span.tran-item__ha
                  span.tran-item__yellow {{ item.CoverPrice }}
                  span -
            li
              span(:class="item.Money < 0 ? 'text__success' : 'text__danger'") {{ item.Money | currency }}
    .area(v-if='historyShow == 4' style="height: calc(100% - 40px);overflow-y: auto;")
      ul.area-tran-list
        li(v-for="item in $store.state.commodity")
          ul.tran-item
            li
              .tran-item__name.text__lg(style="width: 80px;") {{ item.Name }}
            li
              .tran-item__put.bg__danger {{ item.TotalBuySubmit　}}
              .tran-item__put.bg__success {{ item.TotalSellSubmit}}
            li
              .tran-item__hey.text__lg {{ item.TotalSubmit}}
            li
              div
                span.text__secondary 手續費
                span {{ item.TotalFee }}
            li
              .text__danger.text__lg
                span.text__success(v-if="item.TodayMoney < 0") {{ item.TodayMoney}}
                span.text__danger(v-else) {{ item.TodayMoney}}
    //-改價減量
    el-dialog(
      :visible.sync='editDialog'
      :modal='false'
      width="260px"
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
          el-form(ref='form' label-width='55px')
            div(v-if="!isUncovered")
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
            p(style="color: #000;") 新獲利點需大於:
              span.text__bold.text__danger [ {{ win.limitPoint }} ]
            el-form-item(label="獲利點")
              el-input-number(v-model="edit.winPoint")
            p(style="color: #000;") 新損失點需大於:
              span.text__bold.text__danger [ {{ loss.limitPoint }} ]
            el-form-item(label="損失點")
              el-input-number(v-model="edit.lossPoint")
            p(style="color: #000;") 新倒限點不得大於:
              span.text__bold.text__danger [ {{ inverted.limitPoint }} ]
            el-form-item(label="倒限點")
              el-input-number(v-model="edit.invertedPoint")
        .dialog__footer
          button.button(@click="editDialog = false") 取消
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
    //-控制選項
    el-dialog(
      :visible.sync='showControl'
      :modal='false'
      :title='showControlTitle'
      v-dialogDrag)
      .header-custom(slot='title') {{ showControlTitle }}
      template
        div(v-if="showControlTitle == '改價減量'")
          ul.el-dialog__list
            li.button(@click="deleteOrder(controlData)") 刪單
            li.button(@click="openEdit(controlData)") 改價減量
            li.button(@click="openEdit(controlData)") 設定損益
        div(v-else)
          ul.el-dialog__list
            li.button(@click="coveredCheck(controlData, 1)") 市價平倉
            li.button(@click="openEdit(controlData)") 設定損益
            li.button(@click="changeDayCover(controlData)")
              span(v-if="controlData.DayCover") 不留倉
              span(v-else) 留倉
        table.popupAllSingleSelectNo.my-2
          tbody
            tr
              td.title 序號
              td {{ controlData.Serial }}
            tr
              td.title 商品
              td {{ controlData.Name }}
            tr
              td.title 委託價
              td {{ controlData.OrderPrice }}
            tr
              td.title 多空
              td
                span(:class="controlData.BuyOrSell == 0 ? 'text__danger' : 'text__success'") {{ controlData.BuyOrSell == 0 ? '多' : '空' }}
            tr
              td.title 口數
              td {{ controlData.Quantity }}
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'
//-改單用
import "@/plugins/betListPoint.js"

export default {
  data () {
    return {
      historyShow: 1,
      checked: false,
      isUncovered: false,
      isMobile: '',
      userId: '',
      token: '',
      lang: '',
      form: {
        start: '',
        end: '',
      },
      activeName: 'tabs1',
      checked: false,
      multiOrderConfirm: false,
      deleteConfirm: false,
      showControl: false,
      showControlTitle: '',
      controlData: {},
      selectToDelete: [],
      multiOrderData: [],
      multiOrderSelect: [],
      multiOrderAll: false,
      multiDeleteData: [],
      multiDeleteSelect: [],
    };
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

      this.showControl = false
    },
    openControl(item, title, isUncovered) {
      this.isUncovered = isUncovered ? isUncovered : false

      if (item.Operation[0] || item.Operation[1] || item.Operation[2] || item.Operation[3]) {
        //open
        this.showControl = true
        this.showControlTitle = title
        this.controlData = item
      }
    },
    checkHasEdit(item) {
      if (item.Operation[0] || item.Operation[1]) {
        return 'hs-edit'
      }
    },
    openMultiOrder() {
      let _this = this
      this.multiOrderData = []

      _this.multiOrderSelect.forEach(function(serial) {
        _this.$store.state.uncovered.forEach(function(row) {
          if (row.Serial == serial) {
            _this.multiOrderData.push({
              name: _this.$store.state.itemName,
              userName: _this.$store.state.userInfo.Account,
              buy: row.BuyOrSell == 0 ? '多' : '空',
              price: row.Odtype,
              submit: row.Quantity,
              itemId: row.ID,
              serial: row.Serial,
            })
          }
        })
      })

      this.multiOrderConfirm = true
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
    selectCheckDelete(row) {
      if (row.Operation[0]) {
        return true
      }

      return false
    },
    openMultiDelete() {
      let _this = this
      this.multiDeleteData = []

      _this.multiDeleteSelect.forEach(function(serial) {
        _this.$store.state.buySell.forEach(function(row) {
          if (row.Serial == serial) {
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
      })

      if (this.$store.state.localStorage.customSetting.noConfirmDelete) {
        this.doDelete()
      } else {
        this.deleteConfirm = true
      }
    },
    selectionChangeDelete(target) {
      let _this = this
      this.multiDeleteData = []

      target.forEach(function(row) {
        _this.multiDeleteData.push({
          name: _this.$store.state.itemName,
          userName: _this.$store.state.userInfo.Account,
          buy: row.BuyOrSell == 0 ? '多' : '空',
          price: row.Odtype,
          submit: row.Quantity,
          itemId: row.ID,
          serial: row.Serial,
        })
      })
    },
    checkRowShow({row, index}) {
      if (!row.show && !this.checked) {
        //return 'hide'
      }
    },
    deleteOrder(row) {
      this.multiDeleteData = []

      this.multiDeleteData.push({
        name: this.$store.state.itemName,
        userName: this.$store.state.userInfo.Account,
        buy: row.BuyOrSell == 0 ? '多' : '空',
        price: row.Odtype,
        submit: row.Quantity,
        itemId: row.ID,
        serial: row.Serial,
      })

      this.deleteConfirm = true
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
    handleClick() {},
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
    coveredCheck(row, count) {
      this.$confirm('確認要平倉嗎?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doCovered(row, count)
      }).catch(() => {
      });
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

      this.showControl = false
    },
    buySelltableCellClassName({ row, column, columnIndex }) {
      //red
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
    },
    coveredTableCellClassName({ row, column, columnIndex }) {
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