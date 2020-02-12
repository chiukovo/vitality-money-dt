<template lang='pug'>
.dialog
  .dialog__content(style="padding: 10px;")
    //-可選商品
    table.customItems
      tbody
        tr
          td(width="160px")
            div 可選商品
            select(id="canSelect" multiple v-model="canSelectIds")
              option(v-for="(item, key) in canSelectItems" :value="item.id") {{ item.name }}
          td
            .button-group
              button(@click="add") 增加»
              button(@click="remove") «移除
          td(width="160px")
            div 已選商品
            select(id="selected" multiple v-model="selectedIds")
              option(v-for="(item, key) in selectedItems" :value="item.id") {{ item.name }}
          td
            .button-group
              button(@click="doOrder('up')") ^
              button(@click="doOrder('down')") v
  .dialog__footer
    button.button_light(@click="cancel") 取消
    button.button(type='primary' @click="submit") 確認
</template>
<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      selectedItems: [],
      selectedIds: [],
      canSelectItems: [],
      canSelectIds: [],
    }
  },
  mounted() {
    let _this = this
    let customItemSetting = _this.$store.state.customItemSetting
    customItemSetting = JSON.parse(JSON.stringify(customItemSetting))

    customItemSetting.forEach(function(val) {
      //TSLQ 一定會顯示
      if (val.id != 'TSLQ') {
        if (val.show) {
          _this.selectedItems.push(val)
        } else {
          _this.canSelectItems.push(val)
        }
      }
    })
  },
  methods: {
    add() {
      const _this = this
      const items = JSON.parse(JSON.stringify(this.canSelectItems))

      items.forEach(function(val) {
        _this.canSelectIds.forEach(function(id) {
          if (val.id == id) {
            _this.selectedItems.push(val)
            _this.canSelectItems.forEach(function(data, key) {
              if (data.id == id) {
                _this.$delete(_this.canSelectItems, key)
              }
            })
          }
        })
      })
    },
    remove() {
      const _this = this
      const items = JSON.parse(JSON.stringify(this.selectedItems))

      items.forEach(function(val) {
        _this.selectedIds.forEach(function(id) {
          if (val.id == id) {
            _this.canSelectItems.push(val)
            _this.selectedItems.forEach(function(data, key) {
              if (data.id == id) {
                _this.$delete(_this.selectedItems, key)
              }
            })
          }
        })
      })
    },
    doOrder(type) {
      let newItems = []

      if (type == 'up') {
        for (let i = 0; i < this.selectedIds.length; i++) {
          let index = this.selectedItems.map(item => {
            return item.id
          }).indexOf(this.selectedIds[i]);
          if (index <= 0) return
          this.selectedItems[index] = this.selectedItems.splice(index - 1, 1, this.selectedItems[index])[0]
        }
      } else {
        for (var i = this.selectedIds.length - 1; i >= 0; i--) {
          let index = this.selectedItems.map(item => {
            return item.id
          }).indexOf(this.selectedIds[i])
          if (index >= this.selectedItems.length - 1) return
          this.selectedItems[index] = this.selectedItems.splice(index + 1, 1, this.selectedItems[index])[0]
        }
      }
    },
    async submit() {
      let _this = this
      let result = []

      _this.selectedItems.forEach(function(val) {
        val.show = true
        result.push(val)
      })

      _this.canSelectItems.forEach(function(val) {
        val.show = false
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
  }
}
</script>