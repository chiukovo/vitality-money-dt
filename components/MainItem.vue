<template lang="pug">
.mainItem
  .mainItem-content
    //-tabs
    .mainItem-tabs.tabs-nav
      #tab-item.tabs__item(@click="clickTab(1)" :class="{'is-active': $store.state.mainItemTabs == 1}") 自訂
      #tab-item.tabs__item(@click="clickTab(2)" :class="{'is-active': $store.state.mainItemTabs == 2}") 指數
      #tab-item.tabs__item(@click="clickTab(3)" :class="{'is-active': $store.state.mainItemTabs == 3}") 指數期貨
      #tab-item.tabs__item(@click="clickTab(4)" :class="{'is-active': $store.state.mainItemTabs == 4}") 商品期貨
    Custom
</template>

<script>

import Custom from "~/components/MainItemData/Custom"

export default {
	data() {
	  return {}
	},
  components: {
    Custom,
  },
  methods: {
    clickTab(type) {
      this.$store.commit('setTabs', type)
    }
  }
}
</script>