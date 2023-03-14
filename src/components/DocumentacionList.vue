<template>
<div class="panel">
    <div class="panel-block">
      <div class="buttons">
        <button @click="generarCertificados('cert_alumno')" class="button is-outlined is-primary">
          Certificados de alumado
        </button>
        <button
          @click="generarCertificados('cert_instructor')"
          class="button is-outlined is-primary"
        >
          Certificados de instructores
        </button>
        <button @click="generarCertificados('fm18')" class="button is-outlined is-primary">
          FM18s
        </button>
        <button @click="generarCertificados('cert_alumno')" class="button is-outlined is-primary">
          Etiquetas
        </button>
      </div>
    </div>

    <label class="panel-block has-text-weight-bold is-underlined">
      <input type="checkbox" @click="toggleSelected()" v-model="allSelected" />
      Seleccionar todos / ninguno
      <hr />
    </label>

    <label class="panel-block" v-for="fct of fcts" :key="fct.id">
      <input type="checkbox" v-model="fct.selected" />
      {{ fct.empresa }} - {{ fct.alumno }}
    </label>
</div>
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'

export default {
    data() {
    return {
      allSelected: false,
      fcts: [],
    }
  },
  async created() {
    const FCT = gestionFCTStore()
    this.fcts = await FCT.loadFCTs()
  },
  methods: {
    generarCertificados: function (tipo) {
      const FCT = gestionFCTStore()
      FCT.generarCertificados(tipo)
    },
    toggleSelected() {
      if (this.allSelected) {
          this.allSelected = false
        for (let fct of this.fcts) {
          fct.selected = false
        }
      } else {
        this.allSelected = true
        for (let fct of this.fcts) {
          fct.selected = true
        }
      }
    },
  }
}
</script>

<style></style>
