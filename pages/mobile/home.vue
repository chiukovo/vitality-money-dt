<template lang='pug'>
.root
	.page
		MainHeader
		//- 商品報價
		MainItem(v-if='tabShow == 1')
		//- 技術
		Kchart(v-if='tabShow == 2')
		//- 商品下單
		Operating(v-if='tabShow == 3')
		//- 交易
		template(v-if='tabShow == 4')
			History
			//- .page
				.main
					.transaction-tabs.tabs-nav
						.tabs__item(@click="tranTabs = 1" :class="{'is-active' : tranTabs == 1}") 全部
							span 0
						.tabs__item(@click="tranTabs = 2" :class="{'is-active' : tranTabs == 2}") 未平
							span 1
						.tabs__item(@click="tranTabs = 3" :class="{'is-active' : tranTabs == 3}") 已平
						.tabs__item(@click="tranTabs = 4" :class="{'is-active' : tranTabs == 4}") 統計
					.area(v-show='tranTabs == 1' style="height: calc(100% - 40px);overflow-y: auto;")
						ul.area-tran-list
							li.hs-edit
								ul.tran-item
									li
										.tran-item__name 台指期
										.tran-item__yellow 125672
									li
										.text__danger.text__lg 多
									li
										.tran-item__hey.text__lg 1
									li
										div
											span.text__secondary 獲利
											span.tran-item__ha -
										div
											span.text__secondary 損失
											span.tran-item__ha -
									li
										div
											span.text__secondary 12097
											span.text__secondary 13:47:00
										div
											span 12097
											span 13:47:00
									li
										.tran-item__yo 轉新單
										div 已成交
							li
								ul.tran-item
									li
										.tran-item__name 台指期
										.tran-item__yellow 125672
									li
										.text__danger.text__lg 多
									li
										.tran-item__hey.text__lg 1
									li
										div
											span.text__secondary 獲利
											span.tran-item__ha -
										div
											span.text__secondary 損失
											span.tran-item__ha -
									li
										div
											span.text__secondary 12097
											span.text__secondary 13:47:00
										div
											span 12097
											span 13:47:00
									li
										.tran-item__yo 轉新單
										div 已成交
					.area(v-show='tranTabs == 2' style="height: calc(100% - 40px);overflow-y: auto;")
						.area-fixed
							button.button 全部平倉
						ul.area-tran-list
							li.hs-edit
								ul.tran-item
									li
										.tran-item__name 台指期
										.tran-item__yellow 125672
											span 1天
									li
										.text__danger.text__lg 多
									li
										.tran-item__hey 1
										.tran-item__fee 0
									li
										div
											span.text__secondary 獲利
											span.tran-item__ha -
										div
											span.text__secondary 損失
											span.tran-item__ha -
									li 12097
									li
										div 12097
										div $0
					.area(v-show='tranTabs == 3' style="height: calc(100% - 40px);overflow-y: auto;")
						ul.area-tran-list
							li
								ul.tran-item
									li
										.tran-item__name 台指期
									li
										.text__danger.text__lg 多
									li
										.tran-item__hey 1
										.tran-item__fee 600
									li
										div
											span.text__secondary 成交
											span.tran-item__ha
												span.tran-item__yellow 12094
												span 28216
										div
											span.text__secondary 平倉
											span.tran-item__ha
												span.tran-item__yellow 12686
												span 28231
									li
										.text__danger $2,400
					.area(v-show='tranTabs == 4' style="height: calc(100% - 40px);overflow-y: auto;")
						ul.area-tran-list
							li
								ul.tran-item
									li
										.tran-item__name.text__lg 台指期
									li
										.tran-item__put.bg__danger 0
										.tran-item__put.bg__success 0
									li
										.tran-item__hey.text__lg 2
									li
										div
											span.text__secondary 手續費
											span 600
									li
										.text__danger.text__lg $2,400

		//- 報表查詢
		Account(v-if='tabShow == 5')
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
					i.item__icon.el-icon-user-solid
					.item__name 帳戶
</template>
<script>

import websocketService from '~/plugins/service/websocketService.js'

import MainHeader from "~/components/mobile/MainHeader"
import MainItem from "~/components/mobile/MainItem"
import Kchart from "~/components/Kchart"
import Operating from "~/components/mobile/Operating"
import History from "~/components/mobile/History"
import Report from "~/components/mobile/Report"
import System from "~/components/mobile/System"
import Account from "~/components/mobile/Account"

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
	components: {
    MainHeader,
		MainItem,
		Operating,
		Kchart,
		History,
		Report,
		System,
		Account
	},
	data() {
		return {
			loading: true,
			tabShow: 1,
			tranTabs: 1,
			allHeight: {
				mainItem: 0,
			}
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