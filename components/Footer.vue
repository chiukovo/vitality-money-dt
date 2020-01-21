<template lang='pug'>
.footer
	.row.d-flex.ustify-content-between
		#news
			marquee.news__list(onmouseover='this.stop()' onmouseout='this.start()')
				a.news__item(href='#' v-for="item in items") {{ item }}
				a.news__item(href='#' v-if="items.length == 0") 尚無任何公告
</template>


<script>

import axios from 'axios'
import qs from 'qs'

export default {
	data() {
		return {
			items: [],
		}
	},
	mounted() {
		this.announce()
	},
	methods: {
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