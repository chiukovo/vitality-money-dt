<template lang='pug'>
.page
  .main
    .transaction-tabs.tabs-nav
      .tabs__item(@click="historyShow = 1" :class="{'is-active': historyShow == 1}") 全部
        span {{ $store.state.buySell.length }}
      .tabs__item(@click="historyShow = 2" :class="{'is-active': historyShow == 2}") 未平
        span {{ $store.state.uncovered.length }}
      .tabs__item(@click="historyShow = 3" :class="{'is-active': historyShow == 3}") 已平
      .tabs__item(@click="historyShow = 4" :class="{'is-active': historyShow == 4}") 統計
    .area(v-if='historyShow == 1' style="height: calc(100% - 40px);overflow-y: auto;")
      ul.area-tran-list
        li(:class="checkHasEdit(item)" v-for="item in $store.state.buySell" @click="openControl(item, '改價減量')")
          ul.tran-item
            li
              .tran-item__name {{ item.Name }}
              .tran-item__yellow {{ item.Serial }}
            li
              .text__danger.text__lg {{ item.BuyOrSell == 0 ? '多' : '空' }}
            li
              .tran-item__hey.text__lg {{ item.Quantity }}
            li
              div
                span.text__secondary 獲利
                span.tran-item__ha {{ parseInt(item.WinPoint) }}
              div
                span.text__secondary 損失
                span.tran-item__ha {{ parseInt(item.LossPoint) }}
            li
              div
                span.text__secondary {{ item.OrderPrice }}
                span.text__secondary {{ dateOnlyHis(item.OrderTime) }}
              div
                span {{ item.FinalPrice }}
                span {{ dateOnlyHis(item.FinalTime) }}
            li
              .tran-item__yo {{ item.Odtype }}
              div {{ item.State }}
    .area(v-if='historyShow == 2' style="height: calc(100% - 40px);overflow-y: auto;")
      .area-fixed
        button.button(@click="openMultiOrder") 全部平倉
      ul.area-tran-list
        li(:class="item.Operation[3] == 0 ? '' : 'hs-edit'" v-for="item in $store.state.uncovered" @click="openControl(item, '平倉設定')")
          ul.tran-item
            li
              .tran-item__name {{ item.Name }}
              .tran-item__yellow {{ item.Serial }}
                //-span 1天
            li
              .text__danger.text__lg {{ item.BuyOrSell == 0 ? '多' : '空' }}
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
              .tran-item__name.text__lg {{ item.Name }}
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
                span.text__success(v-if="item.TotalPoint < 0") {{ item.TotalPoint}}
                span.text__danger(v-else) {{ item.TotalPoint}}
    //-新倒限利點數
    el-dialog(
      :visible.sync='profitPointDialog'
      :modal='false'
      width="96%"
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
            el-button(type="mini" @click="editPoint.price -= 10") -10
            el-button(type="mini" @click="editPoint.price -= 5") -5
            el-input-number(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
            el-button(type="mini" @click="editPoint.price += 5") +5
            el-button(type="mini" @click="editPoint.price += 10") +10
          p.text__center 計算結果:
            span.text__bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
        .dialog__footer
          el-button(@click="editPoint.price = 0") 清除設定
          el-button(@click="profitPointDialog = false") 取消
          el-button(type='primary' @click="doEditPoint") 送出
    //-新獲利點數
    el-dialog(
      :visible.sync='winPointDialog'
      :modal='false'
      width="96%"
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
            el-button(type="mini" @click="editPoint.price -= 10") -10
            el-button(type="mini" @click="editPoint.price -= 5") -5
            el-input-number(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
            el-button(type="mini" @click="editPoint.price += 5") +5
            el-button(type="mini" @click="editPoint.price += 10") +10
          p.text__center 計算結果:
            span.text__bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
        .dialog__footer
          el-button(@click="editPoint.price = 0") 清除設定
          el-button(@click="winPointDialog = false") 取消
          el-button(type='primary' @click="doEditPoint") 送出
    //-新損失點數
    el-dialog(
      :visible.sync='lossPointDialog'
      :modal='false'
      width="96%"
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
            el-button(type="mini" @click="editPoint.price -= 10") -10
            el-button(type="mini" @click="editPoint.price -= 5") -5
            el-input-number(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
            el-button(type="mini" @click="editPoint.price += 5") +5
            el-button(type="mini" @click="editPoint.price += 10") +10
          p.text__center 計算結果:
            span.text__bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
        .dialog__footer
          el-button(@click="editPoint.price = 0") 清除設定
          el-button(@click="lossPointDialog = false") 取消
          el-button(type='primary' @click="doEditPoint") 送出
    //-改價減量
    el-dialog(
      :visible.sync='editDialog'
      :modal='false'
      width="96%"
      title='改價減量'
      v-dialogDrag)
      .header-custom(slot='title') 改價減量
      template
        .dialog__body
          el-form(ref='form' size='mini' title-width='50px')
            el-form-item(title="序號")
              el-input(:value="edit.serial" :disabled="true")
            el-form-item(title="商品")
              el-input(:value="edit.itemName" :disabled="true")
            el-form-item(title="會員")
              el-input(:value="$store.state.userInfo.Account" :disabled="true")
            el-form-item(title="買賣")
              el-input(:value="edit.buyOrSellName" :disabled="true")
            el-form-item(title="口數")
              el-input-number(v-model="edit.submit" :min="1" :max="edit.submitMax")
            el-form-item
              el-radio(v-model='edit.buyType' label='0') 市價單
              el-radio(v-model='edit.buyType' label='1') 限價單
            el-form-item(title="限價" v-if="edit.buyType == '1'")
              el-input-number(v-model="edit.nowPrice")
        .dialog__footer
          el-button(@click="editDialog = false") 取消
          el-button(type='primary' @click="doEdit") 送出
    //-多單平倉
    el-dialog(
      :visible.sync='multiOrderConfirm'
      :modal='false'
      :show-close='false'
      width="96%"
      title='確認平倉'
      v-dialogDrag)
      .header-custom(slot='title')
        |  確認平倉
      client-only
        vxe-table.table(
          :data="multiOrderData"
          height="300px"
          borde
        )
          vxe-table-column(field="serial" title='序號')
          vxe-table-column(field="name" title='目標商品')
          vxe-table-column(field="userName" title='用戶名稱')
          vxe-table-column(field="buy" title='買賣')
          vxe-table-column(field="price" title='價格')
          vxe-table-column(field="submit" title='口數')
        .dialog__footer
          el-button(@click="multiOrderConfirm = false") 取消
          el-button(type='primary' @click="doMultiCovered") 確認
    //-刪除
    el-dialog(
      :visible.sync='deleteConfirm'
      :modal='false'
      :show-close='false'
      width="96%"
      title='確認刪除'
      v-dialogDrag)
      .header-custom(slot='title')
        |  確認刪除
      vxe-table.table(
        :data="multiDeleteData"
        style="width: 100%"
        height="300px"
        borde
      )
        vxe-table-column(field="serial" title='序號')
        vxe-table-column(field="name" title='目標商品')
        vxe-table-column(field="userName" title='用戶名稱')
        vxe-table-column(field="buy" title='買賣')
        vxe-table-column(field="price" title='價格')
        vxe-table-column(field="submit" title='口數')
      .dialog__footer
        el-button(@click="deleteConfirm = false") 取消
        el-button(type='primary' @click="doDelete") 確認
    //-控制選項
    el-dialog(
      :visible.sync='showControl'
      :modal='false'
      width="96%"
      :title='showControlTitle'
      v-dialogDrag)
      .header-custom(slot='title')
      template
        div(v-if="showControlTitle == '改價減量'")
          button(@click="deleteOrder(controlData)") 刪單
          button(@click="openEdit(controlData)") 改價減量
          button(@click="openEdit(controlData)") 設定損益
        div(v-else)
          button(@click="doCovered(controlData, 1)") 市價平倉
          button(@click="openEditPoint('winPointDialog', controlData)") 設定獲利
          button(@click="openEditPoint('lossPointDialog', controlData)") 設定損失
          button(@click="openEditPoint('profitPointDialog', controlData)") 設定倒限
        ul
          li 序號: {{ controlData.Serial }}
          li 商品: {{ controlData.Name }}
          li 委託價: {{ controlData.OrderPrice }}
          li 多空:
            span(:class="controlData.BuyOrSell == 0 ? 'text__danger' : 'text__success'") {{ controlData.BuyOrSell == 0 ? '多' : '空' }}
          li 口數: {{ controlData.Quantity }}
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      historyShow: 1,
      checked: false,
      isMobile: '',
      userId: '',
      token: '',
      lang: '',
      form: {
        start: '',
        end: '',
      },
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
      activeName: 'tabs1',
      checked: false,
      editDialog: false,
      deleteConfirm: false,
      multiOrderConfirm: false,
      lossPointDialog: false,
      winPointDialog: false,
      profitPointDialog: false,
      showControl: false,
      showControlTitle: '',
      controlData: {},
      valueDateInterval: [],
      allCommodity: [],
      openEditPointRow: [],
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
  methods: {
    openControl(item, title) {
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