<template>
<div class="container">
  <TituloPagina :titulo="`Listado de visitas de: ${fct.empresa} - ${fct.alumno}`"/>
  
  <VisitList :fct="fct"/>
  
  <div class="field is-grouped">
    <div class="control">
      <button @click="volver()" class="button is-link is-light">
        <span class="icon">
          <svg-icon class="mdi" type="mdi" :path="mdiArrowLeft"></svg-icon>
        </span>
        <span>
          Volver al listado de FCTs
        </span>
        
      </button>
    </div>
  </div>
</div>
</template>

<script setup>
import TituloPagina from '../components/TituloPagina.vue'
import { useRouter, useRoute } from 'vue-router'
import VisitList from '../components/VisitList.vue'
import { gestionFCTStore } from '@/stores/gestionfct'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeft } from '@mdi/js'

const router = useRouter();
const route = useRoute();
const FCT = gestionFCTStore();

const fct = FCT.getFCT(route.params.fctId);

function volver() {
router.push({name: 'fcts', params: route.params });
    }
</script>

<style></style>
