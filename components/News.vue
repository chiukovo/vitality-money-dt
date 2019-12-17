<template lang='pug'>
.news
  ul.news-data-list(v-if="items.length > 0")
    li(v-for="item in items")
      .news-data__title 內容
      .news-data__infor {{ item }}
  ul.news-data-list(v-else)
    li
      .news-data__title 內容
      .news-data__infor 暫無公告

</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      systemShow: 0,
      items: [],
    };
  },
  computed: mapState([
    'userInfo',
  ]),
  mounted() {
    this.announce()
  },
  methods: {
    handleSystem(e) {
      this.systemShow = e
    },
    async announce() {
      const _this = this
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const lang = this.$store.state.localStorage.lang

      await axios.post(process.env.NUXT_ENV_API_URL + "/query_announce?lang=" + lang, qs.stringify({
        UserID: userId,
        Token: token,
      }))
      .then(response => {
        const result = response.data

        if (result.Code > 0) {
          _this.items = result.AnnounceList
        }
      })
    }
  }
}
</script>