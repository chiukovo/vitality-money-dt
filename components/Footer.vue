<template lang='pug'>
.footer
	#news
		marquee.news__list(onmouseover='this.stop()' onmouseout='this.start()')
			a.news__item(href='#' v-for="item in items" @click="openModal('news', '公告總攬')") {{ item }}
			a.news__item(href='#' v-if="items.length == 0" @click="openModal('news', '公告總攬')") 尚無任何公告
	ul#infor
		li {{ $store.state.itemName }}
		li 最後交易日: {{ nowMainItem.end_date }}
		li 禁新:
			span.text__success {{ nowMainItem.new_point1 }}
			|,
			span.text__danger {{ nowMainItem.new_point2 }}
		li 強平:
			span.text__success {{ nowMainItem.cover_point1 }}
			|,
			span.text__danger {{ nowMainItem.cover_point2 }}
	Dialog(
		:click-type="dialog.clickType",
		:visible.sync="dialog.isOpen"
		:title="dialog.title"
		:size="dialog.size"
		v-if="dialog.isOpen")
</template>

<script>

import axios from 'axios'
import qs from 'qs'
import { mapState } from 'vuex'
import Dialog from "~/components/Dialog"

export default {
	data() {
		return {
			dialog: {
        clickType: '',
        isOpen: false,
        title: '',
        size: '',
      },
			items: [],
			targetItem: {}
		}
	},
	computed: mapState({
	  nowMainItem: 'nowMainItem',
	}),
	mounted() {
		this.announce()
	},
	watch: {
	},
	components: {
    Dialog,
  },
	methods: {
		openModal(type, title, size) {
      this.dialog.size = ''
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true

      if (typeof size != 'undefined') {
        this.dialog.size = size
      }
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