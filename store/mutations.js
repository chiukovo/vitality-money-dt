import Vue from 'vue'

let debounceChart = false
let debounceChartData = []

let debounceKChart = false
let debounceKChartData = []

export default {
  sendMessage (state, message) {
    if (state.socket.isConnected) {
      this._vm.$socket.send(message)
    } else {
      const _this = this;
      setTimeout(() => {
        _this.commit('sendMessage', message);
      }, 500);
    }
  },
  setApiExample(state, data) {
    state.apiExampleData = data
  },
  clearFiveData(state) {
    state.items0 = []
  },
  setTipsContent(state,  {text, type}) {
    state.tipsContent = text
    state.tipsType = type
    state.tipsShow = true
  },
  tipsStateChange(state, data) {
    state.tipsShow = data
  },
  setOnRealtimeCallback(state, onRealtimeCallback) {
    state.onRealtimeCallback = onRealtimeCallback
  },
  setSubResolution(state, subResolution) {
    state.subResolution = subResolution
  },
  setTradingViewUserSaveData(state, tradingViewUserSaveData) {
    state.localStorage.tradingViewUserSaveData = tradingViewUserSaveData
  },
  setRemember(state, { me, account, password, autoLogin }) {
    state.localStorage.remember.me = me
    state.localStorage.remember.autoLogin = autoLogin

    if (me || autoLogin) {
      state.localStorage.remember.account = account
      state.localStorage.remember.password = password
    }
  },
  setErrorMsgDate(state, date) {
    state.errorMsgDate = date
  },
  setHasMessage(state, data) {
    state.hasMessage = data
  },
  setServiceMessages(state, response) {
    state.serviceMessages = response.msg
    state.serviceErrorMsg = response.errorMsg
  },
  setUserInfoStyleHeight(state, data) {
    state.userInfoStyleHeight = data
  },
  setListColorStyle(state, type) {
    state.localStorage.customSetting.listColorStyle = type

    this.commit('computedMainItem')
  },
  setTheme(state, type) {
    state.localStorage.customSetting.theme = type
  },
  setDefaultQuantity(state, num) {
    state.localStorage.customSetting.defaultQuantity = num
  },
  setOrderMode(state, type) {
    state.localStorage.customSetting.orderMode = type
  },
  setOperatingStyle(state, type) {
    state.localStorage.customSetting.operatingStyle = type
  },
  setFontStyle(state, num) {
    state.localStorage.customSetting.fontStyle = num
  },
  setMainStyle(state, type) {
    state.localStorage.customSetting.mainStyle = type
  },
  setCustomSetting(state, type) {
    state.localStorage.customSetting[type] = !state.localStorage.customSetting[type]
  },
  setCustomItemFieldSetting(state, data) {
    state.customItemFieldSetting = data
  },
  setMainItemClosedState(state, data) {
    const itemId = data[0]
    let mainItem = state.mainItem

    mainItem = mainItem.map(function(val) {
      if (val.product_id == itemId) {
        if (data[1] == '3') {
          val.state_name = '停止交易'
        } else {
          val.state_name = '未開盤'
        }
        val.yesterday_last_price = Number(data[1])
        val.open_date_time = data[2]
        val.close_date_time = data[3]
        val.state = 0
      }

      return val
    })
  },
  setMainItemOpenData(state, data) {
    const itemId = data[0]
    let mainItem = state.mainItem

    mainItem = mainItem.map(function(val) {
      if (val.product_id == itemId) {
        val.state_name = '交易中'
        val.yesterday_close_price = Number(data[1])
        val.total_qty = Number(data[2])
        val.open_price = Number(data[5])
        val.highest_price = Number(data[6])
        val.lowest_price = Number(data[7])
        val.state = 2
      }

      return val
    })
  },
  setMainItemClosedData(state, data) {
    const itemId = data[0]
    let mainItem = state.mainItem

    mainItem = mainItem.map(function(val) {
      if (val.product_id == itemId) {
        val.state_name = '未開盤'
        val.yesterday_last_price = Number(data[1])
        val.open_date_time = data[2]
        val.close_date_time = data[3]
      }

      return val
    })
  },
  setCustomItemSetting(state, data) {
    state.customItemSetting = data

    //計算mainItem
    this.commit('computedMainItem')
  },
  computedMainItem(state) {
    const _this = this
    const setting = state.customItemSetting
    let mainItem = state.mainItem
    let result = []
    let resultToOrder = []

    if (state.commidyArray.length == 0
      || state.customItemSetting.length == 0) {
      return;
    }

    result = mainItem.map(function(val) {
      //確認此筆是否要隱藏
      //使用者設定
      let userHide = false

      setting.forEach(function(custom) {
        if (custom.id == val.product_id && !custom.show) {
          userHide = true
        }
      })

      //計算禁新 強平
      let newPoint = 0,
        cover = 0

      state.commidyArray.forEach(function (commidy) {
        if (val.product_id == commidy.ID) {
          newPoint = Number(commidy.NotNewPercent)
          cover = Number(commidy.CoverPercent)
        }
      })

      val.yesterday_close_price = Number(val.yesterday_close_price)

      //參考價 +- 參考價*禁新%
      const offsetNew = Math.ceil(val.yesterday_close_price * newPoint / 100);
      const offsetCover = parseInt(cover / 100 * val.yesterday_close_price);

      val.new_point1 = val.yesterday_close_price - offsetNew
      val.new_point2 = val.yesterday_close_price + offsetNew
      val.cover_point1 = val.yesterday_close_price - offsetCover
      val.cover_point2 = val.yesterday_close_price + offsetCover

      //顏色 昨收價 < 成交價 紅
      val.color = ''
      val.newest_price_change = ''
      val.bp_price_change = ''
      val.sp_price_change = ''
      val.total_qty_change = ''
      val.highest_price_change = ''
      val.lowest_price_change = ''
      val.newest_time_change = ''
      val.newest_qty_change = ''
      val.gain_change = ''
      val.gain_percent_change = ''
      val.state_color = ''
      val.row_hide = false

      if (val.newest_price > val.yesterday_close_price) {
        val.color = 'text__danger'
      } else {
        val.color = 'text__success'
      }

      val.computed_color = val.color

      //判斷是否要相反
      if (state.localStorage.customSetting.listColorStyle == 2) {
        //相反
        if (val.color == 'text__danger') {
          val.computed_color = 'text__success'
        }
        if (val.color == 'text__success') {
          val.computed_color = 'text__danger'
        }
      }

      //狀態顏色
      if (val.state != 2) {
        val.state_color = 'text__secondary'
      }

      //判斷欄位是否要隱藏
      //判斷是否顯示
      //指數
      if (state.mainItemTabs == 2) {
        if (val.type != 'index') {
          val.row_hide = true
        }
      }
      //指數期貨
      if (state.mainItemTabs == 3) {
        if (val.type != 'index_futures') {
          val.row_hide = true
        }
      }
      //商品期貨
      if (state.mainItemTabs == 4) {
        if (val.type != 'commodity_futures') {
          val.row_hide = true
        }
      }

      val.gain = val.newest_price - val.yesterday_close_price
      //(成交價-昨日收盤)/昨日收盤*100%
      val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)
      switch(val.state) {
        case 0:
        case 1:
          val.state_name = '未開盤'
          break
        case 3:
          val.state_name = '停止交易'
          break
        case 2:
          const findAuthCom = state.commidyArray.find(val2 => val2.ID === val.product_id);
          if (findAuthCom && findAuthCom.State !== '正常') {
            val.state_name = '後台停收'
            val.state_color = 'text__danger'
          } else {
            val.state_name = '交易中'
          }
          break
      }

      //寫入store 目前最新成交價錢
      state.nowNewPrice[val.product_id] = val.newest_price

      //判斷是否有自定義關閉
      if (userHide) {
        val.row_hide = true
      }

      if (val.product_id == 'TSLQ') {
        val.row_hide  = false
      }

      return val
    })

    //order
    setting.forEach(function(custom) {
      result.forEach(function(val) {
        if (val != '') {
          if (custom.id == val.product_id) {
            resultToOrder.push(val)
          }
        }
      })
    })

    state.mainItem = resultToOrder
  },
  setuserAuth(state, {
    UserId = '',
    Token = '',
    ReturnURL = '',
  }) {
    if (UserId == '' || Token == '') {
        state.localStorage.userAuth = []
    }

    //set localStorage
    state.localStorage.userAuth = {
      userId: UserId,
      token: Token,
      returnURL: ReturnURL,
    }

    //set cookie
    document.cookie = `token=${Token}`

    if (state.isMobile) {
      location.href = "/mobile/home"
    } else {
      location.href = "/home"
    }
  },
  setUserInfo(state, data) {
    const _this = this
    //排序跟mainItem 一樣即可
    let formatCommidy = []
    let userArray = data.UserArray
    let firstIn = false
    let firstKey = true

    if (state.commidyArray.length == 0) {
      state.commidyArray = data.CommidyArray
      firstIn = true
    } else {
      state.commidyArray.forEach(function(source) {
        data.CommidyArray.forEach(function(commidy) {
          if (source.ID == commidy.ID) {
            formatCommidy.push(commidy)
          }
        })
      })
      state.commidyArray = formatCommidy
    }

    if (state.commidyArray.length > 0) {
      state.mainItem = state.mainItem.map(function(val) {
        //確認此筆是否要隱藏
        let sysHide = true
        //系統設定
        state.commidyArray.forEach(function(commidyArray) {
          if (commidyArray.ID == val.product_id) {
            sysHide = false
          }
        })

        //加權指數強制顯示
        if (sysHide && state.commidyArray.length > 0 && val.product_id != 'TSLQ') {
          return
        }

        //判斷是否首次近來
        if (firstIn && firstKey) {
          if (state.clickItemId == '') {
            //send 第一筆
            _this.commit('sendMessage', 'h:' + val.product_id)
            state.clickItemId = val.product_id
            state.itemName = val.product_name

            firstIn = false
            firstKey = false
          }

          //set default now data
          _this.commit('setNowMainItem', val)
        }

        return val
      }).filter(val => val)
    }

    state.userInfo = userArray

    //計算userInfo
    this.commit('computedUserInfo')
    this.commit('computedMainItem')
  },
  computedUserInfo(state) {
    let userArray = state.userInfo
    //總未平損益
    state.totalUncoverLossWinMoney = Number(state.totalUncoverLossWinMoney)
    //轉number 已防加減錯誤
    userArray.Money = Number(userArray.Money)
    userArray.TodayMoney = Number(userArray.TodayMoney)
    userArray.TouchPoint = Number(userArray.TouchPoint)
    userArray.WithholdingMoney = Number(userArray.WithholdingMoney)
    //帳戶餘額 UserArray.Money + 未平損益
    state.nowMoney = userArray.Money + state.totalUncoverLossWinMoney - userArray.TouchPoint
    //昨日權益數 Money - TouchPoint  +  WithholdingMoney - TodayMoney
    state.userInfo.YesterdayInterestNum = userArray.Money - userArray.TouchPoint + userArray.WithholdingMoney - userArray.TodayMoney
    //今日損益 TodayMoney + 未平損益
    state.todayLoseWin = userArray.TodayMoney + state.totalUncoverLossWinMoney
    //可用餘額 Money - TouchPoint + 未平損益
    state.canUseMoney = userArray.Money - userArray.TouchPoint + state.totalUncoverLossWinMoney
    //強平額度 -1 * TouchPoint
    state.userInfo.CoverMoney = -1 * userArray.TouchPoint
    //總權益數 Money - TouchPoint + 未平損益 + WithholdingMoney
    state.totalInterestNum = userArray.Money - userArray.TouchPoint + state.totalUncoverLossWinMoney + userArray.WithholdingMoney
  },
  setUserOrder(state, data) {
    const _this = this

    state.userOrder = data
    let uncoveredCountDetail = []
    //計算未平倉數量
    data.UncoveredArray = data.UncoveredArray.map(function(val) {
      val.Quantity = Number(val.Quantity)

      if (typeof uncoveredCountDetail[val.ID] == 'undefined') {
        uncoveredCountDetail[val.ID] = val.Quantity
        if (val.BuyOrSell == 0) {
          uncoveredCountDetail[val.ID] = val.Quantity
        } else {
          uncoveredCountDetail[val.ID] = -1 * val.Quantity
        }
      } else {
        if (val.BuyOrSell == 0) {
          uncoveredCountDetail[val.ID] += val.Quantity
        } else {
          uncoveredCountDetail[val.ID] += -1 * val.Quantity
        }
      }

      uncoveredCountDetail[val.ID] = _this._vm.numberToPrecision(uncoveredCountDetail[val.ID])

      //default
      val.thisSerialPointDiff = 0
      val.thisSerialTotalMoney = 0

      return val
    })

    state.uncoveredCountDetail = uncoveredCountDetail

    //計算歷史資料
    this.commit('setHistoryData', data)
  },
  setHistoryData(state, data) {
    state.allCommodity = data.CommodityArray
    let _this = this
    state.multiDelete = []
    state.commodity = []
    state.buySell = data.OrderArray
    state.uncovered = data.UncoveredArray
    state.covered = data.CoveredArray
    state.unCoverBuySum = data.UnCoverBuySum
    state.unCoverSellSum = data.UnCoverSellSum == 0 ? 0 : '-' + data.UnCoverSellSum
    state.unCoverTotal = state.uncovered.length
    //計算未平損益
    this.commit('computedUncovered', state.uncovered)
    //加入多檔刪除
    state.buySell = state.buySell.map(function(source) {
      const multiDeleteInfo = {
        itemId: source.ID,
        checked: false
      }

      state.multiDelete.push(multiDeleteInfo)

      //預設顯示全部
      source.show = true

      return source
    })

    //商品統計 加入其他
    state.commodity = state.allCommodity.map(function(source) {
      let pushData = {
        Name: source.Name,
        TotalBuySubmit: 0,
        TotalSellSubmit: 0,
        RemainingBuyStock: 0,
        RemainingSellStock: 0,
        TotalSubmit: 0,
        TotalFee: 0,
        TotalPoint: 0,
        RemainingWithholding: 0,
        show: false,
      }

      data.CommodityArray.forEach(function(target) {
        if (source.ID == target.ID) {
          pushData = {
            Name: target.Name,
            TotalBuySubmit: target.TotalBuySubmit,
            TotalSellSubmit: target.TotalSellSubmit,
            RemainingBuyStock: target.RemainingBuyStock,
            RemainingSellStock: target.RemainingSellStock,
            TotalSubmit: target.TotalSubmit,
            TodayMoney: target.TodayMoney,
            TotalFee: target.TotalFee,
            TotalPoint: target.TotalPoint,
            RemainingWithholding: target.RemainingWithholding,
            show: true,
          }
        }
      })

      return pushData
    })
  },
  setTabs(state, type) {
    state.mainItemTabs = type

    //計算mainItem
    this.commit('computedMainItem')
  },
  setNowMainItem(state, data) {
    state.nowMainItem = data
  },
  setMobile(state, data) {
    state.isMobile = data
  },
  setOpenKchart(state, data) {
    state.openKchart = data
  },
  setTradingViewChart(state, tdChart) {
    state.tdChart = tdChart
  },
  setTradingViewSymbol(state, symbol) {
    state.symbol = symbol
  },
  resizeChart(state) {
    if (state.onChatResize) {
      state.onChatResize();
    }
  },
  setClickItemId(state, {id, name}) {
    const _this = this

    if (state.clickItemId == id) {
      return
    }

    //清空五檔socket
    state.items0 = []
    _this.commit('sendMessage', 'f:TXF,TXFAF,EXF,FXF,TSLQ,HSI,HSIAF,E7,NK225,NK225AF,FDAX,YM,NQ,CL,GC,SI,CN,CNAF,CIF')
    _this.commit('sendMessage', 'h:' + id)

    //change now mainItem
    state.mainItem.forEach(function(val) {
      if (val.product_id == id) {
        _this.commit('setNowMainItem', val)
      }
    })

    state.clickItemId = id
    state.itemName = name

    let history = state.historyPrice[id]
    let fiveData = state.nowFiveMoney[id]
    let volumeMoney = state.nowVolumeMoney[id]

    if (typeof history != 'undefined') {
      this.commit('setItemChange', history)
    } else {
      state.items2 = []
    }

    if (typeof fiveData != 'undefined') {
      this.commit('setFiveItemChange', {fiveData, itemId: id})
    }

    if (typeof volumeMoney != 'undefined') {
      this.commit('setVolumeChange', volumeMoney)
    } else {
      state.items1 = []
    }
  },
  setMainItem(state, data) {
    const _this = this
    const commidyArray = state.commidyArray

    //計算禁新 強平
    data = data.map(function (val) {
      let setData
      let newPoint = 0,
        cover = 0

      commidyArray.forEach(function (commidy) {
        if (val.product_id == commidy.ID) {
          newPoint = Number(commidy.NotNewPercent)
          cover = Number(commidy.CoverPercent)
        }
      })

      val.yesterday_close_price = Number(val.yesterday_close_price)

      //參考價 +- 參考價*禁新%
      const offsetNew = Math.ceil(val.yesterday_close_price * newPoint / 100);
      const offsetCover = parseInt(cover / 100 * val.yesterday_close_price);

      val.new_point1 = val.yesterday_close_price - offsetNew
      val.new_point2 = val.yesterday_close_price + offsetNew
      val.cover_point1 = val.yesterday_close_price - offsetCover
      val.cover_point2 = val.yesterday_close_price + offsetCover

      //只放入有用到的
      setData = {
        bp_price: val.bp_price,
        bp_price_change: '',
        close_date_time: val.close_date_time,
        color: val.color,
        cover_point1: val.cover_point1,
        cover_point2: val.cover_point2,
        end_date: _this._vm.formatEndDate(val.end_date),
        gain: val.gain,
        gain_change: '',
        gain_percent: val.gain_percent,
        gain_percent_change: '',
        highest_price: val.highest_price,
        highest_price: val.highest_price,
        highest_price_change: '',
        highest_price: val.highest_price,
        lowest_price: val.lowest_price,
        lowest_price_change: '',
        market: val.market,
        new_point1: val.new_point1,
        new_point2: val.new_point2,
        newest_price: val.newest_price,
        newest_price_change: '',
        open_date_time: val.open_date_time,
        open_price: val.open_price,
        newest_time: _this._vm.formatTime(val.newest_time),
        newest_time_change: '',
        product_id: val.product_id,
        product_name: val.product_name,
        sp_price: val.sp_price,
        sp_price_change: '',
        state: val.state,
        state_name: val.state_name,
        total_qty: val.total_qty,
        newest_qty: val.newest_qty,
        newest_qty_change: '',
        total_qty_change: '',
        yesterday_close_price: val.yesterday_close_price,
        yesterday_last_price: val.yesterday_last_price,
        monthday: val.monthday,
        type: val.type,
      }

      return setData
    })

    state.mainItem = data
  },
  setUpdateMainItem(state, data) {
    const _this = this

    let borderName
    let itemId = data[0]
    let clickItemId = state.clickItemId
    let nowItems = data[1].split(",").map(function(item) {
      return Number(item)
    })

    //k線圖資料更新判斷
    let kLineData = state.kLineData
    //長條圖更新
    let chartData = state.chartData

    if (kLineData.length > 0 && itemId == clickItemId) {
      _this.commit('doUpdateklLineData', nowItems)
    }

    //if click 長條圖
    if (chartData.length > 0 && itemId == clickItemId) {
      _this.commit('doUpdateChartData', nowItems)
    }

    state.mainItem = state.mainItem.map(function (val) {
      if (itemId == val.product_id) {
        //計算
        let dindex = 0
        let gain = 0
        let prices = []
        let localTime = (nowItems[0] < 10000000) ? "0" + nowItems[0] / 100 : "" + nowItems[0] / 100
        let flocalTime = _this._vm.formatTime(localTime)

        let nowDate = new Date()
        let fullTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowItems[0] / 1000000, nowItems[0] / 10000 % 100, nowItems[0] / 100 % 100 ).getTime()

        borderName = val.color == 'text__success' ? 'border border__success' : 'border border__danger'

        //最高
        if (val.highest_price < nowItems[1]) {
          val.highest_price = nowItems[1]
          val.highest_price_change = val.highest_price_change == '' ? borderName : ''
        }

        //最低
        if (val.lowest_price > nowItems[1]) {
          val.lowest_price = nowItems[1]
          val.lowest_price_change = val.lowest_price_change == '' ? borderName : ''
        }

        while(dindex < nowItems.length) {
          if(dindex > 0 && dindex + 3 < nowItems.length) {
            nowItems[0] += nowItems[dindex]
            nowItems[1] += nowItems[dindex + 1]
            nowItems[2] += nowItems[dindex + 2]
            nowItems[3] += nowItems[dindex + 3]
          }

          prices.push([nowItems[2], nowItems[1]])

          dindex += 4
        }

        //總量
        val.total_qty += nowItems[2]

        //單量
        val.newest_qty_change = val.newest_qty == nowItems[2] ? '' : borderName
        val.newest_qty = nowItems[2]

        if (val.total_qty_change == '') {
          val.total_qty_change = nowItems[2] == 0 ? '' : borderName
        } else {
          val.total_qty_change = ''
        }

        //成交
        val.newest_price_change = val.newest_price == nowItems[1] ? '' : borderName
        val.newest_price = nowItems[1]

        //寫入store 目前最新成交價錢
        state.nowNewPrice[val.product_id] = val.newest_price

        //漲跌
        gain = val.newest_price - val.yesterday_close_price
        val.gain_change = val.gain == gain ? '' : borderName
        val.gain = gain
        //(成交價-昨日收盤)/昨日收盤*100%
        val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)
        val.gain_percent_change = val.gain_change
        //時間
        val.newest_time_change = val.newest_time == flocalTime ? '' : borderName
        val.newest_time = flocalTime

        _this.commit('setHistoryPrice', {itemId, prices, gain, flocalTime})
      }

      //now mainItem
      if (clickItemId == val.product_id) {
        _this.commit('setNowMainItem', val)
      }

      return val
    })

    //即時報價更新
    _this.commit('newPriceChange')
  },
  newPriceChange(state) {
    const itemId = state.clickItemId

    if (itemId == '') {
      return
    }

    const newPrice = state.nowNewPrice[itemId]

    if (typeof newPrice == "undefined") {
      return
    }

    //計算未平損益
    this.commit('computedUncovered', state.uncovered)

    //更新五檔
    //量價分布
    //分價揭示
    let fiveData = state.nowFiveMoney[itemId]
    let targetNewPrice = newPrice[itemId]
    let history = state.historyPrice[itemId]
    let volumeMoney = state.nowVolumeMoney[itemId]

    if (typeof fiveData != "undefined") {
      if (fiveData[5][2] != targetNewPrice && itemId == state.clickItemId) {
        //改五檔限價
        this.commit('setFiveItemChange', {fiveData, id: itemId})
      }
    }

    if (itemId == state.clickItemId) {
      this.commit('setItemChange', history)
      this.commit('setVolumeChange', volumeMoney)
    }
  },
  computedUncovered(state, data) {
    const _this = this
    let nowNewPrice = state.nowNewPrice
    //總共未平損益
    state.totalUncoverLossWinMoney = 0
    let result = []
    let needAdd = true

    result = data.map(function(val) {
      // 取得點數現價差，要更新在未平單上
      val.thisSerialPointDiff = 0
      // 取得價格
      let nowPrice = nowNewPrice[val.ID]

      if (typeof nowPrice == 'undefined') {
        needAdd = false
      }

      // 取得點數現價差
      let diff = Number(nowPrice) - Number(val.FinalPrice)

      // 如果是買單
      if (val.BuyOrSell == 0) {
        // 此單未平點數
        val.thisSerialPointDiff = diff
        // 總共未平損益
        state.totalUncoverLossWinMoney += diff * Number(val.PointMoney) * Number(val.Quantity)
      } else {
        val.thisSerialPointDiff = diff * -1
        state.totalUncoverLossWinMoney -= diff * Number(val.PointMoney) * Number(val.Quantity)
      }

      state.totalUncoverLossWinMoney = _this._vm.numberToPrecision(state.totalUncoverLossWinMoney)

      // 此單未平損益 (要算手續費)，要更新在未平單上
      val.thisSerialTotalMoney = val.thisSerialPointDiff * Number(val.PointMoney) * Number(val.Quantity)
      val.thisSerialTotalMoney = _this._vm.numberToPrecision(val.thisSerialTotalMoney)

      return val
    })

    state.uncovered = result

    //計算userInfo
    this.commit('computedUserInfo')
  },
  setFiveItemChange(state, {fiveData, itemId}) {
    let _this = this
    let targetNewPrice = state.nowNewPrice[itemId]

    if (typeof fiveData != "undefined" && typeof targetNewPrice != "undefined") {
      if (fiveData[5][2] != targetNewPrice) {
        fiveData[5][2] = targetNewPrice
      }
    }

    if (typeof fiveData == 'undefined') {
      state.items0 = []
      return
    }

    state.fiveTotal = {
      more: 0,
      morePercent: 0,
      nullNum: 0,
      nullNumPercent: 0,
    }

    if (fiveData.length > 0) {
      state.items0 = fiveData

      //計算total
      state.items0.forEach(function(val, key) {
        if (key != 5) {
          if (val[1] != '') {
            state.fiveTotal.more += Number(val[1])
          }

          if (val[3] != '') {
            state.fiveTotal.nullNum += Number(val[3])
          }
        }
      })

      //多勢 %
      state.fiveTotal.morePercent = Number(100 / (state.fiveTotal.more + state.fiveTotal.nullNum) * state.fiveTotal.more)
      state.fiveTotal.nullNumPercent = 100 - state.fiveTotal.morePercent
    }
  },
  setItemChange(state, history) {
    if (typeof history == 'undefined') {
      state.items2 = []
      return
    }

    if (history.length > 0) {
      state.items2 = history
    }
  },
  setVolumeChange(state, money) {
    if (typeof money == 'undefined') {
      state.items1 = []
      return
    }

    if (money.length > 0) {
      state.items1 = money
    }
  },
  setNowFiveMoney(state, data) {
    let five = data
    let itemId = five[0]
    let fiveMax = 0
    let buyCount = five[1]
    let sellCount = five[2]
    let buy = 0
    let sell = 0
    let nowPrice = state.nowNewPrice[itemId]
    let formatData = []

    for (let i = 0; i < buyCount; i++) {
      let buyNum = Number(five[i * 2 + 4])
      if(fiveMax < buyNum) {
        fiveMax = buyNum
      }
      buy += buyNum
    }

    for (let i = 0; i < sellCount; i++) {
      let sellNum = Number(five[i * 2 + 4 + buyCount * 2])
      if(fiveMax < sellNum) {
        fiveMax = sellNum
      }
      sell += sellNum
    }

    let maxNum = five[1] * 2 + five[2] * 2 + 3 - 1
    let fiveData = []

    for (let i = 0; i < sellCount; i++) {
      fiveData.push(['', five[maxNum - i * 2 - 1], five[maxNum - i * 2]])
    }

    for (let i = 0; i < buyCount; i++) {
      fiveData.push([five[i * 2 + 4], five[i * 2 + 3], ''])
    }

    //計算%
    for(let num = 0; num < fiveData.length; num++) {
      if (num <= 4) {
        fiveData[num]['percent'] = Number((fiveData[num][2] / fiveMax) * 100)
      } else {
        fiveData[num]['percent'] = Number((fiveData[num][0] / fiveMax) * 100)
      }

      fiveData[num]['newPrice'] = nowPrice
    }

    fiveData.splice(5, 0, [
      '',
      '',
      nowPrice,
      '',
      '',
    ])

    formatData = fiveData.map(function(val, key) {
      let result

      if (key < 5) {
        result = [
          '',
          '',
          val[1],
          val[2],
          val['percent'],
        ]
      }

      if (key > 5) {
        result = [
          val['percent'],
          val[0],
          val[1],
          '',
          '',
        ]
      }

      if (key == 5) {
        result = val
      }

      return result
    })

    state.nowFiveMoney[itemId] = JSON.parse(JSON.stringify(formatData))

    this.commit('setFiveItemChange', {fiveData: formatData, itemId})
    //陣列第[3]：第一筆買價
    //陣列第[13]：第一筆賣價
    state.mainItem = state.mainItem.map(function (val) {
      let borderName = val.color == 'text__success' ? 'border border__success' : 'border border__danger'

      if (itemId == val.product_id) {
        val.bp_price_change = val.bp_price == five[3] ? '' : borderName
        val.bp_price = five[3]

        val.sp_price_change = val.sp_price == five[13] ? '' : borderName
        val.sp_price = five[13]
      }

      return val
    })
  },
  doUpdateklLineData(state, data) {
    const _this = this
    let kLineData = state.kLineData
		let resolution = state.subResolution

		if (!resolution) {
			return
    }

    if (debounceKChart.length > 0) {
      if (data) {
        debounceKChartData.push(data)
      }
      return
    } else {
      if (data) {
        debounceKChartData.push(data)
      }
    }

    if (debounceKChartData.length == 0) {
      return;
    }

    debounceKChart = true
    setTimeout(() => {
      _this.commit('doUpdateklLineData')
      debounceKChart = false
    }, 500)

    let lastData = debounceKChartData[debounceKChartData.length - 1];
    const now_date = new Date()
    const nowTime = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate(), lastData[0] / 1000000, lastData[0] / 10000 % 100, lastData[0] / 100 % 100 ).getTime()
    let the_now_data = {
      time: nowTime,
      high: lastData[1],
      low: lastData[1],
      last: lastData[1],
    }

    let totalQty = 0;
    debounceKChartData.forEach((lldata, index) => {
      let dindex = 0
      let volume = lldata[2];
      totalQty += volume;
      while(dindex < lldata.length) {
        if(dindex > 0 && dindex + 3 < lldata.length) {
          if (index === debounceKChartData.length - 1) {
            the_now_data.time += lldata[dindex]
            the_now_data.last += lldata[dindex + 1]
            if (the_now_data.high < the_now_data.last) {
              the_now_data.high = the_now_data.last
            }
            if (the_now_data.low > the_now_data.last) {
              the_now_data.low = the_now_data.last
            }
          }
          volume += lldata[dindex + 2]	
          totalQty += volume
        }
        dindex += 4
      }
    })

		if (resolution.includes('D')) {
			// 1 day in minutes === 1440
			resolution = 1440
		} else if (resolution.includes('W')) {
			// 1 week in minutes === 10080
			resolution = 10080
		}
		var coeff = resolution * 60000
		var rounded = Math.floor((the_now_data.time + 60000) / coeff) * coeff
		var lastBarSec = kLineData[kLineData.length - 1][0]

		const lastK = kLineData[kLineData.length - 1]

		if (!lastK) {
			return
		}

		let lastBar = {
			time: lastK[0],
			open: lastK[1],
			high: lastK[2],
			low: lastK[3],
			close: lastK[4],
			volume: lastK[5]
		}

		if (rounded > lastBarSec) {
      const halfQty = parseInt(totalQty / 2);
      // update lastBar candle!
			if (lastBar.low > the_now_data.low) {
				lastBar.low = the_now_data.low
				lastK[3] = the_now_data.low
			} else if (lastBar.high < the_now_data.high) {
				lastBar.high = the_now_data.high
				lastK[2] = the_now_data.high
			}

			lastK[4] = the_now_data.last
      lastBar.volume += halfQty
      lastK[5] += halfQty
			lastBar.close = the_now_data.last
      state.onRealtimeCallback(lastBar)
      
			kLineData.push([
				rounded,
				the_now_data.last,
				the_now_data.last,
				the_now_data.last,
				the_now_data.last,
				halfQty,
			])
		  // create a new candle, use last close as open **PERSONAL CHOICE**
			lastBar = {
				time: rounded,
				open: the_now_data.last,
				high: the_now_data.last,
				low: the_now_data.last,
				close: the_now_data.last,
				volume: halfQty,
			}
		} else {
			// update lastBar candle!
			if (lastBar.low > the_now_data.low) {
				lastBar.low = the_now_data.low
				lastK[3] = the_now_data.low
			} else if (lastBar.high < the_now_data.high) {
				lastBar.high = the_now_data.high
				lastK[2] = the_now_data.high
			}

			lastK[4] = the_now_data.last
      lastBar.volume += totalQty
      lastK[5] += totalQty
			lastBar.close = the_now_data.last
    }

    debounceKChartData = [];
		state.onRealtimeCallback(lastBar)
  },
  doUpdateChartData(state, data) {
    const _this = this
    if (debounceChart) {
      debounceChartData = data
      return
    }

    if (!data) {
      data = debounceChartData
    }

    debounceChart = true
    setTimeout(() => {
      _this.commit('doUpdateChartData')
      debounceChart = false
    }, 500)

    let chartData = state.chartData
    let chartVolumeData = state.chartVolumeData

    const now_date = new Date()
    const nowTime = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate(), data[0] / 1000000, data[0] / 10000 % 100, data[0] / 100 % 100 ).getTime()
    let the_now_data = {
      time: nowTime,
      last: data[1],
      volume: data[2]
    }

    let dindex = 0
    while(dindex < data.length) {
      if(dindex > 0 && dindex + 3 < data.length) {
        the_now_data.time += data[dindex]
        the_now_data.last += data[dindex + 1]
        the_now_data.volume += data[dindex + 2]	
      }
      dindex += 4
    }

		var lastBarSec = chartData[chartData.length - 1][0]

		const lastPriceData = chartData[chartData.length - 1]
    const lastVolumeData = chartVolumeData[chartVolumeData.length - 1]
		if (!lastPriceData || !lastVolumeData) {
			return
		}

    let isNewPoint = false
		if (the_now_data.time / 1000 % 60 < lastBarSec / 1000 % 60) {
      isNewPoint = true
		} else {
      lastPriceData[0] = the_now_data.time
      lastVolumeData[0] += the_now_data.time
      lastPriceData[1] = the_now_data.last
      lastVolumeData[1] += the_now_data.volume
    }

    if (state.onChatUpdate) {
      let highest
      let lowest
      if (the_now_data.last > state.nowMainItem.highest_price) {
        highest = the_now_data.last
        lowest = state.nowMainItem.lowest_price
      } else if (the_now_data.last < state.nowMainItem.lowest_price) {
        highest = state.nowMainItem.highest_price
        lowest = the_now_data.last
      }

      state.onChatUpdate({
        isNewPoint,
        time: the_now_data.time,
        price: the_now_data.last,
        volume: lastVolumeData[1],
        highest,
        lowest,
      })
    }
  },
  onChatResize(state, callback) {
    state.onChatResize = callback
  },
  onChatUpdate(state, callback) {
    state.onChatUpdate = callback
  },
  clearUserAuth(state, data) {
    state.localStorage.userAuth = []

    //set cookie
    document.cookie = `token=`
  },
  clearModalData(state) {
    state.kLineData = []
    state.chartData = []
  },
  setChartId(state, id) {
    state.chartId = id
  },
  setChartData(state, response) {
    state.chartData = []
    state.chartCrossData = []
    state.chartVolumeData = []
    this.commit('setChartId', response.id)

    const reference = state.nowMainItem.yesterday_close_price
    let open_date_time = new Date(state.nowMainItem.open_date_time).getTime()
    let close_date_time = new Date(state.nowMainItem.close_date_time).getTime()

    const code = response.data.Code
    const data = response.data.Tech
    if (code == 1) {
      const items = data.split(",")

      if (items.length > 1) {
        const dateTime = new Date(items[0]).getTime()
        let chartData = Number(items[1])

        state.chartData.push([
          dateTime,
          reference
        ])

        state.chartVolumeData.push([
          dateTime,
          0
        ])

        let last_time = 0
        let pi = parseInt(items.length / 150) * 3;
        if (pi < 3) {
          pi = 3;
        }
        let localHigh = 0;
        let localLow = 9999999;
        for (let i = 3; i < items.length - 1; i += 3) {
          const chartDateTime = dateTime + Number(items[i]) * 60000
          chartData += Number(items[i + 1])

          if (Number(items[i]) > 0) {
            if (i % pi == 0 || !state.isMobile) {
              localHigh = chartData
              localLow = chartData
              state.chartData.push([
                chartDateTime,
                chartData
              ])
              state.chartVolumeData.push([
                chartDateTime,
                Number(items[i + 2])
              ])
            } else {
              if (localHigh < chartData) {
                localHigh = chartData
                state.chartData[state.chartData.length - 1][1] = chartData
              }
              if (localLow > chartData) {
                localLow = chartData
                state.chartData[state.chartData.length - 1][1] = chartData
              }
              state.chartVolumeData[state.chartVolumeData.length - 1][1] += Number(items[i + 2])
            }
            last_time = chartDateTime
          }
        }

        if (state.chartData.length > 0) {

          if(last_time > 0 && open_date_time > last_time) {
            open_date_time = dateTime
            close_date_time = last_time
          }

          state.chartCrossData = [
            [open_date_time, reference],
            [close_date_time, reference]
          ]
        } else {
          state.chartCrossData = [
            [0, 0]
          ]
        }
      }
    }
  },
  setkLineData(state, data) {
    state.kLineData = data
  },
  setHistoryPrice(state, {itemId, prices, gain, flocalTime}) {
    const data = {
      price: 0,
      amount: 0,
      flocalTime: flocalTime,
    }

    let nowPrice = state.nowNewPrice[itemId]

    if (typeof state.historyPrice[itemId] == 'undefined') {
      Vue.set(state.historyPrice, itemId, [])
    }

    if (typeof state.nowVolumeMoney[itemId] == 'undefined') {
      Vue.set(state.nowVolumeMoney, itemId, [])
    }

    prices.forEach(function(val) {
      //0 量 1 價格
      data.amount = val[0]
      data.price = val[1]
      data.gain = gain

      state.historyPrice[itemId].unshift(data)
    })

    if (state.historyPrice[itemId].length > 30) {
      for (let num = 1; num <= state.historyPrice[itemId].length - 30; num++) {
        state.historyPrice[itemId].pop()
      }
    }

    let amountMax = 0

    //加入到量價揭示
    state.historyPrice[itemId].forEach(function(val) {
      if (val.amount > amountMax) {
        amountMax = val.amount
      }

      if (state.nowVolumeMoney[itemId].length == 0) {
        state.nowVolumeMoney[itemId].push({
          amount: val.amount,
          price: val.price,
        })
      } else {
        let needAdd = true

        state.nowVolumeMoney[itemId] = state.nowVolumeMoney[itemId].map(function(dt) {
          if (val.price == dt['price']) {
            dt['amount'] += val.amount
            needAdd = false
          }

          if (dt['amount'] > amountMax) {
            amountMax = dt['amount']
          }

          return dt
        })

        if (needAdd) {
          state.nowVolumeMoney[itemId].push({
            amount: val.amount,
            price: val.price,
          })
        }
      }
    })

    //排序
    state.nowVolumeMoney[itemId] = state.nowVolumeMoney[itemId].sort(function (a, b) {
      return a['price'] > b['price'] ? -1 : 1
    })

    //設定%數
    state.nowVolumeMoney[itemId] = state.nowVolumeMoney[itemId].map(function(dt) {
      dt['isNow'] = dt['price'] == nowPrice ? true : false
      dt['percent'] = Number((dt['amount'] / amountMax) * 100)

      return dt
    })

    //排序historyPrice
    state.historyPrice[itemId] = state.historyPrice[itemId].sort(function (a, b) {
      return a['flocalTime'] < b['flocalTime'] ? -1 : 1
    })

    this.commit('setItemChange', state.historyPrice[itemId])
  },
  SOCKET_ONOPEN (state, event)  {
    Vue.prototype.$socket = event.currentTarget
    state.socket.isConnected = true

    if (state.socket.reconnecting) {
      this._vm.$msgbox.close()
      this._vm.$alert('重新連線成功!')
      state.socket.reconnecting = false
      location.reload()
    }
  },
  SOCKET_ONCLOSE (state, event)  {
    state.socket.isConnected = false
  },
  SOCKET_ONERROR (state, event)  {
    state.socket.reconnecting = true
    this._vm.$alert('連線異常, 重新連線中...')
    console.error('error network')
  },
  SOCKET_ONMESSAGE (state, message)  {
    state.socket.message = message
  },
  SOCKET_RECONNECT(state, count) {
    console.info('reconnecting')
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true
  },
}