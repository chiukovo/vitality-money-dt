<template lang='pug'>
.root
	.page
		MainHeader
		//- 商品報價
		MainItem(v-if='tabShow == 1' @handleTab="handleTab")
		//- 技術
		Technology(v-show='tabShow == 2' :tabShow="tabShow")
		//- 商品下單
		Operating(v-show='tabShow == 3' :tabShow="tabShow")
		//- 交易
		History(v-if='tabShow == 4')
		//-客服
		Message(v-if='tabShow == 5')
		//- 帳戶
		Account(v-if='tabShow == 6' class="over-y-auto")
		//-成交回報
		Tips
	#tabs-nav
		.tabs-nav-wrap
			.tabs-list
				.tab-list__item(
					@click='handleTab(1)'
					:class="{'current': tabShow == 1}")
					i.item__icon.el-icon-s-grid
					.item__name 市場
				.tab-list__item(
					@click='handleTab(2)'
					:class="{'current': tabShow == 2}")
					i.item__icon.el-icon-s-marketing
					.item__name 技術
				.tab-list__item(
					@click='handleTab(3)'
					:class="{'current': tabShow == 3}")
					i.item__icon.el-icon-download
					.item__name 下單
				.tab-list__item(
					@click='handleTab(4)'
					:class="{'current': tabShow == 4}")
					i.item__icon.el-icon-s-order
					.item__name 交易
				.tab-list__item(
					@click='handleTab(5)'
					:class="{'current': tabShow == 5}")
					i.item__icon.el-icon-s-comment(:class="blink ? 'blink' : ''")
					.item__name 客服
				.tab-list__item(
					@click='handleTab(6)'
					:class="{'current': tabShow == 6}")
					i.item__icon.el-icon-user-solid
					.item__name 帳戶
</template>
<script>

import websocketService from '~/plugins/service/websocketService.js'
import { mapState } from 'vuex'
import MainHeader from "~/components/mobile/MainHeader"
import MainItem from "~/components/mobile/MainItem"
import Technology from "~/components/mobile/Technology"
import Operating from "~/components/mobile/Operating"
import History from "~/components/mobile/History"
import Report from "~/components/mobile/Report"
import Message from "~/components/mobile/Message"
import Account from "~/components/mobile/Account"
import Tips from "~/components/Tips"

import '@/assets/sass/mobile.scss'

export default {
	head() {
	  return {
	    htmlAttrs: {
	       class: this.$store.state.customStyle.htmlClass + 'mobile'
			},
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
			]
	  }
	},
	mixins: [websocketService],
	computed: mapState({
	  hasMessage: 'hasMessage',
	}),
	components: {
    MainHeader,
		MainItem,
		Operating,
		Technology,
		History,
		Report,
		Message,
		Account,
		Tips,
	},
	data() {
		return {
			loading: true,
			tabShow: 1,
			tranTabs: 1,
			blink: false,
			allHeight: {
				mainItem: 0,
			}
		}
	},
	watch: {
		hasMessage(type) {
			if (this.tabShow != 5 && type) {
				this.blink = true
			} else {
				this.blink = false
			}

			this.$store.commit('setHasMessage', this.blink)
		}
	},
	beforeMount() {
		this.checkDevice()
	},
  mounted () {
  	this.checkLogin()
	},
	methods: {
		handleTab(e) {
			this.tabShow = e
		}
	}
}
</script>