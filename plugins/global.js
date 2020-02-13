import Vue from 'vue'

Vue.mixin({
  data() {
    return {
      beforeScrollY: 0,
      beforeScrollX: 0,
    }
  },
  methods: {
    numberToPrecision(num) {
      return parseFloat(num.toPrecision(12))
    },
    vxeTableScrollEvent({ scrollTop, scrollLeft, isX, isY }) {
      if (isY) {
        this.beforeScrollY = scrollTop
      }

      if (isX) {
        this.beforeScrollX = scrollLeft
      }

      if (!isX && !isY && scrollTop == 0 && scrollLeft == 0) {
        this.$refs.xTable.scrollTo(this.beforeScrollX, this.beforeScrollY)
      }
    },
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
      const userAuth = this.$store.state.localStorage.userAuth

      if (typeof userAuth.token != 'undefined' && typeof userAuth.userId != 'undefined') {
        return 'a:' + userAuth.userId + ',' + userAuth.token
      }

      return
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
    cancelAllFive() {
      //清空五檔
      this.$store.commit('clearFiveData')
      //清空五檔socket
      return 'f:TXF,TXFAF,EXF,FXF,TSLQ,HSI,HSIAF,E7,NK225,NK225AF,FDAX,YM,NQ,CL,GC,SI,CN,CNAF,CIF'
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
      this.computedTableContent()
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
    getYesterdayDay() {
      const date = new Date()
      const h = date.getHours()
      const m = date.getMinutes()
      const s = date.getSeconds()

      // > 13:50 就算今天
      if (h >= 13 && m >= 50 && s >=0) {
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 1)
        return this.formatDate(date)
      } else {
        let end = new Date()
        end.setHours(23, 59, 59)
        let date = new Date(end)
        date.setTime(end.getTime() - 3600 * 1000 * 24 + 1000)

        return this.formatDate(date)
      }
    },
    findMainItemById(id) {
      const mainItem = this.$store.state.mainItem
      let target = ''

      mainItem.forEach(function(val) {
        if (id == val.product_id) {
          target = val
        }
      })

      return target
    },
    dayCoverIsDisabled(id) {
      const mainItem = this.$store.state.mainItem
      let disabled = false

      mainItem.forEach(function(val) {
        if (id == val.product_id) {
          if (val.state != 2) {
            disabled = true
          }
        }
      })

      return disabled
    },
    orderTypeWord(orderPrice, odtype) {
      let result = 0

      if (orderPrice != 0) {
        return orderPrice
      }

      switch(odtype) {
        case '收盤單':
        　result = 2
        　break
        case '代收單':
        　result = 2
        　break
        case '行收盤':
        　result = 2
        　break
        case '行限單':
        　result = 1
        　break
      }

      if (result == 0) {
        return '市'
      } else if (result == 1) {
        return ''
      } else if (result == 2) {
        return '收盤價'
      }
    },
    preSetClickItemId(id, name) {
      //開始新的
      this.$store.commit('setClickItemId', {
        id: id,
        name: name
      })

      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'chart',
        'num': 1
      })

      this.$store.dispatch('CALL_CHANGE_CHART_SYMBOL', id)
    },
    showErrorMsg(msg) {
      this.$alert(msg, 'Api Server Error', {
        type: 'error'
      })
    },
    tbodyScroll(event, fixedLeft) {
      const target = event.target.parentNode

      if (target == null) {
        return
      }

      //tbody scrollleft
      let tbody = target.querySelector('.custom__table .tbody')
      let thead = target.querySelector('.custom__table .thead')
      let tbodyFirst = target.querySelectorAll('.custom__table .tbody td:nth-child(1)')
      let theadFirst = target.querySelector('.custom__table .thead th:nth-child(1)')

      if (tbody == null) {
        return
      }

      const scrollLeft = tbody.scrollLeft

      thead.style.left = '-' + scrollLeft + 'px'

      if (fixedLeft) {
        theadFirst.style.left = scrollLeft + 'px'
        for (let num = 0; num < tbodyFirst.length; num++) {
          tbodyFirst[num].style.left = scrollLeft + 'px'
        }
      }
    },
    computedTableContent() {
      const _this = this

      setTimeout(function() {
        let target = document.querySelectorAll('.custom__table')
        let content = null
        let tbody
        let thead
        let w = 0
        let h = 0
        let fontStyle = 0

        if (target.length > 0) {
          target.forEach(function(el) {
            let num = 0
            content = el.parentNode
            tbody = content.querySelector('.custom__table .tbody')
            thead = content.querySelector('.custom__table .thead')

            if (content == null || tbody == null || thead == null) {
              return
            }

            w = content.offsetWidth
            h = content.offsetHeight

            //only scrollY
            if (tbody.scrollHeight > content.clientHeight && tbody.scrollWidth < content.clientWidth) {
              num = 16
            }

            if (w + 'px' == tbody.style.width && w + 'px' == thead.style.width) {
              if (tbody.style.height == h - thead.offsetHeight + 'px' && num == 0) {
                return
              }
            }

            tbody.style.width = w + 'px'
            thead.style.width = (w - num) + 'px'
            tbody.style.height = h - thead.offsetHeight + 'px'
          })
        }
       }, 200)
    },
  }
})