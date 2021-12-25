<template>
  <span>
    <navigation-bar />
    <client-only>
      <fire-map />
    </client-only>
    <footer-main />
  </span>
</template>

<script>
export default {
  name: 'IndexPage',

  components: {
    FireMap: () => {
      if (process.client) {
        return import('@/client-components/FireMap.vue')
      }
    }
  }
}
</script>
