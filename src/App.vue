<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import  SelectorCursoPeriodo from './components/SelectorCursoPeriodo.vue'
  import { gestionFCTStore } from '@/stores/gestionfct'
  import { useRouter } from 'vue-router'

  const router = useRouter();
  const rutas = router.getRoutes().filter(route => route.name != 'login');;
  const FCT = gestionFCTStore();
  router.beforeEach(async (to, from) => {
      if (!FCT.checkLogin() && to.name !== 'login') {
          return { name: 'login' }
      }
  })
</script>

<template>
  <header v-if="this.$route.name != 'login'">
    <div class="container">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <RouterLink v-for="ruta of rutas" :key="ruta.id" :class="{'is-active': this.$route.path == ruta.path}" class="navbar-item" :to="`${ruta.path}?curso=${FCT.curso}&periodo=${FCT.periodo.value}`">{{ruta.meta.prompt}}</RouterLink>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <SelectorCursoPeriodo/>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <RouterView/>
</template>

<style scoped></style>
