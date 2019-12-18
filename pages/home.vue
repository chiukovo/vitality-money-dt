<template lang='pug'>
.root
  //- #header
    Header
  #main
    splitpanes(class="default-theme")
      pane(size="78")
        splitpanes(horizontal)
          pane(:size="style == 'C' ? '44' : '45'")
            Header
            MainItem
          pane(:size="style == 'C' ? '56' : '55'")
            History
            StyleC
      pane(size="32")
        splitpanes(horizontal)
          pane(:size="style == 'C' ? '100' : '70'")
            ItemDetail
          pane(:size="style == 'C' ? '0' : '30'")
            StyleA(v-show="style == 'A'")
            StyleB(v-show="style == 'B'")
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
  computed: mapState({
    operatingStyle: state => state.localStorage.customSetting.operatingStyle,
  }),
  mixins: [websocketService],
  beforeMount() {
    this.checkDevice()
  },
  mounted() {
    let _this = this
    this.style = this.$store.state.localStorage.customSetting.operatingStyle
    this.checkLogin()
  },
  data() {
    return {
      show: 0,
      style: ''
    }
  },
  watch: {
    operatingStyle(style) {
      this.style = style
    }
  },
  methods: {
  }
}
</script>