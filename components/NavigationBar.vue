<template>
  <nav
    class="background-colour-primary flex items-center justify-between
      flex-wrap p-3 fixed w-full z-10 top-0 drop-shadow-lg"
  >
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
      <navigation-menu
        :items="navigationItems"
      />
    </div>

    <div
      class="w-full flex-grow lg:flex lg:items-center lg:w-auto lg:block pt-6
      lg:pt-0 z-2"
      :class="[showNavContent === false ? 'hidden' : 'transition ease-in duration-700']"
    >
      <ul class="list-reset lg:flex justify-end flex-1 items-center">
        <li
          v-for="navigationItem in navigationItems"
          :key="navigationItem.name"
          class="mr-3"
        >
          <a
            class="inline-block py-2 px-4 font-colour-light no-underline"
            :href="navigationItem.href"
          >{{ navigationItem.title }}</a>
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
      showNavContent: false,
      navigationItems: [
        {
          name: 'aboutme',
          href: 'https://nicolvandermerwe.com',
          title: 'About me'
        },
        {
          name: 'code',
          href: 'https://github.com/aspersieman/fires',
          title: 'Code'
        },
        {
          name: 'about',
          href: null,
          title: 'About'
        }
      ]
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
