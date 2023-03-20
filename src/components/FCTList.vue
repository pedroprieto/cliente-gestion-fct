<template>
<div class="panel" v-for="fct of FCT.fcts" :key="fct.id">
  <p class="panel-heading">
    <span class="icon-text">
      <span>
        {{ fct.empresa }} - {{ fct.alumno }}
      </span>
      <span class="icon">
        <svg-icon class="mdi" type="mdi" :path="mdiAccount"></svg-icon>
      </span>
    </span>
  </p>
  <p class="panel-tabs">
    <a @click="changeTab(fct, 0)" :class="{ 'is-active': !fct.selectedTab }">Datos</a>
    <a @click="loadVisitas(fct)" :class="{ 'is-active': fct.selectedTab == 1 }">Visitas</a>
    <a @click="changeTab(fct, 2)" :class="{ 'is-active': fct.selectedTab == 2 }">Documentación</a>
  </p>
  <div v-if="!fct.selectedTab">
    <p class="panel-block">
      <button @click="borrarFCT(fct)" type="button" class="button is-fullwidth is-danger is-outlined">Borrar</button>
    </p>
    <p class="panel-block">
      Inicio: {{ fct.fecha_inicio }} - Fin:
      {{ fct.fecha_fin }}
    </p>
    <p class="panel-block">
      {{ fct.instructor }}
    </p>
    <p class="panel-block">
      {{ fct.localidad }}
    </p>
    <p class="panel-block">
      {{ fct.dir_empresa }}
    </p>
  </div>
  <!-- Visitas -->
  <div v-if="fct.selectedTab == 1">
    <div class="panel-block">
      <button @click="addVisita(fct)" class="button is-primary is-fullwidth">
        Añadir visita
      </button>
    </div>
    <div v-if="!fct.modifyVisit" class="box" v-for="visita of fct.visitas" :key="visita.id">
      <VisitaDatos :visita="visita"></VisitaDatos>
      <p>
        <button
          @click="editarVisita(fct, visita)"
          type="button"
          class="button is-outlined is-primary"
          >
          Editar
        </button>
        <button
          @click="borrarVisita(fct, visita)"
          type="button"
          class="button is-outlined is-danger"
          >
          Borrar
        </button>
      </p>
    </div>
  </div>
  <!-- Documentación -->
  <div v-if="fct.selectedTab == 2">
    <a class="panel-block" @click="generarCertificado('cert_alumno', fct)">
      Certificado de alumno
    </a>
    <a class="panel-block" @click="generarCertificado('cert_instructor', fct)">
      Certificado de instructor
    </a>
    <a class="panel-block" @click="generarCertificado('fm18', fct)"> FM18 </a>
    <a class="panel-block"> Etiqueta </a>
  </div>
</div>
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'
import VisitaDatos from './VisitaDatos.vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAccount } from '@mdi/js'
import { mdiLock } from '@mdi/js'


export default {
    components: {
        VisitaDatos,
        SvgIcon
    },
    data() {
        return {
            mdiAccount,
            FCT: gestionFCTStore(), 
            visitaEditar: null
        }
    },
    methods: {
        addVisita: function(fct) {
            this.$router.push({name: 'anyadirVisita', params: {fctId: fct.id} });
        },
        editarVisita: function(fct, visita) {
            this.$router.push({name: 'editarVisita', params: {fctId: fct.id, tipo: visita.tipo} });
        },
        changeTab: function (fct, tab) {
            fct.selectedTab = tab
        },
        loadVisitas: async function (fct) {
            this.changeTab(fct, 1)
        },
        borrarVisita: async function (fct, visita) {
            if (confirm("¿Desea eliminar la visita?")) {
                this.FCT.deleteVisit(fct, visita).then(respuesta => {
                    this.FCT.enviarMensaje("Visita borrada con éxito", false);
                }).catch(error => {
                    console.log("error");
                    this.FCT.enviarMensaje(error, true);
                    });
            }
        },
        borrarFCT: async function (fct) {
            if (confirm("¿Desea eliminar la FCT? Se borrarán también las visitas asociadas.")) {
                this.FCT.deleteFCT(fct).then(respuesta => {
                    this.FCT.enviarMensaje("FCT borrada con éxito", false);
                }).catch(error => {
                    console.log("error");
                    this.FCT.enviarMensaje(error, true);
                    });
            }
        },
        generarCertificado: function (tipo, fct) {
      this.FCT.generarCertificados(tipo, fct)
    }
  }
}
</script>

<style></style>
