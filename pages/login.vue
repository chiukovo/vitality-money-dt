<template lang='pug'>
.login
  .login-wrap
    .login-box
      .login__header DT888
      .login__form
        el-form(label-width='0')
          el-form-item(label='線路')
            el-select(placeholder='伺服器' v-model='server' style='width: 100%;')
              el-option(label='1-伺服器' value='server1')
          el-form-item(label='帳號')
            el-input(v-model='account' placeholder='帳號')
          el-form-item(label='密碼')
            el-input(v-model='password' type='password' placeholder='密碼')
          el-form-item
            el-checkbox(v-model="rememberMe") 記住我
          el-form-item
            el-button(type='primary' native-type="submit" @click.native.prevent="doLogin") 登入
          .login-txt
            .left 舊版
            .right 版本7.07
      .login__footer
        a(href="#") 軟體使用條款
  .root
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
import axios from 'axios'
import qs from 'qs'
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
        class: 'dt default'
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
  beforeMount() {
    this.checkDevice()
  },
  mounted() {
    let _this = this

    //remember data
    const remember = this.$store.state.localStorage.remember
    this.rememberMe = remember.me

    if (this.rememberMe) {
      this.account = remember.account
      this.password = remember.password
    }
  },
  data() {
    return {
      show: 0,
      loading: false,
      account: '',
      password: '',
      rememberMe: '',
      server: 'server1',
    }
  },
  methods: {
    async doLogin() {
      let _this = this

      if (this.account == '' || this.password == '') {
        this.$alert('帳號或密碼不得為空', '注意!')
        return
      }

      this.loading = true

      await axios.post(process.env.NUXT_ENV_API_URL + "/validation", qs.stringify({
        LoginAccount: this.account,
        LoginPassword: this.password,
        LoginMobile: 0,
      }))
      .then(response => {
        const result = response.data

        if (result['Code'] <= 0) {
          this.$alert(result['ErrorMsg'], '注意!')
          _this.loading = false
          return
        }

        if (result["Code"] == 2) {
          sessionStorage.setItem("UserAccount", result["UserAccount"]);
          sessionStorage.setItem("UserID", result["UserId"]);
          sessionStorage.setItem("ChooseID", result["ChooseId"]);
          sessionStorage.setItem("UserToken", result["Token"]);
          window.location.href = "/agent/index.php"
          return
			  }

        //記住我
        _this.$store.commit('setRemember', {
          me: _this.rememberMe,
          account: _this.account,
          password: _this.password,
        })

        //set user info
        _this.$store.commit('setuserAuth', result)
      })
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