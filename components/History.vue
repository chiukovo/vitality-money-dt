<template lang='pug'>
.history
  .history-header
    .history-tabs.tabs-nav
      #tab-item.tabs__item(@click='handleHistoryTabs(1)' :class="{'is-active' : historyTabShow == 1}") k線圖
      #tab-item.tabs__item(@click='handleHistoryTabs(2)' :class="{'is-active' : historyTabShow == 2}") 走勢圖
      #tab-item.tabs__item(@click='handleHistoryTabs(3)' :class="{'is-active' : historyTabShow == 3}") 全部單({{ $store.state.buySell.length }})
      #tab-item.tabs__item(@click='handleHistoryTabs(4)' :class="{'is-active' : historyTabShow == 4}") 未平倉單 ({{ $store.state.unCoverBuySum }},{{ $store.state.unCoverSellSum }})
      #tab-item.tabs__item(@click='handleHistoryTabs(5)' :class="{'is-active' : historyTabShow == 5}") 已平倉
      #tab-item.tabs__item(@click='handleHistoryTabs(6)' :class="{'is-active' : historyTabShow == 6}") 統計
  Kchart(v-show='historyTabShow == 1')
  Chart(v-show='historyTabShow == 2')
  AllList(v-show='historyTabShow == 3')
  .history-content(v-show='historyTabShow == 4')
  .history-content(v-show="historyTabShow == 5")
  .history-content(v-show="historyTabShow == 6")
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'
import AllList from "~/components/BetList/AllList"
import Kchart from "~/components/Kchart"
import Chart from "~/components/Chart"

export default {
  data() {
    return {
      historyTabShow: 1,
      height: {
        buySell: '',
        uncovered: '',
        covered: '',
        commodity: '',
      },
    }
  },
  computed: mapState([
    'clickItemId',
  ]),
  mounted() {
    //this.computedHeight()
  },
  components: {
    AllList,
    Kchart,
    Chart,
  },
  watch: {
    historyTabShow() {
      //window.setTimeout((() => this.computedHeight() ), 100)
    },
    clickItemId(id) {
      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'minone',
        'num': 1
      })

      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'kline',
        'num': 2
      })
    }
  },
  methods: {
    computedHeight() {
      const buySellHeader = document.getElementById('buySellHeader').offsetHeight
      const uncoveredHeader = document.getElementById('uncoveredHeader').offsetHeight
      const coveredHeader = document.getElementById('coveredHeader').offsetHeight
      const commodityHeader = document.getElementById('commodityHeader').offsetHeight

      this.height = {
        buySell: 'calc(100% - ' + buySellHeader + 'px)',
        uncovered: 'calc(100% - ' + uncoveredHeader + 'px)',
        covered: 'calc(100% - ' + coveredHeader + 'px)',
        commodity: 'calc(100% - ' + commodityHeader + 'px)',
      }
    },
    handleHistoryTabs(e) {
			this.historyTabShow = e
		},
  }
}
</script>