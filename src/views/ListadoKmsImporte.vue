<template>
  <div>
    <NavBar />
    <div class="container">
      <TituloPagina titulo="Kilómetros e importes" />
      <div class="field">
        <button @click="actualizar()" class="button is-primary is-centered">
          <span class="icon">
            <svg-icon class="mdi" type="mdi" :path="mdiRefresh"></svg-icon>
          </span>
          <span>Actualizar</span>
        </button>
      </div>
      <table class="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th><abbr title="NIF Usuario">Usuario</abbr></th>
            <th><abbr title="Kilómetros recorridos en las visitas">Kms</abbr></th>
            <th><abbr title="Importe de los recibos">Importe (€)</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in FCT.listadoKmsImportes">
            <th>{{ item.usuario }}</th>
            <td>
              {{ item.kms }}
            </td>
            <td>
              {{ item.importe }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import TituloPagina from '../components/TituloPagina.vue'
import { gestionFCTStore } from '@/stores/gestionfct'

import { mdiRefresh } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'

let FCT = gestionFCTStore()
import NavBar from '../components/NavBar.vue'

function actualizar() {
  FCT.loading = true
  FCT.getKmsVisitas().finally(() => {
    FCT.loading = false
  })
}

//          await FCT.getKmsVisitas();
</script>
<style></style>
