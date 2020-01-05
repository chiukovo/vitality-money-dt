<template lang="pug">
.mainItem
  .mainItem-content
    //-tabs
    .mainItem-tabs.tabs-nav
      #tab-item.tabs__item(@click="tabs = 1" :class="{'is-active' : tabs == 1}") 自訂
      #tab-item.tabs__item(@click="tabs = 2" :class="{'is-active' : tabs == 2}") 指數
      #tab-item.tabs__item(@click="tabs = 3" :class="{'is-active' : tabs == 3}") 指數期貨
      #tab-item.tabs__item(@click="tabs = 4" :class="{'is-active' : tabs == 4}") 商品期貨
      #tab-item.tabs__item(@click="tabs = 5" :class="{'is-active' : tabs == 5}") 加密貨幣
    Custom
</template>

<script>

import Custom from "~/components/MainItemData/Custom"

export default {
	data() {
	  return {
      tabs: 1,
	  }
	},
  components: {
    Custom,
  },
}
</script>