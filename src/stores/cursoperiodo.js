import { defineStore } from 'pinia'

export const cursoPeriodoStore = defineStore('cursoperiodo', {
    actions: {
        getcursoslist: function () {
            var curso_inicial = 2012;
            var now = new Date();
            var curso_final = now.getFullYear();
            var mes_actual = now.getMonth() + 1;

            var cps = [];
            
            for (let i = curso_inicial; i <= curso_final; i++) {
                let valor = (i - 1) + '-' + (i);
                cps.push(valor)
            }

            if (mes_actual >= 7) {

                let valor = (curso_final) + '-' + (curso_final + 1);
                cps.push(valor)
            }

            return cps;
        },
        getperiodoslist: function () {
            //return [1,2];
            // Cambian a 5, 6 y -1 (todos)
            var ps = [];

            var c1 = {};
            c1.value = "5";
            c1.text = "Ordinario";

            var c2 = {};
            c2.value = "6";
            c2.text = "Extraordinario";

            var todos = {};
            todos.value = "-1";
            todos.text = "Todos";

            ps.push(c1);
            ps.push(c2);
            ps.push(todos);

            return ps;

        },


        getCursoActual: function () {
            var now = new Date();
            var curso_final = now.getFullYear();
            var mes_actual = now.getMonth() + 1;

            if (mes_actual >= 7) {
                return (curso_final) + '-' + (curso_final + 1);
            } else {
                return (curso_final - 1) + '-' + (curso_final);
            }
        },
        getPeriodoActual: function () {
            var now = new Date();
            var mes_actual = now.getMonth() + 1;
            let value;
            
            if (mes_actual >= 7) {
                value = 6;
            } else {
                value = 5;
            return this.getperiodoslist().find(p => p.value == value);
            }
        },
        getPeriodoFromCode: function (codigo) {
            return this.getperiodoslist().find(function (el) {
                return el.value == codigo;
            });

        }
    }
})
