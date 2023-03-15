<script setup>
  import { RouterView } from 'vue-router'
  import { gestionFCTStore } from '@/stores/gestionfct'
  import { useRouter } from 'vue-router'
  import { onBeforeMount } from 'vue'
  import CompMensaje from './components/CompMensaje.vue'
  import LoadOverlay from './components/LoadOverlay.vue'

  const router = useRouter();
  const FCT = gestionFCTStore();
  router.beforeEach(async (to, from) => {
      console.log("ruteando");
      if (!FCT.checkLogin() && to.name !== 'login') {
          return { name: 'login' }
      }
  })
  onBeforeMount(() => {
      FCT.loadCredentials();
      console.log("iniciando");
  })
</script>

<template>

<RouterView/>
<CompMensaje v-if="FCT.mostrarMensaje"/>
<LoadOverlay v-if="FCT.loading"/>
</template>

<style scoped></style>
