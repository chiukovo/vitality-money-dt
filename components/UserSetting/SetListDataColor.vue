<template lang='pug'>
ul.dropdown-submenu
  li(@click="setListColorStyle(1)" :class="listColorStyle == '1' ? 'is-active' : ''") 漲紅跌綠
  li(@click="setListColorStyle(2)" :class="listColorStyle == '2' ? 'is-active' : ''") 漲綠跌紅
</template>

<script>

import { mapState } from 'vuex'

export default {
  data() {
    return {
    }
  },
  computed: mapState({
    listColorStyle: state => state.localStorage.customSetting.listColorStyle,
  }),
  mounted() {
    if (typeof this.listColorStyle == 'undefined') {
      this.$store.commit('setListColorStyle', 1)
      this.listColorStyle = 1
    }
  },
  methods: {
    setListColorStyle(num) {
      this.$store.commit('setListColorStyle', num)
    },
  }
}
</script>