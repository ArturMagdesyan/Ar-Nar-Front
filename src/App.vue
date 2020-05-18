<template>
  <v-app id="app">
    <web-header v-if="!isMobile"></web-header>
    <mobile-header v-if="isMobile"></mobile-header>
    <router-view/>
    <web-footer />
  </v-app>
</template>

<script>
import WebHeader from './components/front/web/header'
import WebFooter from './components/front/web/footer'
import MobileHeader from './components/front/mobile/header'

export default {
  components: {
    'web-header': WebHeader,
    'mobile-header': MobileHeader,
    'web-footer': WebFooter,
  },
  computed: {
    isMobile(){
      return window.innerWidth <= 768;
    },
  }
}
</script>
<style lang="scss">
  body {
    animation: all .5s ease;
  }
</style>
