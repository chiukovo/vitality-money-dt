<template lang='pug'>
.operating-wrap
  #operatingB.operating(class="h-100")
    .operatingB-1
      .checkbox-group
        label.checkbox.inline
          input.checkbox__input(type="checkbox")
          span.checkbox__label 鎖定商品
        label.checkbox.inline
          input.checkbox__input(v-model="customGroup" type="checkbox" value="noConfirm")
          span.checkbox__label 下單不確認
      .change-theme
        button.button__white(@click="changeOperating('A')") A
        button.button__white(@click="changeOperating('C')") C
    .operatingB-2
      el-form(size='mini' label-width='50px')
        el-form-item(label='商品')
          select(v-model="itemChange")
            option(v-for="item in $store.state.customItemSetting" v-if="item.show" :value="item.id") {{ item.name }}
    .operatingB-3
      label.radio.inline
        input.radio__input(type="radio" v-model='buyType' value='0')
        span.radio__label 市價單
      label.radio.inline
        input.radio__input(type="radio" v-model='buyType' value='2')
        span.radio__label 收盤單
      label.radio.inline
        input.radio__input(type="radio" v-model='buyType' value='1')
        span.radio__label 限價單
    .operatingB-4
      el-form(ref='form' size='small' label-width='50px')
        el-form-item(label='限價:')
          el-input-number(v-model='nowPrice' style="width: calc(100% - 52px)" :min="0" :disabled="buyType != 1")
          button.button__warning(type="button") 現價
      .operating-3
        .numberbtn
          el-form(ref='form' size='mini' label-width='30px')
            button.button__white(type="button" v-for="(customSubmitNum, key) in customSubmitNums" :key="key" @click="submitNum = customSubmitNum") {{ customSubmitNum }}
            button.button__white.button__set(@click="dialogVisible = true" type="button") 設
        el-dialog(
          :visible.sync='dialogVisible'
          :modal='false'
          width="400px"
          title='口數快捷設定'
          v-dialogDrag)
            .header-custom(slot='title') 口數快捷設定
            template
              .dialog__body
                .numberBtn-wrap
                  .numberBtn-box(v-for="(customSubmitNum, key) in customSubmitNums" :key="key")
                    el-input-number(size="small" controls-position='right' v-model="customSubmitNums[key]" :min="0")
              .dialog__footer
                button.button.button__light(@click="dialogVisible = false") 取消
                button.button(@click="setNum") 送出
    .operatingB-5
      el-form(ref='form' size='small' label-width='50px')
        el-form-item(label='口數:' style='margin: 2px 0;')
          el-input-number(v-model='submitNum' :min="0" style="width: calc(100% - 52px)" :step="submitStep")
          button.button__warning(type="button" @click="checkOrderAll()") 全平
    .button-operating
      button.button__danger.text__bold(@click="checkOrder(0)") 多單
      button.button__success.text__bold(@click="checkOrder(1)") 空單
    el-dialog(
      :visible.sync='orderConfirm'
      :modal='false'
      width="400px"
      title='確認下單'
      v-dialogDrag)
      .header-custom(slot='title')
        |  確認下單
      .p-2
        client-only
          vxe-table(
            :data="confirmData"
            max-width="100%"
            height="200px"
            size="mini"
            border
            auto-resize)
            vxe-table-column(field="name" title='目標商品')
            vxe-table-column(field="userName" title='用戶名稱')
            vxe-table-column(field="buy" title='買賣')
            vxe-table-column(field="price" title='價格')
            vxe-table-column(field="submit" title='口數')
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
      overAllConfirm: false,
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
    clickItemId(itemId) {
      this.itemChange = itemId
      this.getNowPrice(itemId)
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
    setCustomSetting(type) {
      this.$store.commit('setCustomSetting', type)
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
    getNowPrice(itemId) {
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
        buy: type == 1 ? '空' : '多',
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