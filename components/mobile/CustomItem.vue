<template lang='pug'>
.main
  .area(style="padding: 10px 0;")
    span(style="margin-right: 10px") 字型({{ fontSize }})
    button.button(@click="updateFontSize('-')") -
    button.button(@click="updateFontSize('+')") +
  .area(style="padding: 10px 0 20px;")
    //-不知道這啥功能
    .CustomItem-radio
      label.radio.inline
        input.radio__input(type="radio")
        span.radio__label 簡易
      label.radio.inline
        input.radio__input(type="radio")
        span.radio__label 完整
  .area(style="height: calc(100% - 100px); overflow-y: scroll;")
    ul.area-select-list
      li(v-for="item in items"): label.checkbox
        input.checkbox__input(type="checkbox" v-model="multipleSelection" :value="item.id")
        span.checkbox__label {{ item.name }}
    .area-button-group
      button.button(@click="submit('reset')") 還原
      button.button(@click="submit") 確定
      button.button(@click="cancel") 取消
</template>
<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      items: [],
      multipleSelection: [],
      fontSize: '',
      costomFontStyle: 1,
    }
  },
  mounted() {
    let _this = this
    let customItemSetting = _this.$store.state.customItemSetting
    customItemSetting = JSON.parse(JSON.stringify(customItemSetting))

    customItemSetting.forEach(function(val) {
      _this.items.push(val)

      if (val.show) {
        _this.multipleSelection.push(val.id)
      }
    })

    this.costomFontStyle = this.fontStyle
    this.getFontSize()
  },
  computed: mapState({
    fontStyle: state => state.localStorage.customSetting.fontStyle,
  }),
  methods: {
    getFontSize() {
      let fontSize = 16

      switch(this.costomFontStyle) {
        case 0:
          fontSize = 16
          break
        case 1:
          fontSize = 18
          break
        case 2:
          fontSize = 20
          break
        case 3:
          fontSize = 22
          break
      }

      this.fontSize = fontSize
    },
    updateFontSize(type) {
      if (type == '-') {
        if (this.costomFontStyle != 0) {
          this.costomFontStyle--
        }
      } else {
        if (this.costomFontStyle != 3) {
          this.costomFontStyle++
        }
      }

      this.getFontSize()
    },
    allChecked(allChecked) {
      let _this = this
      _this.multipleSelection = []

      if (allChecked) {
        _this.multipleSelection = _this.$store.state.customItemSetting.map(function(val) {
          return val.id
        })
      }
    },
    async submit(type) {
      let _this = this
      let result = []
      const mainItem = _this.$store.state.mainItem

      //set 字形
      if (type == 'reset') {
        this.costomFontStyle = 1
      }

      _this.$store.commit('setFontStyle', this.costomFontStyle)

      _this.items.forEach(function(val) {
        let show = false
        //確認選擇
        _this.multipleSelection.forEach(function(checkVal) {
          if (val.id == checkVal) {
            show = true
          }
        })

        if (type == 'reset') {
          show = true
        }

        val.show = show
        result.push(val)
      })

      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token

      await axios.post(process.env.NUXT_ENV_API_URL + "/set_member_setting", qs.stringify({
        UserID: userId,
        Token: token,
        UserSettingData: JSON.stringify(result),
      }))
      .then(response => {
        _this.$alert("修改成功")
        location.reload()
      })
    },
    cancel() {
      //clear form
      this.$parent.handleClose()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>