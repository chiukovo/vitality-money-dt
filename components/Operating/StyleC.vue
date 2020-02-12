<template lang='pug'>
#operatingC.operating
  .operating-header
    .header__title {{ $store.state.itemName }}
    .header__mode
      label.select
        select
          option 一般
  .change-theme
    button.button__white(@click="changeOperating('A')") A
    button.button__white(@click="changeOperating('B')") B
  .operating-content
    .operating-1
      table
        tbody
          tr
            td
              label.radio
                input.radio__input(type="radio" v-model='buyType' value='0')
                span.radio__label 市價單
          tr
            td
              label.radio
                input.radio__input(type="radio" v-model='buyType' value='2')
                span.radio__label 收盤單
          tr
            td
              label.radio
                input.radio__input(type="radio" v-model='buyType' value='1')
                span.radio__label 限價單
    .operating-2
      el-form(ref='form' size='mini' label-width='70px')
        el-form-item(label='限價:')
          button.nowPrice.button__warning(type="button") 現價
          el-input-number(v-model='nowPrice' :min="0" :disabled="buyType != 1")
        el-form-item(label='獲利點:')
          el-input-number(v-model='profit' :min="0")
        el-form-item(label='損失點:')
          el-input-number(v-model='damage' :min="0")
    .operating-3
      .numberbtn
        el-form(ref='form' size='mini' label-width='30px')
          button.button__white(type="button" v-for="(customSubmitNum, key) in customSubmitNums" :key="key" @click="submitNum = customSubmitNum") {{ customSubmitNum }}
          button.button__white.button__set(@click="dialogVisible = true" type="button") 設
      .numberinput
        el-form(ref='form' size='mini' label-width='50px')
          el-form-item(label='口數:' style='margin: 6px 0;')
            el-input-number(v-model='submitNum' :min="0" :step="submitStep")
        .badge.badge-warning 損失點/ 獲利點 為
          span.badge-rr 點數
          |設定
      .editbtn
        el-dialog(
          :visible.sync='dialogVisible'
          :modal='false'
          width="400px"
          title='口數快捷設定')
            .header-custom(slot='title') 口數快捷設定
            template
              .dialog__body
                .numberBtn-wrap
                  .numberBtn-box(v-for="(customSubmitNum, key) in customSubmitNums" :key="key")
                    el-input-number(size="mini" controls-position='right' v-model="customSubmitNums[key]" :min="0")
              .dialog__footer
                button.button.button__light(@click="dialogVisible = false") 取消
                button.button(@click="setNum") 送出
    .operating-4
        button.button__danger.button__lg.text__bold(@click="checkOrder(0)") 多單
        button.button__warning(@click="checkOrderAll()") 全平
        button.button__success.button__lg.text__bold(@click="checkOrder(1)") 空單
        el-dialog(
          :visible.sync='orderConfirm'
          :modal='false'
          width="500px"
          title='確認下單')
          .header-custom(slot='title')
            |  確認下單
          .m-10
            table.custom__table.general
              thead.thead
                tr
                  th 目標商品
                  th 用戶名稱
                  th 買賣
                  th 價格
                  th 口數
              tbody.tbody
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
    .operating-5
      label.checkbox
        input.checkbox__input(type="checkbox" :checked="noRemaining == 1" @click="setNoRemaining")
        span.checkbox__label 不留倉
      label.checkbox
        input.checkbox__input(v-model="customGroup" type="checkbox" value="noConfirm")
        span.checkbox__label 下單不確認
      label.checkbox
        input.checkbox__input(type="checkbox" @click="setCustomSetting('orderReport')" :checked="$store.state.localStorage.customSetting.orderReport")
        span.checkbox__label 成交回報
      label.checkbox
        input.checkbox__input(type="checkbox" :checked="dayCover == 1" @click="clickOverAll()")
        span.checkbox__label 全平 + 取消委託
  OverAllConfirm(v-if="overAllConfirm" @closeOverAllConfirm="overAllConfirm = false")
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'
import OverAllConfirm from "~/components/Operating/OverAllConfirm"

export default {
  data () {
    return {
      sendText: '',
      nowPrice: 0,
      overAllConfirm: false,
      dialogVisible: false,
      orderConfirm: false,
      customGroup: [],
      confirmData: [],
      radioA: '0',
      buyType: '0',
      noRemaining: 0,
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
    'userInfo',
  ]),
  components: {
    OverAllConfirm,
  },
  watch: {
    commidyArray() {
      this.getNowOverall()
    },
    clickItemId(itemId) {
      this.getNowPrice(itemId)
      this.getNowOverall()
    },
    customGroup(data) {
      this.$cookies.set('customGroup', this.customGroup)
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
    setNoRemaining() {
      //設定不留倉
      const _this = this
      const lang = this.$store.state.localStorage.lang
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const setNoRemaining = this.noRemaining == 0 ? 1 : 0

      axios.post(process.env.NUXT_ENV_API_URL + "/set_close_cover_all?lang=" + lang, qs.stringify({
        UserID: userId,
        Token: token,
        SetNoRemaining: setNoRemaining,
        SetCloseCommodity: _this.clickItemId,
      }))
      .then(response => {
        if (response.data.Code != 1) {
          _this.$alert(response.data.ErrorMsg)
        }

        this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
      })
    },
    clickOverAll() {
      //修改收盤全平
      const _this = this
      _this.dayCover = _this.dayCover == 0 ? 1 : 0
      const lang = this.$store.state.localStorage.lang
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token

      //確認視窗
      const confirmText = _this.dayCover ? '確認勾選(全平 + 取消委託)?' : '確認取消勾選(全平 + 取消委託)?'
      this.$confirm(confirmText, '注意! ', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(process.env.NUXT_ENV_API_URL + "/set_close_cover_all?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          SetCloseCover: _this.dayCover,
          SetCloseCommodity: _this.clickItemId,
        }))
        .then(response => {
          if (response.data.Code != 1) {
            _this.$alert(response.data.ErrorMsg)
            _this.dayCover = !_this.dayCover
          }

          this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
          this.$store.dispatch('CALL_MEMBER_INFO')
        }).catch(() => {
        })
      }).catch(() => {
        _this.dayCover = !_this.dayCover
      })
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
      console.log(type)
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
        profit: this.profit,
        damage: this.damage,
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