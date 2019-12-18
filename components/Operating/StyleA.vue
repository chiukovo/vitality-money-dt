<template lang='pug'>
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
        el-input-number(v-model='nowPrice' style="width: calc(100% - 52px)" :min="0" :disabled="buyType != 1")
        button.button__warning(type="button") 現價
      el-form-item(label='口數:' style='margin: 2px 0;')
        el-input-number(v-model='submitNum' style="width: calc(100% - 52px)" :min="0")
        button.button__warning(type="button" @click="checkOrderAll()") 全平
  .button-operating
    button.button__danger.text__bold(@click="checkOrder(0)" v-if="buttonType == 0") 多單
    button.button__success.text__bold(@click="checkOrder(1)" v-if="buttonType == 1") 空單
  el-dialog(
    :visible.sync='orderConfirm'
    :modal='false'
    width="400px"
    title='確認下單'
    v-dialogDrag)
    .header-custom(slot='title')
      |  確認下單
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
          button.button__light(@click="cancel") 取消
          button.button(@click="doOrder") 確認
</template>

<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      sendText: '',
      nowPrice: 0,
      itemChange: 0,
      buttonType: 0,
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
    'commidyArray',
  ]),
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
    setClickItem() {
      let name = this.getProductNameById(this.itemChange)

      this.$socket.send('f:' + this.$store.state.clickItemId)
      this.$store.commit('setClickItemId', {
        id: this.itemChange,
        name: name
      })
    },
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
        }).catch(() => {

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