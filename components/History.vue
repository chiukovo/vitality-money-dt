<template lang='pug'>
//- 如果版面等於c height: calc(100% - 130px)
//- (:style="operatingStyle == 'C' ? 'height: calc(100% - 130px)' : ''")
#history.history
  .history-header
    .history-tabs.tabs-nav
      .tabs__item(@click='handleHistoryTabs(1)' :class="{'is-active' : historyTabShow == 1}") K線圖
      .tabs__item(@click='handleHistoryTabs(2)' :class="{'is-active' : historyTabShow == 2}") 走勢圖
      .tabs__item(@click='handleHistoryTabs(3)' :class="{'is-active' : historyTabShow == 3}") 全部單
        .badge.badge-danger.mybadge {{ $store.state.buySell.length }}
      .tabs__item(@click='handleHistoryTabs(4)' :class="{'is-active' : historyTabShow == 4}") 未平倉單
        .badge.badge-danger.mybadge {{ $store.state.unCoverBuySum }}
        .badge.badge-success.mybadge {{ Math.abs($store.state.unCoverSellSum) }}
      .tabs__item(@click='handleHistoryTabs(5)' :class="{'is-active' : historyTabShow == 5}") 已平倉
      .tabs__item(@click='handleHistoryTabs(6)' :class="{'is-active' : historyTabShow == 6}") 統計
      .tabs__item(@click='handleHistoryTabs(7)' :class="{'is-active' : historyTabShow == 7}")
        span(:class="blink ? 'blink' : ''") 客服
  HistoryK(v-show='historyTabShow == 1')
  HistoryC(v-show='historyTabShow == 2')
  AllList(v-if='historyTabShow == 3')
  Uncovered(v-if='historyTabShow == 4')
  Covered(v-if='historyTabShow == 5')
  Commodity(v-if='historyTabShow == 6')
  Message(v-show='historyTabShow == 7' :tabShow="historyTabShow")
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'
import AllList from "~/components/BetList/AllList"
import Uncovered from "~/components/BetList/Uncovered"
import Covered from "~/components/BetList/Covered"
import Commodity from "~/components/BetList/Commodity"
import HistoryK from "~/components/HistoryK"
import HistoryC from "~/components/HistoryC"
import Message from "~/components/Message"
//-改單用
import "@/plugins/betListPoint.js"

export default {
  data() {
    return {
      historyTabShow: 1,
      blink: false,
      height: {
        buySell: '',
        uncovered: '',
        covered: '',
        commodity: '',
        message: '',
      },
    }
  },
  computed: mapState({
    hasMessage: 'hasMessage',
    operatingStyle: state => state.localStorage.customSetting.operatingStyle,
    clickItemId: 'clickItemId'
  }),
  mounted() {
    this.computedHeight()
  },
  components: {
    AllList,
    Uncovered,
    Covered,
    HistoryK,
    HistoryC,
    Commodity,
    Message,
  },
  watch: {
    historyTabShow() {
      window.setTimeout((() => this.computedHeight() ), 100)
    },
    hasMessage(type) {
      if (this.historyTabShow != 7 && type) {
        this.blink = true
      } else {
        this.blink = false
      }

      this.$store.commit('setHasMessage', this.blink)
    },
  },
  methods: {
    computedHeight() {
      if (this.historyTabShow == 3) {
        const buySellHeader = document.getElementById('buySellHeader').offsetHeight
        this.height = {
          buySell: 'calc(100% - ' + buySellHeader + 'px)',
        }
      }

      if (this.historyTabShow == 4) {
        const uncoveredHeader = document.getElementById('uncoveredHeader').offsetHeight
        this.height = {
          uncovered: 'calc(100% - ' + uncoveredHeader + 'px)',
        }
      }

      if (this.historyTabShow == 5) {
        const coveredHeader = document.getElementById('coveredHeader').offsetHeight
        this.height = {
          covered: 'calc(100% - ' + coveredHeader + 'px)',
        }
      }

      if (this.historyTabShow == 6) {
        const commodityHeader = document.getElementById('commodityHeader').offsetHeight
        this.height = {
          commodity: 'calc(100% - ' + commodityHeader + 'px)',
        }
      }

      if (this.historyTabShow == 7) {
        const messageHeader = document.getElementById('messageHeader').offsetHeight
        this.height = {
          message: 'calc(100% - ' + messageHeader + 'px)',
        }
      }
    },
    handleHistoryTabs(e) {
      if (e == 2) {
        this.$store.dispatch('RESIZE_CHART')
      }
			this.historyTabShow = e
		},
  }
}
</script>