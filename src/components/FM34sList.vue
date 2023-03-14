<template>
<div class="panel">

  <div class="panel-block">
    <button @click="generarFM34s()" class="button is-primary is-fullwidth">
          Generar
        </button>
      </div>
  
    <label class="panel-block has-text-weight-bold is-underlined">
      <input type="checkbox" @click="toggleSelected()" v-model="allSelected" />
      Seleccionar todos / ninguno
      <hr />
    </label>

    <label class="panel-block" v-for="fm34 of fm34s" :key="fm34.fechaDesde">
      <input type="checkbox" v-model="fm34.selected" />
      Semana de {{ new Date(fm34.start).toLocaleDateString('es') }} a {{ new Date(fm34.end).toLocaleDateString('es') }}
    </label>
</div>
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'

export default {
    data() {
    return {
      allSelected: false,
      fm34s: [],
    }
  },
  async created() {
    const FCT = gestionFCTStore()
    this.fm34s = await FCT.getFM34s()
  },
  methods: {
      generarFM34s: function (tipo) {
      const FCT = gestionFCTStore();
          FCT.generarFM34s();
    },
    toggleSelected() {
      if (this.allSelected) {
          this.allSelected = false
        for (let fm34 of this.fm34s) {
          fm34.selected = false
        }
      } else {
        this.allSelected = true
        for (let fm34 of this.fm34s) {
          fm34.selected = true
        }
      }
    },
  }
}
</script>

<style></style>
