<template lang='pug'>
.index
	.main
		.mainbox
			.left
				.logo-wrap
					.title-wrap
						.logo
						.title DT888.CO
						.small DayTrader
				ul.menu
					li.menu01(@click="goLogin()") HTML5 網頁登入
					li.menu02 程式版下載
					li.menu03 手機版
					li.menu04 遠端下載
					li.menu05 租用平臺
			.content
				.cnt1
				.cnt2
					.txt
						.cnt-title DT888
						P 提供技術派玩家一目了然的操盤旗艦級版本
						P 各種圖表分析工具 多指標 多週期 多視窗
						P 善意設計界面 提供玩家舒適省心 能讓長時間的操盤者保持你的專注力分析力
						P 高效能的操作介面 團隊秉持提供高運作效能以及靈活流暢度是程式開發團隊的誠意 玩家在不斷的透過眼球與大腦的高速資訊交換及運算出結果能及時取得資料及發揮最快速的應變指令
						P 多種的功能在各版等待玩家慢慢探索
					.img-group
						.img.img01
						.img.img02
</template>

<script>

import axios from 'axios'
import qs from 'qs'
import '@/assets/sass/style.scss'

export default {
	head() {
	  return {
	    htmlAttrs: {
	       class: this.$store.state.customStyle.htmlClass + ' login'
	    }
	  }
	},
	data() {
	  return {
	  }
	},
	beforeMount() {
		this.checkDevice()
	},
	mounted() {

	},
	methods: {
		goLogin() {
			location.href = "/login"
		}
	},
}
</script>