<template>
<div class="panel">
  <div class="panel-block">
    <button :disabled="!anySelected" @click="FCT.generarFM34s()" class="button is-primary">
      Generar
    </button>
  </div>
  <label class="panel-block has-text-weight-bold is-underlined">
    <input type="checkbox" @click="toggleSelected()" v-model="allSelected" />
    Seleccionar todos / ninguno
    <hr />
  </label>
  
  <label class="panel-block" v-for="fm34 of FCT.fm34s" :key="fm34.fechaDesde">
    <input type="checkbox" v-model="fm34.selected" @change="checkAll"/>
    Semana de {{ new Date(fm34.start).toLocaleDateString('es') }} a {{ new Date(fm34.end).toLocaleDateString('es') }}
  </label>
</div>
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'

export default {
    data() {
        return {
            FCT: gestionFCTStore(),
            allSelected: false,
        }
    },
    computed: {
        anySelected: function() {
            return this.FCT.fm34s.filter(f => f.selected).length;
        }
    },
    methods: {
        checkAll: function() {
            if ((this.FCT.fm34s.filter(f => f.selected)).length == this.FCT.fm34s.length) {
                this.allSelected = true;
            } else {
                this.allSelected = false;
            }
        },
        toggleSelected() {
      if (this.allSelected) {
          this.allSelected = false
        for (let fm34 of this.FCT.fm34s) {
          fm34.selected = false
        }
      } else {
        this.allSelected = true
        for (let fm34 of this.FCT.fm34s) {
          fm34.selected = true
        }
      }
    },
  }
}
</script>

<style></style>
