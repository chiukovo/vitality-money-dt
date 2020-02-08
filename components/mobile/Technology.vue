<template lang='pug'>
.page
  .main(class="over-y-auto")
    #area_top
      .area(style="width: 100%; overflow-x: auto;")
        table.table.table__mini(style="width: 440px")
          thead
            tr
              th(width="90"): .cell.text__center 商品
              th: .cell.text__center 成交
              th: .cell.text__center 漲跌
              th(width="60"): .cell.text__center 漲幅%
              th: .cell.text__center 總量
              th: .cell.text__center 時間
              th(width="100"): .cell.text__center 交易
          tbody
            tr
              td: .cell.text__center
                select(v-model='selectItemId' @change="changeSelectId")
                  option(v-for="item in mainItem" :value='item.product_id') {{ item.product_name }}
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
    .area(style="height: calc(100% - 80px)")
      Kchart
</template>

<script>

import { mapState } from 'vuex'
import Vue from 'vue';
import Kchart from "~/components/Kchart"

export default {
  name: 'app',
  data() {
    return {
      selectItemId: '',
    }
  },
  props: ['tabShow'],
  watch: {
    clickItemId(id) {
      //目前選擇商品
      this.selectItemId = id
    },
    tabShow(type) {
      if (type == 2) {
        //目前選擇商品
        this.selectItemId = this.$store.state.clickItemId
      }
    },
  },
  mounted() {
  },
  computed: mapState([
    'mainItem',
    'nowMainItem',
    'clickItemId',
  ]),
  methods: {
    changeSelectId() {
      let id = this.selectItemId
      let name = ''
      //找出名稱
      this.mainItem.forEach(function(val) {
        if (val.product_id == id) {
          name = val.product_name
        }
      })

      this.preSetClickItemId(id, name)
    }
  },
  components: {
    Kchart,
  },
}
</script>