<template lang='pug'>
.index
	.login-wrap(v-if="loginShow == true")
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

	.main
		.mainbox
			.left
				.logo-wrap
					.title-wrap
						.logo
						.title DT888.CO
						.small DayTrader
				ul.menu
					li.menu01(@click="loginShow = !loginShow") HTML5 網頁登入
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
	.loading(v-loading='loading' v-if="loading")
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
	data () {
	  return {
			loading: true,
			loginShow: false,
			account: '',
			password: '',
			rememberMe: '',
			server: 'server1',
	  }
	},
	mounted() {
		this.loading = false

		//remember data
		const remember = this.$store.state.localStorage.remember
		this.rememberMe = remember.me

		if (this.rememberMe) {
			this.account = remember.account
			this.password = remember.password
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

			await axios.post("/api/validation", qs.stringify({
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

			  //記住我
			  _this.$store.commit('setRemember', {
			  	me: _this.rememberMe,
			  	account: _this.account,
			  	password: _this.password,
			  })

			  //set user info
			  _this.$store.commit('setuserAuth', result)
			})
		}
	},
}
</script>