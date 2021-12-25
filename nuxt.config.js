export default {
  ssr: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Fires - Wildfires accross the globe',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/sass/style.sass'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/leaflet.client.js', ssr: false },
    { src: '@/plugins/vue-tailwind-icons.js', ssr: true }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/tailwindcss'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      title: 'Wildfire Tracker',
      author: 'Nicol van der Merwe'
    },
    manifest: {
      lang: 'en',
      // Short name of your app
      short_name: 'Wildfire Tracker',
      // Name of your app
      name: 'Wildfire Tracker',
      // Add descreption
      descreption: 'Track wildfires across the globe',
      start_url: '/',
      theme_color: 'rgb(197, 44, 48)',
      background_color: '#FFFFFF'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: { },

  transpile: [
  ]
}
