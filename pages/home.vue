<template lang='pug'>
.root
  //- #header
    Header
  #main
    splitpanes(class="default-theme")
      pane(size="82")
        splitpanes(horizontal)
          pane(:size="operatingStyleCheck() == 'C' ? '43' : ''")
            Header
            MainItem
          pane(:size="operatingStyleCheck('historySize')")
            History
          pane(size="12" v-show="operatingStyleCheck() == 'C'")
      pane(size="18")
        splitpanes(horizontal)
          pane(:size="operatingStyleCheck() == 'C' ? '' : '70'")
            ItemDetail
          pane(size="30")
            StyleA(v-show="operatingStyleCheck() == 'A'")
            StyleB(v-show="operatingStyleCheck() == 'B'")
  #footer
    Footer
    Sound
</template>

<script>
import { mapState } from 'vuex'
import { Splitpanes, Pane } from 'splitpanes'
import websocketService from '~/plugins/service/websocketService.js'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import UserInfo from '~/components/UserInfo'
import ItemDetail from '~/components/ItemDetail'
import MainItem from '~/components/MainItem'
import History from '~/components/History'
import Sound from "~/components/Sound"
import StyleA from '~/components/Operating/StyleA'
import StyleB from '~/components/Operating/StyleB'
import StyleC from '~/components/Operating/StyleC'
import '@/assets/sass/style.scss'
export default {
  head() {
    return {
      htmlAttrs: {
        class: this.$store.state.customStyle.htmlClass
      },
    }
  },
  components: {
    Splitpanes,
    Pane,
    Header,
    Footer,
    Sound,
    UserInfo,
    ItemDetail,
    MainItem,
    History,
    StyleA,
    StyleB,
    StyleC,
  },
  mixins: [websocketService],
  beforeMount() {
    this.checkDevice()
  },
  mounted() {
    let _this = this
    this.checkLogin()
  },
  data() {
    return {
      show: 0
    }
  },
  methods: {
    mainStyleCheck(type) {

    },
    operatingStyleCheck(type) {
      const operatingStyle = this.$store.state.localStorage.customSetting.operatingStyle

      if (type == 'historySize') {
        return operatingStyle == 'C' ? '44' : ''
      }

      return operatingStyle
    }
  }
}
</script>