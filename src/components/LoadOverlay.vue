<template>
<div class="overlay hero is-fullheight">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <p class="title">
          <progress class="progress is-large is-info" max="100"></progress>
        </p>
      </div>
    </div>
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
    opacity: 0.8;
}
</style>
