<script setup>
  import { RouterView } from 'vue-router'
  import { gestionFCTStore } from '@/stores/gestionfct'
  import { useRouter } from 'vue-router'
  import { onBeforeMount, watch } from 'vue'
  import CompMensaje from './components/CompMensaje.vue'
  import LoadOverlay from './components/LoadOverlay.vue'

  const router = useRouter();
  const FCT = gestionFCTStore();

  router.beforeEach(async (to, from) => {
      FCT.loadCredentials();
      if (!FCT.checkLogin() && to.name !== 'login') {
          return { name: 'login' }
      }

      if ((!from.params.periodo) | (!from.params.curso) || ((from.params.curso != to.params.curso) || (from.params.periodo != to.params.periodo))) {
          FCT.curso = to.params.curso;
          FCT.periodo = to.params.periodo;
          await FCT.loadFCTs();
      }
  })
  onBeforeMount(() => {
      console.log("iniciando");
  })
  watch(
      () => FCT.loginError,
      (loginError) => {
          if (loginError) {
              console.log('watch');
              router.replace('/login');
          }
      }
  )
</script>

<template>
 <router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>

 <transition name="fade">
  <CompMensaje v-if="FCT.mostrarMensaje"/>
 </transition>

 <transition name="fade" mode="out-in">
   <LoadOverlay v-if="FCT.loading"/>
 </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
