<template lang="pug">
#header
  .header-userInfo(:class="userInfoHeaderShow ? 'isOpen' : ''")
    UserInfoHeader
  .header
    .header__left
      button.button.header-button.logout(@click="logout") 登出
    .header__title {{userInfo.Account}}
    .header__right
      button.button.header-button.header-dropmenu(@click="userInfoHeaderShow = !userInfoHeaderShow")
        span $
        .text__danger {{userInfo.Money}}
</template>

<script>

import UserInfoHeader from "~/components/mobile/UserInfoHeader"
import { mapState } from 'vuex'

export default {
	data () {
	  return {
      userInfoHeaderShow: false,
	  }
	},
  components: {
    UserInfoHeader,
  },
  computed: mapState([
    'userInfo'
  ]),
  methods: {
  }
}
</script>