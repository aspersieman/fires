<template>
  <nav class="background-colour-primary flex items-center justify-between flex-wrap p-3 fixed w-full z-10 top-0">
    <div class="flex items-center flex-shrink-0 mr-6 font-colour-light">
      <a class="font-colour-light no-underline hover:text-white hover:no-underline" href="/">
        <span class="text-2xl pl-2">
          <img
            class="logo-icon"
            src="@/assets/img/fire.png"
            alt="logo"
          >
          Wildfire Tracker
        </span>
      </a>
      <span class="text-md pl-2 hidden md:block">
        Track wildfires across the globe. Powered by <a class="hover:text-white" href="https://api.nasa.gov">NASA</a>
      </span>
    </div>

    <div class="block lg:hidden">
      <button
        class="flex items-center px-3 py-2 border rounded font-colour-light
        border-gray-600 hover:text-white hover:border-white"
        @click="toggle()"
      >
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
      </button>
    </div>

    <div
      class="w-full flex-grow lg:flex lg:items-center lg:w-auto lg:block pt-6
      lg:pt-0 z-2"
      :class="{ 'hidden' : showNavContent === false }"
    >
      <ul class="list-reset lg:flex justify-end flex-1 items-center">
        <li class="mr-3">
          <a class="inline-block py-2 px-4 font-colour-light no-underline" href="https://nicolvandermerwe.com">About me</a>
        </li>
        <li class="mr-3">
          <a class="inline-block font-colour-light no-underline hover:text-gray-200 hover:text-underline py-2 px-4" href="https://github.com/aspersieman/fires">Code</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar',

  data () {
    return {
      showNavContent: false
    }
  },

  methods: {
    toggle () {
      this.showNavContent = !this.showNavContent
    }
  }
}
</script>

<style lang="sass">
.logo-icon
  margin-top: 7px
  float: left
  width: 20px
  height: 20px
</style>
