<template lang="pug">
.mainItem
  .mainItem-content
    //-tabs
    ul
      li(@click="tabs = 1") 自訂
      li(@click="tabs = 2") 指數
      li(@click="tabs = 3") 指數期貨
      li(@click="tabs = 4") 商品期貨
      li(@click="tabs = 5") 加密貨幣
    
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

<style>
  .test {
    position: fixed;
    z-index: 99;
    background: #fff;
    color: #333;
  }
</style>
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