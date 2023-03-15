<script setup>
  import { RouterLink } from 'vue-router'
  import  SelectorCursoPeriodo from './SelectorCursoPeriodo.vue'
  import { gestionFCTStore } from '@/stores/gestionfct'
  import { useRouter } from 'vue-router'

  const router = useRouter();
  const rutas = router.getRoutes().filter(route => route.name != 'login');;
  const FCT = gestionFCTStore();
</script>

<template>
  <header>
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
</template>

<style scoped></style>
