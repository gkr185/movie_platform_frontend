<template>
  <div class="nav-wrapper">
    <TheNavbar 
      :is-menu-open="isMenuOpen"
      @toggle-menu="toggleMenu"
    />
    <NavMenu 
      :is-open="isMenuOpen"
      @update:is-open="updateMenuState"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import TheNavbar from './nav/TheNavbar.vue'
import NavMenu from './nav/NavMenu.vue'

export default {
  name: 'NavBar',
  components: {
    TheNavbar,
    NavMenu
  },
  computed: {
    ...mapGetters(['isMenuOpen'])
  },
  methods: {
    ...mapMutations(['TOGGLE_MENU', 'SET_MENU_STATE']),
    toggleMenu() {
      this.TOGGLE_MENU()
    },
    updateMenuState(isOpen) {
      this.SET_MENU_STATE(isOpen)
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-wrapper {
  position: relative;
}
</style> 