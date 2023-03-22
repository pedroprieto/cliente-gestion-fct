<template>
  <div class="overlay hero is-fullheight">
      <div class="hero-body">
        <progress class="progress is-large is-info" max="100">60%</progress>
      </div>
  </div>
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'

export default {
}
</script>

<style scoped>
.overlay {
    z-index: 100;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: white;
}
</style>
