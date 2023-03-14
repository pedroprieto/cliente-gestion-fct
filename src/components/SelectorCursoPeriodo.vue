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
    mounted() {
        const FCT = gestionFCTStore();
        this.curso = FCT.curso;
        this.periodo = FCT.periodo;
        this.$watch(
            () => this.$route.query.curso,
            async (newCurso) => {
                this.curso = cursoPeriodoStore().getcursoslist().includes(curso) ? newCurso : cursoPeriodoStore().getCursoActual();
                // this.curso = newCurso;
                FCT.updateCurso(this.curso);
                // TODO: redirect a válida. Igual con before hook de router
                // this.$router.push({path: this.$route.path, query: {curso: this.curso, periodo: this.periodo.value}})
            }
        );
        this.$watch(
            () => this.$route.query.periodo,
            async (newPeriodo) => {
                const cursoperiodo = cursoPeriodoStore();
                console.log(newPeriodo);
                this.periodo = cursoperiodo.getPeriodoFromCode(newPeriodo);
                FCT.updatePeriodo(this.periodo);
            }
        );
        const cursoperiodo = cursoPeriodoStore();
        this.cursos = cursoperiodo.getcursoslist();
        this.periodos = cursoperiodo.getperiodoslist();
    },
    methods: {
        navegar: function() {
            const FCT = gestionFCTStore();
            FCT.updateCurso(this.curso);
            FCT.updatePeriodo(this.periodo);
            this.$router.push({path: this.$route.path, query: {curso: this.curso, periodo: this.periodo.value}})

        }
    }
}
</script>

<style></style>
