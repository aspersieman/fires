module.exports = {
  mode: 'jit',
  content: [],
  theme: {
    extend: {
      colors: {
        'smoke-900': 'rgba(0, 0, 0, 0.9)',
        'smoke-800': 'rgba(0, 0, 0, 0.75)',
        'smoke-600': 'rgba(0, 0, 0, 0.6)',
        smoke: 'rgba(0, 0, 0, 0.5)',
        'smoke-400': 'rgba(0, 0, 0, 0.4)',
        'smoke-200': 'rgba(0, 0, 0, 0.25)',
        'smoke-100': 'rgba(0, 0, 0, 0.1)'
      }
    }
  },
  purge: {
    content: [
      './node_modules/vue-tailwind-modal/src/VueTailwindModal.vue'
    ],
    options: {
      // Include the bg-smoke for use when css is compressed
      // see: https://tailwindcss.com/docs/controlling-file-size
      whitelist: ['bg-smoke-800']
    }
  },
  plugins: []
}
