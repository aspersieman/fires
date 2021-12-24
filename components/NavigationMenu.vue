<template>
  <div
    class="relative inline-block text-left text-white"
  >
    <div>
      <span class="rounded-md shadow-sm">
        <button
          id="options-menu"
          type="button"
          class="active:bg-gray-100 active:text-gray-800 border border-dark
            btn-focus duration-150 ease-in-out flex focus:border-blue-300
            focus:outline-none focus:shadow-outline-blue font-colour-light
            font-medium h-10 hover:text-gray-500 inline-flex items-center
            justify-between leading-5 px-3 py-2 rounded text-gray-700 text-sm
            transition w-full"
          aria-haspopup="true"
          aria-expanded="true"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </span>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isMenuOpen"
        class="background-colour-primary origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg text-sm overflow-hidden border border-dark z-20"
      >
        <div
          class="rounded-md shadow-xs"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div>
            <div class="background-colour-primary p-4 flex items-center">
              <div class="w-full">
                <p
                  class="copyright font-semibold text-base text-xs"
                >
                  <span>© {{ year }}</span>
                  <a class="text-white font-semibold" href="https://nicolvandermerwe.com/">Nicol van der Merwe</a>
                </p>
              </div>
            </div>
          </div>
          <div class="border-t border-dark" />
          <div class="py-1">
            <a
              v-for="item in items"
              :key="item.name"
              class="p-4 flex items-center space-x-2"
              :href="item.href"
            >
              {{ item.title }}
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'DropdownMenu',

  props: {
    items: {
      type: Array,
      required: false,
      default: () => { return [] }
    }
  },

  data () {
    return {
      isMenuOpen: false,
      year: (new Date()).getFullYear()
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/sass/_variables.sass"

.copyright
  display: none
  @media (max-width: 768px)
    display: unset

.border-dark
  border: 1px solid $primary_0_200
</style>
