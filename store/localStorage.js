export const state = () => ({
  userAuth: [],
  lang: 'zh_TW',
  tradingViewUserSaveData: null,
  customSetting: {
  	noConfirmDelete: false, //刪單不確認
  	orderReport: true, //下單回報
  	clapping: false, //拍手動畫
  	sound: false, //音效
    operatingStyle: 'A',
    mainStyle: 1,
    fontStyle: 1, //預設字型大小
    orderMode: 2, //手機板 下單模式
    listColorStyle: 1, //1: 漲紅跌綠 2: 漲綠跌紅
    theme: 'default', //樣式
    defaultQuantity: 1, //預設口數
  	operatingCustomGroup: [], //下單三項自訂選項
  },
  remember: {
    me: false,
    autoLogin: false,
  	account: '',
  	password: '',
  }
})
