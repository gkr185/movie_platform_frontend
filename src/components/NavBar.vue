<template>
  <div class="nav-wrapper">
    <TheNavbar />
  </div>
</template>

<script>
import TheNavbar from './nav/TheNavbar.vue'

export default {
  name: 'NavBar',
  components: {
    TheNavbar
  }
}
</script>

<style lang="scss" scoped>
.nav-wrapper {
  position: relative;
}
</style> 