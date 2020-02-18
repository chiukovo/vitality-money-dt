<template lang='pug'>
.operating-wrap
  #operatingA.operating(class="h-100")
    .operatingA-1
      .checkbox-group
        label.checkbox.inline
          input.checkbox__input(type="checkbox")
          span.checkbox__label 鎖定商品
        label.checkbox.inline
          input.checkbox__input(v-model="customGroup" type="checkbox" value="noConfirm")
          span.checkbox__label 下單不確認
      .change-theme
        button.button__white(@click="changeOperating('B')") B
        button.button__white(@click="changeOperating('C')") C
    .operatingA-2
      el-form(size='mini' label-width='50px')
        el-form-item(label='商品')
          select(v-model="itemChange" @change="setClickItem")
            option(v-for="item in $store.state.customItemSetting" v-if="item.show" :value="item.id") {{ item.name }}
    .operatingA-3
      el-form(size='mini' label-width='50px')
        el-form-item(label='買賣')
          label.checkbox.inline(style="color: #dc3545; font-size: 16px;")
            input.radio__input(type="radio" v-model='buttonType' value='0')
            span.checkbox__label 多單
          label.checkbox.inline(style="color: #28a745; font-size: 16px;")
            input.radio__input(type="radio" v-model='buttonType' value='1')
            span.checkbox__label 空單
    .operatingA-4
      label.radio.inline
        input.radio__input(type="radio" v-model='buyType' value='0')
        span.radio__label 市價單
      label.radio.inline
        input.radio__input(type="radio" v-model='buyType' value='2')
        span.radio__label 收盤單
      label.radio.inline
        input.radio__input(type="radio" v-model='buyType' value='1')
        span.radio__label 限價單
    .operatingA-5
      el-form(ref='form' size='small' label-width='50px')
        el-form-item(label='限價:')
          .number-input(:class="buyType != 1 ? 'disabled' : ''")
            button.button__increase(type="button" @click="addLimitPoint('--')")
            input(type="text" v-model='nowPrice' :min="0" :disabled="buyType != 1")
            button.button__decrease(type="button" @click="addLimitPoint('++')")
          button.button__warning(type="button" @click="getNowPrice") 現價
        el-form-item(label='口數:' style='margin: 2px 0;')
          .number-input
            button.button__increase(type="button" @click="changeSubmitNum('-')")
            input(type="text" v-model='submitNum' :min="0")
            button.button__decrease(type="button" @click="changeSubmitNum('+')")
          button.button__warning(type="button" @click="checkOrderAll()") 全平
    .button-operating
      button.button__danger.text__bold(@click="checkOrder(0)" v-if="buttonType == 0") 多單
      button.button__success.text__bold(@click="checkOrder(1)" v-if="buttonType == 1") 空單
    el-dialog(
      :visible.sync='orderConfirm'
      :modal='false'
      v-dialogDrag
      width="400px"
      title='確認下單')
      .header-custom(slot='title')
        |  確認下單
      .m-10
        table.custom__table.general
          thead
            tr
              th 目標商品
              th 用戶名稱
              th 買賣
              th 價格
              th 口數
          tbody
            tr(v-for="row in confirmData")
              td {{ row.name }}
              td {{ row.userName }}
              td
                span(:class="row.buy == 0 ? 'bg_danger' : 'bg_success'" class="text__white") {{ row.buy == 0 ? '多' : '空' }}
              td {{ row.price }}
              td {{ row.submit }}
            tr(class="non-data" v-if="confirmData.length == 0")
              td 無資料
      .dialog__footer
        button.button.button__light(@click="cancel") 取消
        button.button(@click="doOrder") 確認
  OverAllConfirm(v-if="overAllConfirm" @closeOverAllConfirm="overAllConfirm = false")
</template>

<script>

import { mapState } from 'vuex'
import OverAllConfirm from "~/components/Operating/OverAllConfirm"

export default {
  data () {
    return {
      sendText: '',
      nowPrice: 0,
      itemChange: 0,
      buttonType: 0,
      overAllConfirm: false,
      dialogVisible: false,
      orderConfirm: false,
      customGroup: [],
      confirmData: [],
      radioA: '0',
      buyType: '0',
      dayCover: 0,
      profit: 0,
      damage: 0,
      submitNum: 1,
      submitStep: 1,
      checkList: ['下單不確認'],
      defaultAllSubmit: [1, 2, 3, 4, 5],
      customSubmitNums: []
    };
  },
  computed: mapState([
    'clickItemId',
    'commidyArray',
  ]),
  components: {
    OverAllConfirm,
  },
  watch: {
    commidyArray() {
      this.getNowOverall()
    },
    itemChange(itemId) {
      let target = this.findMainItemById(itemId)
      let name = ''

      if (typeof target != 'undefined') {
        name = target.product_name
      }

      this.preSetClickItemId(itemId, name)
    },
    clickItemId(itemId) {
      this.itemChange = itemId
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

      //最小為零
      if (this.submitNum < 0) {
        this.submitNum = 0
      }
    }
  },
  mounted() {
    const customSubmitNums = this.$cookies.get('customSubmitNums')
    const customGroup = this.$cookies.get('customGroup')

    if (typeof customSubmitNums == 'undefined') {
      this.customSubmitNums = this.defaultAllSubmit
    } else {
      this.customSubmitNums = customSubmitNums
    }

    if (typeof customGroup != 'undefined') {
      this.customGroup = customGroup
    }
  },
  methods: {
    addLimitPoint(type) {
      if (this.buyType != 1) {
        return
      }

      if (type == '++') {
        this.nowPrice++
      } else if (type == '--') {
        this.nowPrice--
      }
    },
    changeSubmitNum(type) {
      if (type == '+') {
        this.submitNum = parseFloat((this.submitNum + this.submitStep).toFixed(10))
      } else {
        this.submitNum = parseFloat((this.submitNum - this.submitStep).toFixed(10))
      }
    },
    setClickItem() {
      let name = this.getProductNameById(this.itemChange)

      this.preSetClickItemId(this.itemChange, name)
    },
    setCustomSetting(type) {
      this.$store.commit('setCustomSetting', type)
    },
    getNowOverall() {
      //使用者設定
      const _this = this
      const commidyArray = this.commidyArray
      const clickItemId = this.clickItemId

      commidyArray.forEach(function(val) {
        if (val.ID == clickItemId) {
          _this.dayCover = val.DayCover
          _this.noRemaining = val.NoRemaining
        }
      })
    },
    getNowPrice() {
      const itemId = this.clickItemId
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
      this.submitNum = 1
      this.submitStep = 1
    },
    checkOrderAll() {
      this.overAllConfirm = true
    },
    checkOrder(type) {
      const clickItem = this.$store.state.clickItemId
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const nowPrice = this.buyType == 1 ? this.nowPrice : 0

      this.sendText = 's:' + userId + ',' + type + ',' + this.submitNum + ',' + clickItem + ',' + this.profit + ',' + this.damage + ',' + nowPrice + ',' + this.buyType + ',' + token + ',' + isMobile

      let buyTypeName

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
        buy: type,
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
        this.orderConfirm = true
        this.computedTableContent()
      }
    },
    cancel() {
      this.orderConfirm = false
    },
    doOrder() {
      this.orderConfirm = false

      this.$socketOrder.send(this.sendText)
    },
  }
}
</script>