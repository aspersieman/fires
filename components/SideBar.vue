<template>
  <!--Sidebar with Dimmer -->
  <div class="fixed inset-0 flex z-40">
    <!-- Sidebar -->
    <div
      class="absolute flex top-0 h-screen z-20"
      :class="[right ? 'right-0 flex-row' : 'left-0 flex-row-reverse']"
    >
      <!--Drawer -->
      <button
        class="toggle-button"
        :class="[right ? 'rounded-l' : 'rounded-r']"
        @click.prevent="toggle()"
      >
        <span
          :class="[right ? '-rotate-90' : 'rotate-90']"
          class="block transform origin-center font-bold w-8 h-8 m-auto"
        >
          {{ title }}
        </span>
      </button>

      <!-- Sidebar Content -->
      <div
        ref="content"
        class="transition-all duration-700 overflow-y-scroll flex justify-center"
        :class="[open ? 'max-w-lg' : 'max-w-0', !transparent ? 'bg-white' : '']"
      >
        <slot />
      </div>
    </div>

    <transition name="fade">
      <!-- Dimmer -->
      <div
        v-if="dimmer && open"
        class="flex-1 bg-gray-400 bg-opacity-75 active:outline-none z-10"
        @click="toggle()"
      />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SideBar',

  props: {
    title: {
      type: String,
      required: false,
      default: 'Drawer'
    },
    right: {
      type: Boolean,
      required: false,
      default: false
    },
    transparent: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      open: false,
      dimmer: true
    }
  },

  methods: {
    toggle () {
      this.open = !this.open
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/sass/_variables.sass"

.toggle-button
  @apply w-8 h-40 p-1 my-auto text-white bg-gray-600 text-center focus:outline-none hover:bg-gray-500 duration-300
  background-color: $accent_2_300
</style>
