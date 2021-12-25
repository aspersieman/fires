<template>
  <span>
    <navigation-bar />
    <client-only>
      <fire-map />
    </client-only>
    <footer-main />
    <vue-tailwind-modal
      :showing="aboutModalState"
      :show-close="true"
      :background-close="true"
      :css="modalOptions"
      @close="aboutModalState = false"
    >
      <h1 class="text-xl font-bold m-2">About</h1>
      <p>
        This application tracks events using the <a class="hover:text-white" href="https://api.nasa.gov">NASA</a> Open EONET API.
        Events are submitted to this API which can then be tracked using this application.
      </p>
      <br>
      <p>
        Select the relevant event from the drawer on the right.
      </p>
    </vue-tailwind-modal>
  </span>
</template>

<script>
import VueTailwindModal from 'vue-tailwind-modal'

export default {
  name: 'IndexPage',

  components: {
    VueTailwindModal,
    FireMap: () => {
      if (process.client) {
        return import('@/client-components/FireMap.vue')
      }
    }
  },

  data () {
    return {
      aboutModalState: false,
      modalOptions: {
        background: '',
        modal: 'max-h-90',
        close: ''
      }
    }
  },

  created () {
    this.$nuxt.$on('toggle-about', () => {
      console.log('about-modal toggle received')
      this.aboutModalState = !this.aboutModalState
    })
  }
}
</script>

<style lang="sass" scoped>
@import 'vue-tailwind-modal/src/css/modal'
</style>
