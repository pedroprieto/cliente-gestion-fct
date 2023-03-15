<template>
<div class="panel" v-for="fct of FCT.fcts" :key="fct.id">
  <p class="panel-heading">{{ fct.empresa }} - {{ fct.alumno }}</p>
  <p class="panel-tabs">
    <a @click="changeTab(fct, 0)" :class="{ 'is-active': !fct.selectedTab }">Datos</a>
    <a @click="loadVisitas(fct)" :class="{ 'is-active': fct.selectedTab == 1 }">Visitas</a>
    <a @click="changeTab(fct, 2)" :class="{ 'is-active': fct.selectedTab == 2 }">Documentación</a>
  </p>
  <div v-if="!fct.selectedTab">
    <p class="panel-block">
      Inicio: {{ new Date(fct.fecha_inicio).toLocaleDateString('es') }} - Fin:
      {{ new Date(fct.fecha_fin).toLocaleDateString('es') }}
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
      <button @click="formVisita(fct, null)" class="button is-primary is-fullwidth">
        Añadir visita
      </button>
    </div>
    <div v-if="!fct.modifyVisit" class="box" v-for="visita of fct.visitas" :key="visita.id">
      <VisitaDatos :visita="visita"></VisitaDatos>
      <p>
        <button
          @click="formVisita(fct, visita)"
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
    <FormularioVisita
      :visita="visitaEditar"
      :fct="fct"
      v-else
      @cerrar="cancelarFormulario(fct)"
      @enviar="(d, editing) => updateCreateVisit(fct, d, editing)"
      ></FormularioVisita>
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
import FormularioVisita from './FormularioVisita.vue'


export default {
    components: {
        VisitaDatos,
        FormularioVisita
    },
    data() {
        return {
            FCT: gestionFCTStore(), 
            visitaEditar: null
        }
    },
    methods: {
        changeTab: function (fct, tab) {
            fct.selectedTab = tab
        },
        formVisita: function (fct, visitData) {
            this.visitaEditar = visitData
            fct.modifyVisit = true
        },
        cancelarFormulario: function (fct) {
            fct.modifyVisit = false
        },
        loadVisitas: async function (fct) {
            this.changeTab(fct, 1)
        },
        updateCreateVisit: async function (fct, visitData, editing) {
            if (!editing) {
                await this.FCT.addVisit(visitData, fct)
            } else {
                await this.FCT.updateVisit(visitData)
            }
            fct.modifyVisit = false
        },
        borrarVisita: async function (fct, visita) {
            if (confirm("¿Desea eliminar la visita?")) {
                await this.FCT.deleteVisit(fct, visita)
            }
        },
        generarCertificado: function (tipo, fct) {
      this.FCT.generarCertificados(tipo, fct)
    }
  }
}
</script>

<style></style>
