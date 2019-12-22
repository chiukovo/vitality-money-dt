<template lang='pug'>
ul.dropdown-submenu
  li(@click="setFontStyle(3)" :class="fontStyle == '3' ? 'is-active' : ''") 特大
  li(@click="setFontStyle(2)" :class="fontStyle == '2' ? 'is-active' : ''") 大
  li(@click="setFontStyle(1)" :class="fontStyle == '1' ? 'is-active' : ''") 中
  li(@click="setFontStyle(0)" :class="fontStyle == '0' ? 'is-active' : ''") 小
</template>

<script>

import { mapState } from 'vuex'

export default {
  data() {
    return {
    }
  },
  computed: mapState({
    fontStyle: state => state.localStorage.customSetting.fontStyle,
  }),
  methods: {
    setFontStyle(num) {
      this.$store.commit('setFontStyle', num)
    },
  }
}
</script>