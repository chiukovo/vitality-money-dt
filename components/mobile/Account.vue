<template lang='pug'>
.page
  .main
    .area
      ul.area-account-list
        li
          .area-account-item
            img(src="~static/images/theme_dt/icon_about_mobile.png")
            .title 會員資訊
        li
          .area-account-item(@click='handleSystem(2)')
            img(src="~static/images/theme_dt/icon_edit_mobile.png")
            .title 修改密碼
        li
          .area-account-item(@click='handleSystem(3)')
            img(src="~static/images/theme_dt/icon_paper_mobile.png")
            .title 公告
        li
          .area-account-item
            img(src="~static/images/theme_dt/icon_history2_mobile.png")
            .title 帳戶歷史
        li
          .area-account-item
            img(src="~static/images/theme_dt/icon_cash_mobile.png")
            .title 儲值記錄
        li
          .area-account-item
            img(src="~static/images/theme_dt/icon_history_mobile.png")
            .title 系統規劃
        li
          .area-account-item
            img(src="~static/images/theme_dt/icon_getcash2_mobile.png")
            .title 領取試玩
        li
          .area-account-item
            img(src="~static/images/theme_dt/icon_setsymbol_mobile.png")
            .title 自訂市場
        li
          .area-account-item
            img(src="~static/images/theme_dt/icon_seticon_mobile.png")
            .title 下單模式
        li
          .area-account-item
            img(src="~static/images/theme_dt/icon_exchange_mobile.png")
            .title 貨幣
        li
          .area-account-item
            img(src="~static/images/theme_dt/icon_seticon_mobile.png")
            .title 下單匣設定
    ChangPassword(v-if='systemShow == 2')
    News(v-if='systemShow == 3')
</template>

<script>

import UserInfo from "~/components/mobile/UserInfo"
import UserDetail from "~/components/mobile/UserDetail"
import News from "~/components/mobile/News"
import Setting from "~/components/mobile/Setting"
import ChangPassword from "~/components/mobile/ChangPassword"

import { mapState } from 'vuex'

export default {
  components: {
		UserInfo,
    UserDetail,
    News,
    Setting,
    ChangPassword
	},
  data () {
    return {
      systemShow: 0,
    };
  },
  methods: {
    handleSystem(e) {
      this.systemShow = e
    }
  }
}
</script>