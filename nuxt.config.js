require('dotenv').config()

module.exports = {
  mode: 'spa',
  head: {
    title: process.env.NUXT_ENV_WEB_TITLE || '',
    meta: [
      { charset: 'utf-8' }
    ],
    link: [
    ],
    script: [
      { src: '/js/charting_library/charting_library.min.js', type: 'text/javascript' },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: false,
  /*
  ** Global CSS
  */
  css: [
    '@/assets/sass/default.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/global',
    {src: '~plugins/websocket.js', ssr: false},
    {src: '~plugins/auth.js', ssr: false},
    {src: '~plugins/element-ui', ssr: true},
    {src: '~plugins/version', ssr: false},
    '@/static/js/el-dialogdrag'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/device',
    '@nuxtjs/component-cache',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt',
    ['vue-currency-filter/nuxt', {
      thousandsSeparator: ',',
      symbolSpacing: false
    }],
    ['nuxt-vuex-localstorage', {
      sessionStorage: ['sessionStorage'],
      localStorage: ['localStorage'],
    }]
  ],
  /*
  ** Build configuration
  */
  build: {
    babel: {
      "plugins":[
        [
          "component",
          {
            "libraryName":"element-ui",
            "styleLibraryName":"theme-chalk"
          }
        ]
      ]
    },
   },
  proxy: {
    '/api': {
      target: process.env.NUXT_ENV_API_URL,
      changeOrigin: true,
      pathRewrite: {
        '^/api' : ''
        }
      }
  },
  router: {
  },
  chainWebpack: config => {
    //close eslint
    config.module.rules.delete("eslint");
  }
}
