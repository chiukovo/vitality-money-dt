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
    //-自訂
    Custom(v-show="tabs == 1")
    //-指數
    CustomIndex(v-show="tabs == 2")
    //-指數期貨
    Futures(v-show="tabs == 3")
    //-商品期貨
    ItemFutures(v-show="tabs == 4")
    //-加密貨幣
    CryptMoney(v-show="tabs == 5")
</template>

<script>

import Dialog from "~/components/Dialog"
import Custom from "~/components/MainItemData/Custom"
import CustomIndex from "~/components/MainItemData/CustomIndex"
import Futures from "~/components/MainItemData/Futures"
import ItemFutures from "~/components/MainItemData/ItemFutures"
import CryptMoney from "~/components/MainItemData/CryptMoney"

export default {
	data() {
	  return {
      tabs: 1,
	  }
	},
  components: {
    Dialog,
    Custom,
    CustomIndex,
    Futures,
    ItemFutures,
    CryptMoney,
  },
}
</script>