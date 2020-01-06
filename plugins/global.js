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
    logout(isClick) {
      const returnUrl = this.$store.state.localStorage.userAuth.returnURL

      if (typeof isClick != 'undefined' && isClick) {
        //unset cookie
        this.$cookies.remove('token')
        //unset user info
        this.$store.commit('clearUserAuth')
      }

      if (returnUrl && returnUrl !== '') {
        location.href = returnUrl
      } else {
        location.href = "/"
      }
    },
    startToken() {
      return 'a:test,test'
    },
    playSuccessSound() {
      let audio = document.getElementById('successSound')
      audio.play()
    },
    getDefaultMainField() {
      return [
        {id: 'product_name', name: '商品', show: true},
        {id: 'buy', name: '倉位多', show: true},
        {id: 'sell', name: '倉位空', show: true},
        {id: 'bp_price', name: '買進價', show: true},
        {id: 'sp_price', name: '賣出價', show: true},
        {id: 'newest_price', name: '成交價', show: true},
        {id: 'gain', name: '漲跌', show: true},
        {id: 'gain_percent', name: '漲幅%', show: true},
        {id: 'newest_qty', name: '單量', show: true},
        {id: 'total_qty', name: '總量', show: true},
        {id: 'yesterday_close_price', name: '昨收價', show: true},
        {id: 'open_price', name: '開盤價', show: true},
        {id: 'highest_price', name: '最高價', show: true},
        {id: 'lowest_price', name: '最低價', show: true},
        {id: 'newest_time', name: '時間', show: true},
        {id: 'state_name', name: '交易', show: true},
        {id: 'newest_price', name: '最後成交價', show: true},
        {id: 'end_date', name: '最後交易日', show: true},
        {id: 'doc', name: '說明', show: true},
        {id: 'itemType', name: '商品類別', show: true},
      ]
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
    },
    dateOnlyHis(date) {
      const format = date.split(" ")

      if (typeof format[1] != "undefined") {
        return format[1]
      } else {
        return date
      }
    },
  }
})