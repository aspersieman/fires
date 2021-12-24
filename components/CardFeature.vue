<template>
  <div
    class="card"
    :class="[flat ? 'shadow-lg' : '']"
  >
    <div class="card-heading">
      <slot name="heading" />
    </div>
    <div class="card-body">
      <slot name="body" />
    </div>
    <div
      v-if="footerTitle != ''"
      class="card-footer-title"
    >
      {{ footerTitle }}
    </div>
    <div class="card-footer-contents">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardFeature',

  props: {
    footerTitle: {
      type: String,
      required: false,
      default: ''
    },
    flat: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/sass/_variables.sass"
.card
  @apply max-w-sm rounded bg-white overflow-hidden

.card-heading
  @apply px-6 py-3 w-full font-bold text-xl

.card-body
  @apply px-6 py-2 text-gray-700 text-base

.card-footer-title
  @apply w-full font-bold font-medium px-6 py-1 border-t border-solid border-gray-300

.card-footer-contents
 @apply px-3 pb-2 text-right

.card-button
  @apply whitespace-no-wrap text-white font-bold py-2 px-2 ml-1 rounded
  background-color: $accent_1_200
</style>
