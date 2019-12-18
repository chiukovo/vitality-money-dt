import Vue from 'vue'

Vue.mixin({
  methods: {
    checkDevice() {
      const isMobile = this.$device.isMobile
      const name = this.$nuxt.$route.name.split('-')

      //pc
      if (!isMobile) {
        this.$store.commit("setMobile", 0)
        this.$cookies.set('isMobile', 0)

        if (name[0] == 'mobile') {
          location.href = '/'
        }
      } else {
        this.$store.commit("setMobile", 1)
        this.$cookies.set('isMobile', 1)

        if (name[0] != 'mobile') {
          location.href = '/mobile'
        }
      }
    },
    testGlobal() {
      return 'success'
    },
    startToken() {
      return 'a:test,test'
    },
    playSuccessSound() {
      let audio = document.getElementById('successSound')
      audio.play()
    },
    marketInfo () {
      return {
        "TW": "台灣期貨交易所",
        "SGX": "新加坡交易所",
        "CME": "芝加哥商品交易所",
        "JPX": "日本交易所集團",
        "CBOT": "芝加哥期貨交易所",
        "NYMEX": "紐約商品期貨交易所",
        "EURX": "歐洲期貨交易所",
        "HKEX": "香港交易所",
        "CFFE": "中國金融期貨交易所"
      }
    },
    allItemIds () {
      return [
        'TXF',
        'TXFAF',
        'EXF',
        'FXF',
        'TSLQ',
        'HSI',
        'HSIAF',
        'E7',
        'NK225',
        'NK225AF',
        'FDAX',
        'NQ',
        'CL',
        'GC',
        'GC',
        'SI',
        'CNAF',
        'CIF',
      ]
    },
    paramX() {
    	return 'x:TXF,TXFAF,EXF,FXF,TSLQ,HSI,HSIAF,E7,NK225,NK225AF,FDAX,YM,NQ,CL,GC,SI,CN,CNAF,CIF'
    },
    paramB() {
    	return 'h:TXF,TXFAF,EXF,FXF,TSLQ,HSI,HSIAF,E7,NK225,NK225AF,FDAX,YM,NQ,CL,GC,SI,CN,CNAF,CIF'
    },
    paramBcancelclickId(clickItemId) {
      return 'f:' + clickItemId
    },
    paramBclickId(clickItemId) {
      return 'h:' + clickItemId
    },
    formatTime(time) {
      return time.substring(0, 2) + ":" + time.substring(2, 4) + ":" + time.substring(4, 6)
    },
    formatEndDate(date) {
      return date.substring(4, 6) + "/" + date.substring(6, 8)
    },
    objectIsEmpty (obj) {
      for(let key in obj) {
        if(this.hasOwnProperty(key))
            return false;
      }
      return true;
    },
    selectDayType(type) {
      let start
      let end
      const date = new Date()
      const weekday = date.getDay() || 7

      switch (type) {
        case "today":
          end = new Date()
          end.setHours(23, 59, 59)
          start = new Date(end)
          start.setTime(end.getTime() - 3600 * 1000 * 24 + 1000)
          break
        case "yesterday":
          start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
          end = start
          break
        case "thisWeek":
          end = date.getTime()
          date.setDate(date.getDate() - weekday + 1)
          start = date.getTime()
          break
        case "beforeWeek":
          date.setDate(date.getDate() - weekday + 1)
          end = date.getTime()
          date.setDate(date.getDate() - 7)
          start = date.getTime()
          break
        case "thisMonth":
          end = date.getTime()
          date.setDate(1)
          start = date.getTime()
          break
        case "beforeMonth":
          const oneDaySeconds = 3600 * 1000 * 24
          date.setDate(1)
          end = date.getTime() - oneDaySeconds
          start = end - oneDaySeconds * 30
          break
      }

      this.form.start = this.formatDate(start)
      this.form.end = this.formatDate(end)

      this.query()
    },
    formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear()

      if (month.length < 2)
          month = '0' + month
      if (day.length < 2)
          day = '0' + day

      return [year, month, day].join('-')
    },
    changeOperating(type) {
      this.$store.commit('setOperatingStyle', type)
    },
    getProductNameById(id) {
      let target = this.$store.state.customItemSetting
      let name = ''

      if (target.length > 0) {
        target.forEach(function(val) {
          if (id == val.id) {
            name = val.name
          }
        })
      }

      return name
    },
    getMoneyColor(target) {
      return target < 0 ? 'text__success' : 'text__danger'
    }
  }
})