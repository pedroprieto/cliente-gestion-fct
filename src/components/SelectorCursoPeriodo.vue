<template>
<div>
  <label for="curso" class="label">Curso</label>
</div>
<div class="navbar-item select">
  <select v-model="curso" id="curso" @change="navegar()">
    <option v-for="curso of cursos" :value="curso" :key="curso">{{curso}}</option>
  </select>
</div>

<div>
  <label for="periodo" class="label">Período</label>
</div>
<div class="navbar-item select">
  <select v-model="periodo.value" id="periodo" @change="navegar()">
    <option v-for="periodo of periodos" :value="periodo.value" :key="periodo">{{periodo.text}}</option>
  </select>
</div>
</template>

<script>
import { cursoPeriodoStore } from '@/stores/cursoperiodo';
import { gestionFCTStore } from '@/stores/gestionfct';

export default {
    data() {
        return {
            cursos: [],
            periodos: [],
            curso: "",
            periodo: {}
        }
    },
    async mounted() {
        const FCT = gestionFCTStore();
        const cursoperiodo = cursoPeriodoStore();

        this.cursos = cursoperiodo.getcursoslist();
        this.periodos = cursoperiodo.getperiodoslist();

        if ((!FCT.curso) || (!FCT.periodo)) {
            // Si no está cargado curso o período en el estado
            // Curso y período actual: a partir de query o curso por defecto
            this.curso = cursoperiodo.getCurso(this.$route.query.curso);
            this.periodo = cursoperiodo.getPeriodoFromCode(this.$route.query.periodo);
            FCT.updateCurso(this.curso);
            FCT.updatePeriodo(this.periodo);
            await FCT.loadFCTs();
        } else {
            this.curso = FCT.curso;
            this.periodo = FCT.periodo;
        }
    },
    methods: {
        navegar: async function() {
            const FCT = gestionFCTStore();
            this.$router.push({path: this.$route.path, query: {curso: this.curso, periodo: this.periodo.value}})
            FCT.updateCurso(this.curso);
            FCT.updatePeriodo(this.periodo);
            await FCT.loadFCTs();
        }
    }
}
</script>

<style></style>
