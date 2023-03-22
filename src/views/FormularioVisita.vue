<template>
<div class="container">
  <TituloPagina :titulo="titulo"/>
  <form @submit.prevent="crearVisita()">
  <div class="field">
    <label for="tipo" class="label">Tipo</label>
  </div>
  <div class="field select">
    <select @change="cargarEmpresasRelacionadas()" v-model="visit.tipo" id="tipo" :disabled="tipo" required>
      <option v-for="tipo of tipos" :value="tipo" :key="tipo">{{tipo}}</option>
    </select>
  </div>
  <div class="field">
    <label for="distancia" class="label">Distancia</label>
    <div class="control">
      <input required v-model="visit.distancia" id="distancia" class="input" type="number" placeholder="" />
    </div>
  </div>
  <div class="field">
    <label for="fecha" class="label">Fecha</label>
    <div class="control">
      <input required v-model="visit.fecha" id="fecha" class="input" type="date" placeholder="" />
    </div>
  </div>
  <div class="field">
    <label for="hora_salida" class="label">Hora de salida</label>
    <div class="control">
      <input
        required
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
        required
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
      <input required v-model="visit.localidad" id="localidad" class="input" type="text" placeholder="" />
    </div>
  </div>
  
  <div class="field">
    <label for="impresion" class="label">Impresión</label>
    <div class="control">
      <textarea
        required
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
  
  <template v-if="related.length">
    <h2 class="subtitle">Visitas relacionadas</h2>
    <div class="field" v-for="r of related" :key="r.id">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" v-model="r.selected" />
        {{ r.fct.empresa }} - {{r.fct.alumno }} - {{r.fct.nif_alumno}}
      </label>
    </div>
  </div>
  </template>

  <div class="field is-grouped">
    <div class="control">
      <button type="submit" class="button is-primary">Enviar</button>
    </div>
    <div class="control">
      <button type="button" @click="cancelarEdicion()" class="button is-link is-light">Cancelar</button>
    </div>
  </div>
  </form>
</div>
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'
import TituloPagina from '../components/TituloPagina.vue'

export default {
    props: ['fctId', 'tipo'],
    components: {
        TituloPagina
    },
    data() {
        return {
            titulo: "",
            FCT: gestionFCTStore(),
            visita: {},
            fct: {},
            tipos: ['inicial', 'seguimiento', 'final', 'adicional'],
            related: [],
            visit: {
                tipo: '',
                distancia: 0,
                fecha: new Date(),
                hora_salida: '',
                hora_regreso: '',
                localidad: '',
                impresion: '',
                presencial: true
            }
        }
    },
    async created() {
        this.fct = this.FCT.getFCT(this.fctId);
        
        if (this.tipo) {
            // Editando
            this.titulo = `Editando visita ${this.tipo} en: ${this.fct.empresa} - ${this.fct.alumno}`;
            this.visita = this.FCT.getVisit(this.fctId, this.tipo);
            this.visit.tipo = this.visita.tipo;
            this.visit.fecha = this.visita.fecha;
            this.visit.distancia = this.visita.distancia;
            this.visit.hora_salida = this.visita.hora_salida;
            this.visit.hora_regreso = this.visita.hora_regreso;
            this.visit.localidad = this.visita.localidad;
            this.visit.impresion = this.visita.impresion;
            this.visit.presencial = this.visita.presencial;
        } else {
            // Creando
            this.tipos = this.tipos.filter(tipo => {
                if (tipo == 'adicional')
                    return true;
                return !this.fct.visitas.find(v => v.tipo == tipo);
            });
            this.titulo = `Crear visita en: ${this.fct.empresa} - ${this.fct.alumno}`;
        }
    },
    methods: {
        cargarEmpresasRelacionadas: function() {
            this.related = this.FCT.getFCTsMismaEmpresa(this.fct, this.visit.tipo).map(fct => {
                return {
                    fct: fct,
                    selected: true
                }
            });
        },
        cancelarEdicion: function () {
            this.$router.push({name: 'visitas', params: this.$route.params});
        },
        crearVisita: async function () {
            if (!this.tipo) {
                // TODO: Añadir related. ¿Mejorar?
                this.visit.related = this.related.reduce((res, r) => {
                    if (r.selected) {
                    res.push(r.fct.id);
                    }
                return res;
            }, []);
            await this.FCT.addVisit(this.visit, this.fct)
            this.FCT.enviarMensaje("Visita añadida con éxito.", false);
        } else {
            await this.FCT.updateVisit(this.visita, this.visit, this.fct)
            this.FCT.enviarMensaje("Visita modificada con éxito.", false);
        }
        this.$router.replace({name: 'visitas', params: this.$route.params});
    }
  }
}
</script>

<style></style>
