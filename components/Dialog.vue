<template lang='pug'>
  el-dialog(
      :visible.sync='visible'
      :fullscreen='dialogFullScreen'
      :before-close='handleClose'
      :close-on-click-modal='false'
      :width='diaiogSize'
      :modal='false'
      title='$store.state.itemName'
      v-dialogDrag)
    .header-custom(slot='title')
      |  {{ typeof title == 'undefined' ? $store.state.itemName : title }}
    template
      client-only
        HistoryWinLoss(v-if="clickType == 'historyWinLoss'")
        UserDetail(v-if="clickType == 'userDetail'" :onlyItem="onlyItem" :itemId="itemId")
        HistoryPrices(v-if="clickType == 'historyPrices'")
        StoredRecords(v-if="clickType == 'storedRecords'")
        ActionLog(v-if="clickType == 'actionLog'")
        ChangPassword(v-if="clickType == 'changePassword'")
        CustomItem(v-if="clickType == 'customItem'")
        ShowHideItem(v-if="clickType == 'showHideItem'")
        ShowHideItemField(v-if="clickType == 'showHideItemField'")
        News(v-if="clickType == 'news'")
        Rules(v-if="clickType == 'rules'")
        NounDescription(v-if="clickType == 'nounDescription'")
        TradingTime(v-if="clickType == 'tradingTime'")
</template>
<script>

import UserDetail from "~/components/UserDetail"
import HistoryWinLoss from "~/components/HistoryWinLoss"
import HistoryPrices from "~/components/HistoryPrices"
import StoredRecords from "~/components/StoredRecords"
import ActionLog from "~/components/ActionLog"
import ChangPassword from "~/components/ChangPassword"
import CustomItem from "~/components/CustomItem"
import ShowHideItem from "~/components/UserSetting/ShowHideItem"
import ShowHideItemField from "~/components/UserSetting/ShowHideItemField"
import News from "~/components/News"
import Rules from "~/components/Description/Rules"
import NounDescription from "~/components/Description/NounDescription"
import TradingTime from "~/components/Description/TradingTime"

export default {
  props: ['clickType', 'visible', 'title', 'size', 'onlyItem', 'itemId'],
  data () {
    return {
      dialogFullScreen: false,
      diaiogSize: '50%',
    }
  },
  components: {
    UserDetail,
    HistoryWinLoss,
    HistoryPrices,
    StoredRecords,
    ActionLog,
    ChangPassword,
    CustomItem,
    ShowHideItem,
    ShowHideItemField,
    News,
    Rules,
    NounDescription,
    TradingTime
  },
  watch: {
    visible(isOpen) {
      if (isOpen) {
        if (this.size != '' && typeof this.size != 'undefined') {
          this.diaiogSize = this.size
        } else {
          this.diaiogSize = '70%'
        }
      }
    }
  },
  methods: {
    handleClose (done) {
      this.$emit('update:visible', false)
    }
  }
}
</script>