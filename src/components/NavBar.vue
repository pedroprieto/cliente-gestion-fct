<script setup>
import { RouterLink } from 'vue-router'
import SelectorCursoPeriodo from './SelectorCursoPeriodo.vue'
import { gestionFCTStore } from '@/stores/gestionfct'
import { useRouter, useRoute } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiLogoutVariant } from '@mdi/js'
import { reactive } from 'vue'

const router = useRouter()
const rutaActual = useRoute()
const rutas = router
  .getRoutes()
  .filter(
    (route) =>
      route.name != 'login' &&
      route.name != 'anyadirVisita' &&
      route.name != 'editarVisita' &&
      route.name != 'subirComprobante' &&
      route.name != 'visitas' &&
      route.name != 'etiquetas' &&
      route.name != 'root'
  )
const FCT = gestionFCTStore()
const state = reactive({ navbar_activa: false })

function toggleNavbar() {
  state.navbar_activa = !state.navbar_activa
}

function logOut() {
  FCT.deleteCredentials()
  router.replace({ name: 'login' })
}
</script>

<template>
  <header class="block">
    <nav class="navbar is-primary has-shadow" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <!-- <a class="navbar-item"> -->
        <!--   GestiónFCT -->
        <!-- </a> -->
        <a
          role="button"
          :class="{ 'is-active': state.navbar_activa }"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbar-app"
          @click="toggleNavbar()"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div :class="{ 'is-active': state.navbar_activa }" class="navbar-menu" id="navbar-app">
        <div class="navbar-start">
          <RouterLink
            v-for="ruta of rutas"
            :key="ruta.id"
            :class="{ 'is-active': rutaActual.name == ruta.name }"
            class="navbar-item"
            :to="{ name: ruta.name, params: { curso: FCT.curso, periodo: FCT.periodo } }"
            >{{ ruta.meta.prompt }}</RouterLink
          >
        </div>
        <div class="navbar-end">
          <SelectorCursoPeriodo />
          <div class="navbar-item">
            <button @click="logOut()" class="button is-rounded is-fullwidth">
              <span class="icon">
                <svg-icon type="mdi" :path="mdiLogoutVariant"></svg-icon>
              </span>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
