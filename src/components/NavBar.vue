<script setup>
  import { RouterLink } from 'vue-router'
  import  SelectorCursoPeriodo from './SelectorCursoPeriodo.vue'
  import { gestionFCTStore } from '@/stores/gestionfct'
  import { useRouter } from 'vue-router'
  import SvgIcon from '@jamescoyle/vue-icon'
  import { mdiLogoutVariant } from '@mdi/js'

  const router = useRouter();
  const rutas = router.getRoutes().filter(route => route.name != 'login');;
  const FCT = gestionFCTStore();

  function logOut() {
  FCT.deleteCredentials();
  router.replace('login');
  }
</script>

<template>
<header>
  <div class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-menu">
        <div class="navbar-start">
          <RouterLink v-for="ruta of rutas" :key="ruta.id" :class="{'is-active': this.$route.path == ruta.path}" class="navbar-item" :to="`${ruta.path}?curso=${FCT.curso}&periodo=${FCT.periodo.value}`">{{ruta.meta.prompt}}</RouterLink>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <SelectorCursoPeriodo/>
          </div>
          <div class="navbar-item">
            <button @click="logOut()" class="button is-rounded">
              <span class="icon">
                <svg-icon type="mdi" :path="mdiLogoutVariant"></svg-icon>
              </span>
              <span>Salir</span>
            </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped></style>
