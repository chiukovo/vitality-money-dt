<template lang='pug'>
.page
  .main(style="overflow: auto;")
    .area
      table.table.table__mini
        thead
          tr
            th: .cell.text__center 商品
            th: .cell.text__center 成交
            th: .cell.text__center 漲跌
            th: .cell.text__center 漲幅%
            th: .cell.text__center 總量
            th: .cell.text__center 時間
            th: .cell.text__center 交易
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
      table.table.table__mini(style="overflow: auto hidden; width: 100px;")
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
    .area
      //- 五檔揭示
      //- 賣
      table
        tbody
          tr(v-for="(val, key) in $store.state.items0" v-if="key <= 5")
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
                .progress-bar__inner(:style="'width: ' + $store.state.fiveTotal.nullNum + '%'")
          tr
            td 總買
            td {{ $store.state.fiveTotal.more }}
            td(style='width:20%'): .cell
              .progress-bar.progress-bar__right
                .progress-bar__inner(:style="'width: ' + $store.state.fiveTotal.more + '%'")
    .area
      //-Chart
    .area
      .area-order.area-order-theme2
        table
          tbody
            tr
              td(colspan="3")
                label.title 商品
                .order__select
                  select(v-model='selectItemId')
                    option(v-for="item in mainItem" :value='item.product_id') {{ item.product_name }}
            tr
              td
                label.radio
                  input.radio__input(type="radio" v-model='buyType' value='0')
                  span.radio__label 市價
              td
                label.radio
                  input.radio__input(type="radio" v-model='buyType' value='2')
                  span.radio__label 收盤單
              td
                label.radio
                  input.radio__input(type="radio" v-model='buyType' value='1')
                  span.radio__label 限價
            tr
              td(colspan="3")
                label.title 限價
                .number-input
                  button.button__decrease(@click="nowPrice--")
                  input(type="text" v-model='nowPrice' :min="0")
                  button.button__increase(@click="nowPrice++")
            tr
              td
                button.button__danger(@click="checkOrder(0)") 多單
              td
                label.title 口數
                .number-input
                  button.button__decrease(@click="submitNum--")
                  input(type="text" v-model='submitNum' :min="0")
                  button.button__increase(@click="submitNum++")
              td
                button.button__success(@click="checkOrder(1)") 空單
      //- ul.area-order.area-order-theme1
        li
          label.title 商品
          .order__select
            select
              option 黃豆
        li
          label.radio.inline
            input.radio__input(type="radio" v-model='buyType' value='0')
            span.radio__label 市價
          label.radio.inline
            input.radio__input(type="radio" v-model='buyType' value='2')
            span.radio__label 收盤單
          //- label.radio.inline
            span.radio__label 限價單
            input.radio__input(type="radio" v-model='buyType' value='1')
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
            button.button__decrease(@click="submitNum--")
            input(type="text" v-model='submitNum' :min="0")
            button.button__increase(@click="submitNum++")
        li.button-group
          button.button__danger(@click="checkOrder(0)") 多單
          button.button__success(@click="checkOrder(1)") 空單
</template>

<script>

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
      checkList: ['下單不確認'],
      defaultAllSubmit: [1, 2, 3, 4, 5],
      customSubmitNums: []
    };
  },
  computed: mapState([
    'clickItemId',
    'nowMainItem',
    'mainItem',
    'commidyArray',
  ]),
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
    }
  },
  mounted() {
    const customSubmitNums = this.$cookies.get('customSubmitNums')
    const customGroup = this.$cookies.get('customGroup')
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
  },
  methods: {
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