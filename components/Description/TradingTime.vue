<template lang='pug'>
  .description
    p(style="font-size:12px") 時間以冬令
      span.text__danger  (每年十一月第一個星期天開始)
      |  為主，歐美商品於夏令
      span.text__danger  (每年三月第二個星期天開始)
      |  提前一小時開盤、收盤
    client-only
      vxe-table(
        :data="tableData"
        max-width="100%"
        height="460px"
        size="mini"
        border
        auto-resize)
        vxe-table-column(field="product" title='模擬商品')
        vxe-table-column(field="startTime" title='開盤時間')
        vxe-table-column(field="transactionTime" title='可交易時間')
        vxe-table-column(field="low" title='低量時段(禁新)')
        vxe-table-column(field="exchange" title='交易所')
</template>

<script>
export default {
    data () {
      return {
        tableData: [{
          product: '加權指數',
          startTime: '09:00~13:30',
          transactionTime: '09:00~13:31',
          low: '',
          exchange: '台灣證券交易所(TWSE)'
        },{
          product: '台指期',
          startTime: '08:45~13:45',
          transactionTime: '08:45~13:45',
          low: '',
          exchange: '台灣期交所(Taifex)'
        },{
          product: '台指全',
          startTime: '08:45~13:45\n15:00~次日05:00',
          transactionTime: '08:45~13:45\n15:00~次日05:00',
          low: '',
          exchange: '台灣期交所(Taifex)'
        },{
          product: '小道瓊',
          startTime: '07:00~次日06:00\n(次日05:15~05:30報價會暫停15分鐘)',
          transactionTime: '07:00~次日06:00',
          low: '06:00-13:01',
          exchange: '芝加哥期貨交易所(CBOT)'
        },{
          product: '小那指',
          startTime: '	07:00~次日06:00\n(次日05:15~05:30報價會暫停15分鐘)',
          transactionTime: '07:00~次日06:00',
          low: '06:00-13:01',
          exchange: '芝加哥商品交易所(CME)'
        },{
          product: '小SP',
          startTime: '07:00~次日06:00\n(次日05:15~05:30報價會暫停15分鐘)',
          transactionTime: '07:00~次日06:00',
          low: '05:15-09:00',
          exchange: '	芝加哥商品交易所(CME)'
        },{
          product: '恆生期',
          startTime: '09:15~12:00\n13:00~16:30\n17:15~次日03:00(T+1)',
          transactionTime: '09:15~12:00\n13:00~16:30\n17:15~次日03:00(T+1)',
          low: '17:15-01:01',
          exchange: '香港期貨交易所(HKF)'
        },{
          product: '滬深期',
          startTime: '09:30~11:30\n13:00~15:00',
          transactionTime: '09:30~11:30\n13:00~15:00',
          low: '',
          exchange: ''
        },{
          product: '德國DAX',
          startTime: '08:15(冬夏令不變)~次日05:00',
          transactionTime: '08:15(冬夏令不變)~次日05:00',
          low: '',
          exchange: '歐洲期貨交易所(Eurex Exchange)'
        },{
          product: '日經',
          startTime: '07:30~14:30\n14:55~次日04:45(T+1)',
          transactionTime: '07:30~14:30\n14:55~次日04:45(T+1)',
          low: '',
          exchange: '新加坡交易所(SGX-DT)'
        },{
          product: '歐元期',
          startTime: '07:00~次日06:00',
          transactionTime: '07:00~次日06:00',
          low: '06:00-09:00',
          exchange: ''
        },{
          product: '黃金',
          startTime: '07:00~次日06:00',
          transactionTime: '07:00~次日06:00',
          low: '06:00-09:00',
          exchange: ''
        },{
          product: '白銀',
          startTime: '07:00~次日06:00',
          transactionTime: '07:00~次日06:00',
          low: '06:00-09:00',
          exchange: ''
        },{
          product: '輕原油',
          startTime: '07:00~次日06:00',
          transactionTime: '07:00~次日06:00',
          low: '06:00-09:00',
          exchange: ''
        },{
          product: '棉花',
          startTime: '10:00~次日03:20',
          transactionTime: '10:00~次日03:20',
          low: '10:00-23:30',
          exchange: '紐約交易所(NYBOT)'
        },{
          product: '黃豆',
          startTime: '09:00~次日03:20\n(21:45~22:30報價會暫停45分鐘)',
          transactionTime: '09:00~次日03:20',
          low: '09:00-22:30',
          exchange: '芝加哥期貨交易所(CBOT)'
        },{
          product: '小麥',
          startTime: '09:00~次日03:20\n(21:45~22:30報價會暫停45分鐘)',
          transactionTime: '09:00~次日03:20	',
          low: '09:00-22:30',
          exchange: '芝加哥期貨交易所(CBOT)'
        },{
          product: '玉米',
          startTime: '09:00~次日03:20\n(21:45~22:30報價會暫停45分鐘)',
          transactionTime: '09:00~次日03:20	',
          low: '09:00-22:30',
          exchange: '芝加哥期貨交易所(CBOT)'
        },{
          product: 'BTCUSD',
          startTime: '07:00~次日05:45',
          transactionTime: '',
          low: '07:00~次日05:45',
          exchange: ''
        },{
          product: 'ETHUSD',
          startTime: '07:00~次日05:45',
          transactionTime: '07:00~次日05:45',
          low: '',
          exchange: ''
        }]
      }
    }
  }
</script>