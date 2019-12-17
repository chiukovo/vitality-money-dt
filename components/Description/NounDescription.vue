<template lang='pug'>
  .description
    client-only
      vxe-table(
        :data="tableData"
        max-width="100%"
        height="460px"
        size="mini"
        border
        auto-resize)
        vxe-table-column(field="noun" title='名詞' width="120")
        vxe-table-column(field="description" title='說明')
</template>

<script>
export default {
    data () {
      return {
        tableData: [{
          noun: '多單',
          description: '為買升(漲)以達到獲利目的所下的單'
        },{
          noun: '空單',
          description: '為買跌以達到獲利目的所下的單'
        },{
          noun: '餘額',
          description: '帳戶可以使用的額度'
        },{
          noun: '強平',
          description: '強制平倉(關艙)的簡稱，強平會發生於餘額不足強平額度時發生，以及當日行情漲跌幅到達系統設定強平點位時，所有在倉單之多單、空單，系統將所有在倉單強制以下一筆報價平倉'
        },{
          noun: '強平額度',
          description: '餘額不足強平額度時，系統執行強平的額度標準'
        },{
          noun: '留倉',
          description: '若您所下的單直到收盤都不平倉，要留至下一次開盤，即為留倉'
        },{
          noun: '權益數',
          description: '您帳戶的可用餘額以及留倉保證金的總合'
        },{
          noun: '口數',
          description: '即本系統所下單的單位數量'
        },{
          noun: '開盤風控點數',
          description: '因市場因素，開盤時的第一盤報價點數無法預測，本系統提供開盤風控點數供客戶設定，如此可將您的開盤虧損可能性控制在您的開盤風控點數不會有超額虧損之情形，開盤風控點數也是您留倉保證金的計算依據，(留倉保證金=點數X商品每點價格/手)'
        },{
          noun: '留倉保證金',
          description: '留倉時所需預先從帳戶扣除的金額，也是您留倉單的最大虧損的極限，只要沒有出現超額的開盤虧損，留倉保證金將於商品下次開盤時，自動返還於帳戶餘額'
        },{
          noun: '手續費',
          description: '每次進行下單時所需付出的下單費用'
        },{
          noun: '每點價格',
          description: '商品每跳動一整點的價值'
        },{
          noun: '最小跳動點',
          description: '商品最小跳動點數'
        },{
          noun: '最小損益點',
          description: '商品持有平(關)艙所需的與你下單價時價位點數差額限制'
        },{
          noun: '口數上限',
          description: '本帳戶最多可持有的口(手)數上限'
        },{
          noun: '盤時間',
          description: '商品於市場開始交易的時間'
        },{
          noun: '收盤時間',
          description: '商品於市場結束交易的時間'
        },{
          noun: '停損點',
          description: '預設實現虧損的價位'
        },{
          noun: '停利點',
          description: '預設實現盈利的價位'
        },{
          noun: '市價單',
          description: '不計價格以當時價格立刻要成交'
        },{
          noun: '限價單',
          description: '不計時間以預設價格等待成交'
        },{
          noun: '未成交',
          description: '訂單送出尚未成交'
        },{
          noun: '換倉日',
          description: '交易商品是有其限的，換倉日就是下期的首交易日，換倉日的前一日就是當期的商品最後交易日'
        },{
          noun: '漲跌幅',
          description: '今日報價漲跌除以昨日收市價就可計算出當日漲跌的百分比就是漲跌幅'
        },{
          noun: '轉新單',
          description: '系統會在每日的固定時間結算作為今日與明日的損益計算，當您手中的單跨越過這個計算時間時系統將會根據當時報價執行轉新單(不收手續費)將損益區分為昨日與今日'
        },{
          noun: '移動查價',
          description: '圖表功能:移動十字線同時顯示價格資訊'
        },{
          noun: '顯示格線',
          description: '圖表功能:底圖格線顯示'
        },{
          noun: '操盤線',
          description: '圖表功能:顯示您手中持倉的價格線，以及未成交單的價格線'
        },{
          noun: '資料視窗',
          description: '圖表功能:主圖表左上方指標數值'
        },{
          noun: '成交提示',
          description: '當有單成交時跳出提示'
        },{
          noun: '損益設定',
          description: '未平(關)倉的單可以設定停損點或停利點的設定'
        },{
          noun: '點數輸入',
          description: '輸入價格的模式'
        },{
          noun: '行情輸入',
          description: '輸入跳動點單位元模式'
        },{
          noun: '餘額顯示',
          description: '餘額視窗顯示方式'
        },{
          noun: '已選商品',
          description: '選取顯示於市場總覽畫面的商品'
        },{
          noun: '可選商品',
          description: '隱藏的商品'
        },{
          noun: '倉位多',
          description: '顯示當前持倉'
        },{
          noun: '倉位空',
          description: '顯示當前持倉'
        },{
          noun: '買進價',
          description: '市場詢價資訊'
        },{
          noun: '賣出價',
          description: '市場詢價資訊'
        },{
          noun: '成交價',
          description: '市場成交資訊'
        },{
          noun: '漲跌',
          description: '當前價格較前日收市價格的差額點數'
        },{
          noun: '單量',
          description: '市場成交數量資訊'
        },{
          noun: '總量',
          description: '市場成交總數量資訊'
        },{
          noun: '昨收價',
          description: '昨日市場收市價'
        },{
          noun: '開盤價',
          description: '當日開市第一筆價'
        },{
          noun: '最高價',
          description: '當日出現最高價'
        },{
          noun: '最低價',
          description: '當日出現最低價'
        },{
          noun: '時間',
          description: '最新成交出現時間'
        },{
          noun: '交易類型',
          description: '系統交易狀態'
        },{
          noun: '禁止新單',
          description: '禁止下新單，但可下平(關)倉單，系統會於市場低量時間設定此狀態請參閱交易時間表'
        },{
          noun: '最後成交價',
          description: '留倉單計算損益的依據價位'
        },{
          noun: '最後交易日',
          description: '當期交易商品的最後持有日，收盤到期將強平'
        },{
          noun: '委買',
          description: '市場詢價資訊'
        },{
          noun: '委賣',
          description: '市場詢價資訊'
        },{
          noun: '全部單',
          description: '當日所有掛單'
        },{
          noun: '號',
          description: '系統交易單編號'
        },{
          noun: '商品',
          description: '交易商品'
        },{
          noun: '委託價',
          description: '您限定交易之價格'
        },{
          noun: '口數',
          description: '(同手數)交易數量'
        },{
          noun: '成交價',
          description: '成交的價格'
        },{
          noun: '下單時間',
          description: '送交訂單時間'
        },{
          noun: '完成時間',
          description: '訂單成交時間'
        },{
          noun: '型別',
          description: '成交的型別網路下單或是系統強制'
        },{
          noun: '損失點',
          description: '您所設定停損點'
        },{
          noun: '獲利點',
          description: '您所設定停利點'
        },{
          noun: '狀態',
          description: '訂單狀態'
        },{
          noun: '未平倉',
          description: '手中持有之成交訂單損益隨市場跳動'
        },{
          noun: '不留倉',
          description: '此勾選後將於市場收市後直接於最後成交價平(關)艙'
        },{
          noun: '市價平倉',
          description: '市價平(關)艙'
        },{
          noun: '報價',
          description: '當時價格'
        },{
          noun: '未平損益',
          description: '手中持有之成交訂單損益隨市場跳動'
        },{
          noun: '天數',
          description: '持有該筆單的天數'
        },{
          noun: '昨日損益',
          description: '該筆單昨日的損益'
        },{
          noun: '多空並存',
          description: '用戶權限:可同時持有同一商品多單與空單進行鎖單的'
        },{
          noun: '口數上限',
          description: '最高可持有的上限'
        },{
          noun: '所需保證金',
          description: '每下一口(手)單所需要的餘額'
        },{
          noun: '日權益數',
          description: '昨日的帳戶總額'
        },{
          noun: '今日損益',
          description: '今日的損益'
        },{
          noun: '餘額',
          description: '帳戶可用餘額'
        },{
          noun: '強平額度',
          description: '持倉強制平倉的餘額標準'
        },{
          noun: '留倉保證金',
          description: '留倉單所預扣的保證金'
        },{
          noun: '總權益數',
          description: '帳戶總值'
        },{
          noun: '現價',
          description: '當前商品價格'
        },{
          noun: '買升',
          description: '買進後若價格高於買進價即獲利'
        },{
          noun: '買跌',
          description: '買進後若價格低於買進價即獲利'
        },{
          noun: '報價明細',
          description: '市場每筆報價的明細'
        }]
      }
    }
  }
</script>