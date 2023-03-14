<template>
<div class="field">
  <label for="tipo" class="label">Tipo</label>
</div>
<div class="field select">
  <select v-model="visit.tipo" id="tipo">
    <option v-for="tipo of tipos" :value="tipo" :key="tipo">{{tipo}}</option>
  </select>
</div>
  <div class="field">
    <label for="distancia" class="label">Distancia</label>
    <div class="control">
      <input v-model="visit.distancia" id="distancia" class="input" type="number" placeholder="" />
    </div>
  </div>

  <div class="field">
    <label for="fecha" class="label">Fecha</label>
    <div class="control">
      <input v-model="visit.fecha" id="fecha" class="input" type="date" placeholder="" />
    </div>
  </div>

  <div class="field">
    <label for="hora_salida" class="label">Hora de salida</label>
    <div class="control">
      <input
        v-model="visit.hora_salida"
        id="hora_salida"
        class="input"
        type="time"
        placeholder=""
      />
    </div>
  </div>

  <div class="field">
    <label for="hora_regreso" class="label">Hora de regreso</label>
    <div class="control">
      <input
        v-model="visit.hora_regreso"
        id="hora_regreso"
        class="input"
        type="time"
        placeholder=""
      />
    </div>
  </div>

  <div class="field">
    <label for="localidad" class="label">Localidad</label>
    <div class="control">
      <input v-model="visit.localidad" id="localidad" class="input" type="text" placeholder="" />
    </div>
  </div>

  <div class="field">
    <label for="impresion" class="label">Impresión</label>
    <div class="control">
      <textarea
        v-model="visit.impresion"
        class="textarea"
        id="impresion"
        type="text"
        placeholder=""
      ></textarea>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" v-model="visit.presencial" />
        Presencial
      </label>
    </div>
  </div>

  <div class="field is-grouped">
    <div class="control">
      <button @click="crearVisita()" class="button is-primary">Submit</button>
    </div>
    <div class="control">
      <button @click="cancelarEdicion()" class="button is-link is-light">Cancel</button>
    </div>
  </div>
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'

export default {
  props: ['fct', 'visita'],
  components: {},
  data() {
    return {
        tipos: ['inicial', 'seguimiento', 'final', 'adicional'],
      visit: {
        editing: false,
        tipo: '',
        distancia: 0,
        fecha: new Date(),
        hora_salida: '',
        hora_regreso: '',
        localidad: this.fct.localidad,
        impresion: '',
        presencial: true
      }
    }
  },
  async created() {
    if (this.visita) {
      this.editing = true
      this.visit = this.visita
    }
      this.tipos = this.tipos.filter(tipo => {
          if (tipo == 'adicional')
return true;              
          return !this.fct.visitas.find(v => v.tipo == tipo);


          

          });
  },
  methods: {
    cancelarEdicion: function () {
      this.$emit('cerrar')
    },
    crearVisita: function () {
      this.$emit(
        'enviar',
          this.visit,
        this.editing
      )
    }
  }
}
</script>

<style></style>
