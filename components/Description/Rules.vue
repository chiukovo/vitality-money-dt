<template lang='pug'>
  .description
    table
      thead
        tr
          td 分類
          td 規則說明
      tbody
        tr
          td(colspan="4") 開盤
          td 1)	開盤前不接受任何預約單。
        tr
          td 	2)	開盤風控點位預設值，留倉單于每日開盤時若每手(口)單位漲跌幅正負值超過「商品資訊」內「開盤風控點數」，系統將自動平倉，午盤休息視為收盤。
        tr
          td 3)	開盤風控是以可交易時間的第一筆報價和最後一筆報價去計算。
</template>