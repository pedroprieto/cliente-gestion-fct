<template>
<div class="panel">
  <div class="panel-block">
    <div class="buttons">
      <button :disabled="!anySelected" @click="generarCertificados('cert_alumno')" class="button is-outlined is-primary">
        Certificados de alumado
      </button>
      <button
        :disabled="!anySelected"
        @click="generarCertificados('cert_instructor')"
        class="button is-outlined is-primary"
        >
        Certificados de instructores
      </button>
      <button :disabled="!anySelected" @click="generarCertificados('fm18')" class="button is-outlined is-primary">
        FM18s
      </button>
      <button :disabled="!anySelected" @click="mostrarEtiquetas()" class="button is-outlined is-primary">
        Etiquetas
      </button>
    </div>
  </div>
  
  <label class="panel-block has-text-weight-bold is-underlined">
    <input type="checkbox" @click="toggleSelected()" v-model="allSelected" />
    Seleccionar todos / ninguno
    <hr />
  </label>
  
  <label class="panel-block" v-for="fct of FCT.fcts" :key="fct.id">
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
            FCT: gestionFCTStore()
        }
    },
    computed: {
        anySelected: function() {
            return this.FCT.fcts.filter(f => f.selected).length;
        }
    },
    methods: {
        mostrarEtiquetas: function() {
            this.$router.push({name: 'etiquetas', params: this.$route.params});
        },
        generarCertificados: function (tipo) {
            this.FCT.generarCertificados(tipo)
        },
        toggleSelected() {
            if (this.allSelected) {
                this.allSelected = false
                for (let fct of this.FCT.fcts) {
                    fct.selected = false
                }
            } else {
                this.allSelected = true
                for (let fct of this.FCT.fcts) {
                    fct.selected = true
                }
            }
        },
    }
}
</script>

<style></style>
