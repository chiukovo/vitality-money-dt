export const state = () => ({
  userAuth: [],
  lang: 'zh_TW',
  customSetting: {
  	noConfirmDelete: false, //刪單不確認
  	orderReport: true, //下單回報
  	clapping: false, //拍手動畫
  	sound: false, //音效
    operatingStyle: 'A',
    mainStyle: 1,
    fontStyle: 1, //預設字型大小
  	operatingCustomGroup: [], //下單三項自訂選項
  },
  remember: {
  	me: false,
  	account: '',
  	password: '',
  }
})
