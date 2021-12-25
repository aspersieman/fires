<template>
  <!--Sidebar with Dimmer -->
  <div
    class="container"
  >
    <!-- Sidebar -->
    <div
      class="container-main"
      :class="[right ? 'right-0 flex-row' : 'left-0 flex-row-reverse', fade ? 'z-40' : 'z-9']"
    >
      <!--Drawer -->
      <button
        class="toggle-button"
        :class="[right ? 'rounded-l' : 'rounded-r', open ? 'hidden md:block' : '']"
        @click.prevent="toggle()"
        @toggle-sidebar="toggle()"
      >
        <span
          class="block font-bold m-auto"
        >
          <icon
            name="cog"
            class="icon"
          />
        </span>
      </button>

      <!-- Sidebar Content -->
      <div
        ref="content"
        class="content filter drop-shadow-lg"
        :class="[open ? 'max-w-lg z-40' : 'max-w-0']"
      >
        <div
          class="header"
        >
          <div class="title-text">
            Actions
          </div>
          <div class="title-buttons">
            <button
              class="title-button-close"
              @click.prevent="toggle()"
            >
              <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" /></svg>
            </button>
          </div>
        </div>
        <div class="body">
          <slot />
        </div>
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
    state: {
      type: Boolean,
      required: false,
      default: false
    },
    right: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      open: false,
      dimmer: true,
      fade: true
    }
  },

  watch: {
    state () {
      this.toggle()
    }
  },

  methods: {
    toggle () {
      console.log('toggle()')
      this.open = !this.open
      if (this.open) {
        this.fade = this.open
      } else {
        setTimeout(() => {
          this.fade = this.open
        }, 700)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/sass/_variables.sass"

.max-w-0
  max-width: 0rem
.max-w-lg
  max-width: 32rem
.z-9
  z-index: 9
.z-40
  z-index: 40

.toggle-button
  @apply w-10 h-10 p-1 my-auto text-white bg-gray-600 text-center duration-300
  background-color: $accent_2_300
  z-index: 1
.toggle-button:focus
  @apply outline-none
.toggle-button:hover
  @apply bg-gray-500

.toggle-button > svg
  z-index: 1
  margin-bottom: -40px
  margin-right: 40px

.container-main
  @apply absolute flex top-0 h-screen

.header
  @apply border-b border-solid border-gray-300 font-bold w-full grid grid-cols-12 col-span-12
  height: 4rem
  padding: 5px
  margin: 0
@screen lg
  .header
    width: 24rem

.title-text
  @apply text-black col-span-10 font-bold text-xl
  margin: 10px

.title-buttons
  @apply text-black col-span-2 text-base

.content
  @apply transition-all duration-700 overflow-y-scroll flex bg-white grid grid-cols-12

.body
  @apply w-full grid grid-cols-12 col-span-12 place-self-start
  max-width: 24rem
  height: 100vh
@screen lg
  .body
    width: 24rem

.icon
  @apply block font-bold m-auto

.title-button-close
  width: 20px
  margin: 10px
  margin-top: 15px
  cursor: pointer
</style>
