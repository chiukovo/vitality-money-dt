<template lang='pug'>
.root
  //- #header
    Header
  #main
    splitpanes(class="default-theme")
      pane(size="82")
        splitpanes(horizontal)
          pane(size="41")
            Header
            MainItem
          pane(:size="$store.state.localStorage.customSetting.operatingStyle == 'C' ? '44' : 59")
            History
          pane(size="15" v-show="$store.state.localStorage.customSetting.operatingStyle == 'C'")
            StyleC
      pane(size="18")
        splitpanes(horizontal)
          pane
            ItemDetail
          pane(v-show="$store.state.localStorage.customSetting.operatingStyle != 'C'")
            StyleA(v-show="$store.state.localStorage.customSetting.operatingStyle == 'A'")
            StyleB(v-show="$store.state.localStorage.customSetting.operatingStyle == 'B'")
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
  mounted() {
    let _this = this
    this.checkLogin()
  },
  data() {
    return {
      show: 0
    }
  }
}
</script>