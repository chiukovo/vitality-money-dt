<template lang='pug'>
.login-wrap
	.login-box
		.login__header
			.logo DT888
		.login__form
			el-form
				el-form-item
					el-input(v-model='account' placeholder='帳號')
				el-form-item
					el-input(v-model='password' type='password' placeholder='密碼')
				el-form-item
					.row
						.col
							el-checkbox(label='儲存帳號' v-model="rememberMe")
						.col
							el-checkbox(label='儲存密碼/自動登入' v-model="autoLogin")
				el-form-item
					el-button(type='primary' native-type="submit" @click.native.prevent="checkToLogin") 登入

	.loading(v-loading='loading' v-if="loading")
</template>

<script>

import axios from 'axios'
import qs from 'qs'
import '@/assets/sass/mobile.scss'

export default {
	head() {
	  return {
	    htmlAttrs: {
	       class: this.$store.state.customStyle.htmlClass + ' login mobile'
			},
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' }
			]
	  }
	},
	data () {
	  return {
      loading: true,
      account: '',
			password: '',
			autoLogin: false,
      rememberMe: false,
	  	server: 'server1'
	  }
	},
	beforeMount() {
		this.checkDevice()
	},
	mounted() {
		this.loading = false

		//remember data
		const remember = this.$store.state.localStorage.remember
		this.rememberMe = remember.me
		this.autoLogin = remember.autoLogin

		if (this.rememberMe) {
			this.account = remember.account
		}

		if (this.autoLogin) {
			this.account = remember.account
			this.password = remember.password
		}
	},
	methods: {
		nuxt() {
			this.$el.querySelector('.login-wrap').style.height = '100%'
		},
		checkToLogin() {
			const _this = this
			let cancel = false

			if (this.account == '' || this.password == '') {
				this.$alert('帳號或密碼不得為空', '注意!')
				return
			}
			//-登入中
			this.$alert('登入中', {
				showConfirmButton: false,
				showCancelButton: true,
			}).then(({ value }) => {
			}).catch(() => {
				cancel = true
			})

			setTimeout(function(){
				if (!cancel) {
					_this.doLogin()
				}
			}, 500)
		},
		async doLogin() {
			let _this = this

			await axios.post(process.env.NUXT_ENV_API_URL + "/validation", qs.stringify({
			  LoginAccount: this.account,
			  LoginPassword: this.password,
			  LoginMobile: 0,
			}))
			.then(response => {
				const result = response.data

			  if (result['Code'] <= 0) {
			  	_this.$alert(result['ErrorMsg'], '注意!')
			  	return
			  }

			  if (result["Code"] == 2) {
					sessionStorage.setItem("UserAccount", result["UserAccount"]);
					sessionStorage.setItem("UserID", result["UserId"]);
					sessionStorage.setItem("ChooseID", result["ChooseId"]);
					sessionStorage.setItem("UserToken", result["Token"]);
					window.location.href = "/agent/mobi/index.php"
					return
			  }

				//記住我
			  _this.$store.commit('setRemember', {
			  	me: _this.rememberMe,
			  	account: _this.account,
					password: _this.password,
					autoLogin: _this.autoLogin
			  })

			  //set user info
			  _this.$store.commit('setuserAuth', result);
			})
		}
	},
}
</script>