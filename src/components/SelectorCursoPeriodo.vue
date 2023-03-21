<template>
<div class="navbar-item ">
  <div class="field is-horizontal">
    <div class="field-label is-normal is-hidden-mobile">
      <label for="curso" class="label">Curso</label>
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <div class="select is-primary is-fullwidth">
            <select v-model="FCT.curso" id="curso" @change="navegar()">
              <option v-for="curso of cursos" :value="curso" :key="curso">{{curso}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="navbar-item ">
  <div class="field is-horizontal">
    <div class="field-label is-normal is-hidden-mobile">
      <label for="periodo" class="label">Período</label>
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <div class="select is-primary is-fullwidth">
            <select v-model="FCT.periodo" id="curso" @change="navegar()">
              <option v-for="periodo of periodos" :value="periodo.value" :key="periodo">{{periodo.text}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { CP } from '../aux/cursoperiodo';
import { gestionFCTStore } from '@/stores/gestionfct';

export default {
    data() {
        return {
            cursos: CP.getcursoslist(),
            periodos: CP.getperiodoslist(),
            FCT: gestionFCTStore()
        }
    },
    methods: {
        navegar: async function() {
            this.$router.push({name: this.$route.name, params: {curso: this.FCT.curso, periodo: this.FCT.periodo}})
        }
    }
}
</script>

<style></style>
