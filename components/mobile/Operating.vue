<template lang='pug'>
.page
  .main(style="overflow: auto;")
    .area(style="width: 100%; overflow-x: auto;")
      table.table.table__mini(style="width: 440px")
        thead
          tr
            th(width="100"): .cell.text__center 商品
            th: .cell.text__center 成交
            th: .cell.text__center 漲跌
            th: .cell.text__center 漲幅%
            th: .cell.text__center 總量
            th: .cell.text__center 時間
            th(width="80"): .cell.text__center 交易
        tbody
          tr
            td: .cell.text__center {{ nowMainItem.product_name }}
            td: .cell.text__center(:class="nowMainItem.color") {{ nowMainItem.newest_price }}
            td: .cell.text__center(:class="nowMainItem.color")
              template
                .change-icon
                  .icon-arrow(:class="nowMainItem.gain > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                span(:class="nowMainItem.gain > 0 ? 'text__danger' : 'text__success'") {{ nowMainItem.gain }}
            td: .cell.text__center(:class="nowMainItem.color") {{ nowMainItem.gain_percent }}%
            td: .cell.text__center(:class="nowMainItem.color") {{ nowMainItem.total_qty }}
            td: .cell.text__center {{ nowMainItem.newest_time }}
            td: .cell.text__center {{ nowMainItem.state_name }}
    .area(style="width: 100%; overflow-x: auto;")
      table.table.table__mini(style="width: 600px")
        thead
          tr
            th: .cell.text__center 昨收價
            th: .cell.text__center 最高價
            th: .cell.text__center 最低價
            th: .cell.text__center 開盤價
            th: .cell.text__center 最後價
            th: .cell.text__center 最後交易日
            th: .cell.text__center 強平價
            th: .cell.text__center 強平價
            th: .cell.text__center 禁新價
            th: .cell.text__center 禁新價
        tbody
          tr
            td: .cell.text__center {{ nowMainItem.yesterday_close_price }}
            td: .cell.text__center(:class="nowMainItem.color") {{ nowMainItem.highest_price }}
            td: .cell.text__center(:class="nowMainItem.color") {{ nowMainItem.lowest_price }}
            td: .cell.text__center(:class="nowMainItem.color") {{ nowMainItem.open_price }}
            td: .cell.text__center(:class="nowMainItem.color") {{ nowMainItem.newest_price }}
            td: .cell.text__center {{ nowMainItem.end_date }}
            td: .cell.text__center {{ nowMainItem.new_point1 }}
            td: .cell.text__center {{ nowMainItem.new_point2 }}
            td: .cell.text__center {{ nowMainItem.cover_point1 }}
            td: .cell.text__center {{ nowMainItem.cover_point2 }}
    .area(v-if="orderMode == 1" style="height:300px;background-color: #000")
      button.leftButton(@click="showContentType--" v-show="showContentType != 1")
        i.material-icons chevron_left
      .area-main.area-main-block1(v-show="showContentType == 1")
        Chart(theme="black")
      .area-main.area-main-block2(v-show="showContentType == 2")
        //- 五檔揭示
        table.table.progress-table
          thead
            tr
              th(colspan='2'): .cell.text__right 委買
              th(colspan='2'): .cell.text__center 價格
              th(colspan='2'): .cell.text__left 委賣
          tbody
            tr(v-for="(val, key) in $store.state.items0" v-if="key <= 4")
              td(style='width:20%'): .cell
                .progress-bar.progress-bar__right
                  .progress-bar__inner(:style="'width: ' + $store.state.items0[key + 6][0] + '%'")
              td: .cell.text__center {{ $store.state.items0[key + 6][1] }}
              td: .cell.text__center.text__danger {{ $store.state.items0[key + 6][2] }}
              td: .cell.text__center.text__success {{ val[2] }}
              td: .cell.text__center {{ val[3] }}
              td(style='width:20%'): .cell
                .progress-bar
                  .progress-bar__inner(:style="'width: ' + val[4] + '%'")
        .itemDetail__Total.text__center
          .d-flex
            .col {{ $store.state.fiveTotal.more }}
            .col 總計
            .col {{ $store.state.fiveTotal.nullNum }}
          .d-flex
            .col.text__danger 多勢
            .col
              .progress-bar.progress-bar__total
                .progress-bar__inner(:style="'width: ' + $store.state.fiveTotal.morePercent + '%'")
            .col.text__success 空勢
      .area-main.area-main-block3(v-show="showContentType == 3")
        .d-flex.align-items-center
          ul(style="width: 40%;")
            li
              span.label 昨收:
              |{{ nowMainItem.yesterday_close_price }}
            li
              span.label 開盤:
              span(:class="nowMainItem.color") {{ nowMainItem.open_price }}
            li
              span.label 最高:
              span(:class="nowMainItem.color") {{ nowMainItem.highest_price }}
            li
              span.label 最低:
              span(:class="nowMainItem.color") {{ nowMainItem.lowest_price }}
          ul(style="width: 60%;")
            li
              span.label 最後成交價:
              span(:class="nowMainItem.color") {{ nowMainItem.newest_price }}
            li
              span.label 禁新:
              |{{ nowMainItem.cover_point1 }} / {{ nowMainItem.cover_point2 }}
            li
              span.label 強平:
              |{{ nowMainItem.new_point1 }} / {{ nowMainItem.new_point2 }}
            li
              span.label 最後交易日:
              |{{ nowMainItem.end_date }}
      button.rightButton(@click="showContentType++" v-if="showContentType != 3")
        i.material-icons chevron_right
    .area(v-if="orderMode == 2")
      .left(style="float: left;")
        //- 五檔揭示
        //- 賣
        div(v-if="$store.state.items0.length > 0")
          table
            tbody
              tr(v-for="(val, key) in $store.state.items0" v-if="key < 5")
                td
                  span(v-if="key == 2") 賣
                td: .text__center.text__success {{ val[2] }}
                td: .text__center.text__success {{ val[3] }}
                td(style='width:20%'): .cell
                  .progress-bar
                    .progress-bar__inner(:style="'width: ' + val[4] + '%'")
          //- 買
          table
            tbody
              tr(v-for="(val, key) in $store.state.items0" v-if="key >= 6")
                td
                  span(v-if="key == 8") 買
                td: .text__center.text__danger {{ val[2] }}
                td: .text__center.text__danger {{ val[1] }}
                td(style='width:20%'): .cell
                  .progress-bar.progress-bar__right
                    .progress-bar__inner(:style="'width: ' + val[0] + '%'")
          //-total
          table
            tbody
              tr
                td 總賣
                td {{ $store.state.fiveTotal.nullNum }}
                td(style='width:20%'): .cell
                  .progress-bar
                    .progress-bar__inner(:style="'width: ' + $store.state.fiveTotal.nullNumPercent + '%'")
              tr
                td 總買
                td {{ $store.state.fiveTotal.more }}
                td(style='width:20%'): .cell
                  .progress-bar.progress-bar__right
                    .progress-bar__inner(:style="'width: ' + $store.state.fiveTotal.morePercent + '%'")
        div(v-else style="width: 100px; padding-top: 50px") 無資料(五檔)

      .right
        Chart(theme="black")
    .area
      .area-order.area-order-theme2(v-if="orderMode == 2")
        table
          tbody
            tr
              td(colspan="2")
                .d-flex.align-items-center
                  label.title 商品
                  .order__select
                    select(v-model='selectItemId')
                      option(v-for="item in mainItem" :value='item.product_id') {{ item.product_name }}
              td
                label.radio
                  input.radio__input(type="radio" v-model='buyType' value='0')
                  span.radio__label 市價
            tr
              td(colspan="2")
                .d-flex.align-items-center
                  label.title 限價
                  .number-input
                    button.button__decrease(@click="nowPrice--")
                    input(type="text" v-model='nowPrice' :min="0")
                    button.button__increase(@click="nowPrice++")
              td
                label.radio
                  input.radio__input(type="radio" v-model='buyType' value='2')
                  span.radio__label 收盤單
            tr
              td(colspan="2")
                .d-flex.align-items-center
                  label.title 口數
                  .number-input
                    button.button__decrease(@click="changeSubmitNum('-')")
                    input(type="text" v-model='submitNum' :min="0")
                    button.button__increase(@click="changeSubmitNum('+')")
              td
                label.radio
                  input.radio__input(type="radio" v-model='buyType' value='1')
                  span.radio__label 限價
            tr
              td(colspan="3")
                .d-flex.align-items-center.button-group
                  button.button__danger(@click="checkOrder(0)") 多單
                  button.button__success(@click="checkOrder(1)") 空單
      ul.area-order.area-order-theme1(v-if="orderMode == 1")
        li
          label.title 商品
          .order__select
            select(v-model='selectItemId')
              option(v-for="item in mainItem" :value='item.product_id') {{ item.product_name }}
        li
          label.radio.inline
            input.radio__input(type="radio" v-model='buyType' value='0')
            span.radio__label 市價
          label.radio.inline
            input.radio__input(type="radio" v-model='buyType' value='2')
            span.radio__label 收盤單
          label.radio.inline
            input.radio__input(type="radio" v-model='buyType' value='1')
            span.radio__label 限價單
        li
          label.title 限價
          .number-input
            button.button__decrease(@click="nowPrice--")
            input(type="text" v-model='nowPrice' :min="0")
            button.button__increase(@click="nowPrice++")
          //- button.button(@click="getNowPrice") 現
        li
          label.title 口數
          .number-input
            button.button__decrease(@click="changeSubmitNum('-')")
            input(type="text" v-model='submitNum' :min="0")
            button.button__increase(@click="changeSubmitNum('+')")
        li.button-group
          button.button__danger(@click="checkOrder(0)") 多單
          button.button__success(@click="checkOrder(1)") 空單
</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'
import Chart from "~/components/Chart"

export default {
  data () {
    return {
      selectItemId: '',
      sendText: '',
      nowPrice: 0,
      dialogVisible: false,
      orderConfirm: false,
      customGroup: [],
      confirmData: [],
      radioA: '0',
      buyType: '0',
      profit: 0,
      damage: 0,
      submitNum: 1,
      submitStep: 1,
      defaultQuantity: 1,
      orderMode: 1,
      showContentType: 1,
      checkList: ['下單不確認'],
      defaultAllSubmit: [1, 2, 3, 4, 5],
      customSubmitNums: [],
    };
  },
  computed: mapState({
    clickItemId: 'clickItemId',
    nowMainItem: 'nowMainItem',
    mainItem: 'mainItem',
    commidyArray: 'commidyArray',
  }),
  components: {
    Chart,
  },
  watch: {
    selectItemId(id) {
      let name = ''
      //找出名稱
      this.$store.state.mainItem.forEach(function(val) {
        if (val.product_id == id) {
          name = val.product_name
        }
      })

      this.$store.commit('setClickItemId', {
        id: id,
        name: name
      })
    },
    commidyArray() {
      this.getNowOverall()
    },
    clickItemId(itemId) {
      this.getNowPrice()
      this.getNowOverall()
    },
    customGroup(data) {
      this.$cookies.set('customGroup', this.customGroup)

      //修改收盤全平
      let overall = 0

      this.customGroup.forEach(function(val){
        if (val == 'overall') {
          overall = 1
        }
      })

      this.$store.dispatch('CALL_SET_CLOSE_OVER_ALL', { overall })
      this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
    },
    submitNum(newNum, oldNum) {
      if (newNum == 0 && oldNum == 1) {
        this.submitNum = 0.9
        this.submitStep = 0.1
      }

      if (newNum == 1.1 && oldNum == 1) {
        this.submitNum = 2
        this.submitStep = 1
      }

      if (newNum < 0) {
        this.submitNum = 0
      }
    }
  },
  mounted() {
    const customSubmitNums = this.$cookies.get('customSubmitNums')
    const customGroup = this.$cookies.get('customGroup')
    const orderMode = this.$store.state.localStorage.customSetting.orderMode
    const defaultQuantity = this.$store.state.localStorage.customSetting.defaultQuantity

    let _this = this

    if (typeof customSubmitNums == 'undefined') {
      this.customSubmitNums = this.defaultAllSubmit
    } else {
      this.customSubmitNums = customSubmitNums
    }

    if (typeof customGroup != 'undefined') {
      this.customGroup = customGroup
    }

    //目前選擇商品
    this.selectItemId = this.$store.state.clickItemId
    this.getNowPrice()

    if (typeof orderMode != 'undefined') {
      this.orderMode = orderMode
    }

    //預設口數
    if (typeof defaultQuantity != 'undefined') {
      this.submitNum = defaultQuantity
    }
  },
  methods: {
    changeSubmitNum(type) {
      if (type == '+') {
        this.submitNum = parseFloat((this.submitNum + this.submitStep).toFixed(10))
      } else {
        this.submitNum = parseFloat((this.submitNum - this.submitStep).toFixed(10))
      }
    },
    getNowOverall() {
      //使用者設定
      const commidyArray = this.$store.state.commidyArray
      const clickItem = this.$store.state.clickItemId
      let newCustomGroup = []
      let dayCover = ''

      commidyArray.forEach(function(val) {
        if (val.ID == clickItem) {
          dayCover = val.DayCover
        }
      })

      let has = false

      this.customGroup.forEach(function(val) {
        if (val == 'overall') {
          has = true

          if (dayCover == '1') {
            newCustomGroup.push(val)
          }
        } else {
          newCustomGroup.push(val)
        }
      })

      if (!has && dayCover == '1') {
        newCustomGroup.push('overall')
      }

      this.customGroup = newCustomGroup
    },
    getNowPrice() {
      const itemId = this.$store.state.clickItemId
      const nowNewPrice = this.$store.state.nowNewPrice

      this.nowPrice = nowNewPrice[itemId]
    },
    setNum() {
      //set cookie
      this.$cookies.set('customSubmitNums', this.customSubmitNums)
      this.dialogVisible = false
    },
    resetNum() {
      this.customSubmitNums = this.defaultAllSubmit
      this.$cookies.set('customSubmitNums', this.defaultAllSubmit)
    },
    checkOrderAll() {
      //看是否有勾選下單不確認
      let noConfirm = false
      const clickItem = this.$store.state.clickItemId
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token

      let sendText = 't:' + userId + ',0,' + token + ',' + isMobile + ',' + clickItem

      this.customGroup.forEach(function(val){
        if (val == 'noConfirm') {
          noConfirm = true
        }
      })

      if (noConfirm) {
        //全平
        this.$socketOrder.send(sendText)
      } else {
        //確認
        this.$confirm('確認要全平 (' + this.$store.state.itemName + ') ?', '注意! ', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$socketOrder.send(sendText)
        })
      }
    },
    checkOrder(type) {
      const clickItem = this.$store.state.clickItemId
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const nowPrice = this.buyType == 1 ? this.nowPrice : 0

      this.sendText = 's:' + userId + ',' + type + ',' + this.submitNum + ',' + clickItem + ',' + this.profit + ',' + this.damage + ',' + nowPrice + ',' + this.buyType + ',' + token + ',' + isMobile

      let buyTypeName
      let typeName = type == 1 ? '空' : '多'

      if (this.buyType == 0) {
        buyTypeName = '市價單'
      } else if (this.buyType == 1) {
        buyTypeName = '限價單'
      } else if (this.buyType == 2) {
        buyTypeName = '收盤單'
      }

      this.confirmData = [{
        name: this.$store.state.itemName,
        userName: this.$store.state.userInfo.Account,
        buy: typeName,
        price: buyTypeName,
        submit: this.submitNum,
      }]

      //看是否有勾選下單不確認
      let noConfirm = false

      this.customGroup.forEach(function(val){
        if (val == 'noConfirm') {
          noConfirm = true
        }
      })

      if (noConfirm) {
        this.doOrder()
      } else {
        //確認
        this.$confirm('確認下' + typeName + ' (' + this.$store.state.itemName + ') ?', '注意! ', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doOrder()
        }).catch(() => {

        })
      }
    },
    cancel() {
      this.orderConfirm = false
    },
    doOrder() {
      const _this = this
      setTimeout(function(){ _this.$socketOrder.send(_this.sendText) }, 500)
    },
  }
}
</script>