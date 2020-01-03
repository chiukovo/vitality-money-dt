<template lang='pug'>
.root
  #main
    splitpanes(class="default-theme")
      pane(:size="getSize('left')")
        splitpanes(horizontal @resize="onResize($event)")
          pane(:size="getSize('mid')")
            Header
            MainItem(v-if="pageStyle != 4")
            History(v-if="pageStyle == 4")
          pane(:size="getSize('history')")
            MainItem(v-if="pageStyle == 4 || pageStyle == 5")
            History(v-if="pageStyle != 4 && pageStyle != 5" :reSize="reSize")
          pane(:size="getSize('C')" v-show="style == 'C'")
            StyleC
      pane(:size="getSize('right')")
        splitpanes(horizontal @resize="onResize($event)")
          pane(:size="getSize('itemDetail')")
            ItemDetail
          pane(:size="getSize('ab')")
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
    mainStyle: state => state.localStorage.customSetting.mainStyle,
  }),
  mixins: [websocketService],
  beforeMount() {
    this.checkDevice()
  },
  mounted() {
    let _this = this
    this.style = this.$store.state.localStorage.customSetting.operatingStyle
    this.pageStyle = this.$store.state.localStorage.customSetting.mainStyle
    this.checkLogin()
  },
  data() {
    return {
      show: 0,
      style: '',
      pageStyle: '',
      reSize: ''
    }
  },
  watch: {
    mainStyle(style) {
      this.pageStyle = style
    },
    operatingStyle(style) {
      this.style = style
    },
  },
  methods: {
    onResize(event) {
      this.reSize = event[1].size
    },
    getSize(type) {
      if (type == 'mid') {
        if (this.pageStyle == 2 || this.pageStyle == 3 || this.pageStyle == 5) {
          return '4.6'
        }

        return this.style == 'C' ? '44' : '45'
      }

      if (type == 'history') {
        if (this.pageStyle == 2 || this.pageStyle == 3 || this.pageStyle == 5) {
          return '95.4'
        }

        return this.style == 'C' ? '56' : '55'
      }

      if (type == 'itemDetail') {
        return this.style == 'C' ? '100' : '65'
      }

      if (type == 'ab') {
        return this.style == 'C' ? '0' : '35'
      }

      if (type == 'C') {
        if (this.style != 'C') {
          return 0
        }

        return '16'
      }

      if (type == 'left') {
        if (this.pageStyle == 2 || this.pageStyle == 3 || this.pageStyle == 5) {
          return '100'
        }

        return '82'
      }

      if (type == 'right') {
        if (this.pageStyle == 2) {
          return '0'
        }

        return '18'
      }
    },
    checkMainStyle(type) {

    }
  }
}
</script>