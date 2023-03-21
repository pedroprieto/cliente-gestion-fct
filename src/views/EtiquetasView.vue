<template>
  <div>
    <NavBar/>
<div class="container">
  <TituloPagina titulo="Etiquetas"/>
  <div id="control" class="box">
    <div class="columns">
    <div class="control column is-narrow">
      <button type="button" @click="volver()" class="button is-link is-light">
        <span class="icon">
          <svg-icon class="mdi" type="mdi" :path="mdiArrowLeft"></svg-icon>
        </span>
        <span>
          Volver al listado de FCTs
        </span>
      </button>
    </div>
    <div class="column">
      <div class="field is-horizontal">
      <div class="field-label is-normal is-fullwidth">
        <label for="offset" class="label">Comenzar en:</label>
      </div>
      <div class="field-body">
        <div class="field  is-narrow">
          <div class="control ">
            <input v-model="offset" min="0" max="24" id="offset" class="input is-primary" type="number"/>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div class="control column is-narrow">
            <button @click="imprimir()" type="button" class="button is-primary is-fullwidth">
              <span class="icon">
                <svg-icon class="mdi" type="mdi" :path="mdiPrinterOutline"></svg-icon>
              </span>
              <span>
                Imprimir etiquetas
              </span>
            </button>
    </div>
    </div>
  </div>
  <div class="etiquetas box">
    <div v-for="n in offset" class="etiqueta vacia" :key="n">
    </div>
    <div v-for="fct of fcts" class="etiqueta rellena" :key="fct.id">
      <div class="etiqueta_content">
	<span class="titulo">Alumno:</span> <span class="valor">{{fct.alumno}}</span><br>
	<span class="titulo">Empresa:</span> <span class="valor">{{fct.empresa}}</span><br>
	<span class="titulo">Tutor:</span> <span class="valor">{{fct.tutor}}</span><br>
	<span class="titulo">Ciclo:</span> <span class="valor ciclo">{{fct.ciclo}}</span>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeft, mdiPrinterOutline } from '@mdi/js'
import NavBar from '../components/NavBar.vue'
import TituloPagina from '../components/TituloPagina.vue'

export default {
    components: {
        SvgIcon,
        NavBar,
        TituloPagina
    },
    data() {
        return {
            mdiArrowLeft,
            mdiPrinterOutline,
            fcts: gestionFCTStore().fcts.filter(f => f.selected),
            offset: 0,
        }
    },
    methods: {
        volver: function() {
            this.$router.push({name: 'fcts', params: this.$route.params});
        },
        imprimir: function() {
            window.print();
        }
    }
}
</script>

<style scoped>
@page  
{ 
    size: A4;   /* auto is the initial value */ 
    /* this affects the margin in the printer settings */
    margin: 0;
} 

body {
    /* A4: 210 × 297*/
    width: 210mm;
    height: 297mm;
    padding: 0;
    font: 8.5pt sans-serif;
    margin: 0;
    margin-left: 2mm;
}

.etiquetas{
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    width: 210mm;
    padding: 0;
}

.etiqueta{
    font-size: 8.5pt;
    box-sizing: border-box;
    flex: 0 1 auto;
    width: 69.9mm; /*3 etiquetas a lo ancho */
    height: 37mm; /* 8 etiquetas a lo alto */
    padding: 1mm;
    margin: 0cm; /* Sin márgenes */
    text-align: left;
    overflow: hidden;
    outline: 1px dotted; /* outline doesn't occupy space like border does */
    display: flex;
    justify-content: center;
    line-height: 1.8em;
}

.etiqueta_content {
    align-self: center;
}

.titulo {
    display: inline-block;
    width: 5em;
    text-decoration: underline;
}

.valor {
    display: inline-block;
    width: 16em;
    vertical-align: middle;
    
}

.ciclo {
    font: 8pt sans-serif;
}

@media print {
    header {
        display: none;
    }
    
    #control {
	display: none;
    }
}
</style>
