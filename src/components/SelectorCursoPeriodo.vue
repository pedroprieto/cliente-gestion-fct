<template>
<div>
  <label for="curso" class="label">Curso</label>
</div>
<div class="navbar-item select is-primary">
  <select v-model="FCT.curso" id="curso" @change="navegar()">
    <option v-for="curso of cursos" :value="curso" :key="curso">{{curso}}</option>
  </select>
</div>

<div>
  <label for="periodo" class="label">Período</label>
</div>
<div class="navbar-item select is-primary">
  <select v-model="FCT.periodo" id="periodo" @change="navegar()">
    <option v-for="periodo of periodos" :value="periodo.value" :key="periodo">{{periodo.text}}</option>
  </select>
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
