<template>
<div class="field">
  <button @click="addVisita(fct)" class="button is-primary is-centered">
    <span class="icon">
      <svg-icon class="mdi" type="mdi" :path="mdiPlus"></svg-icon>
    </span>
    <span>
      Añadir visita
    </span>
  </button>
</div>


<div class="box" v-for="visit of fct.visitas" :key="visit.id">
  <div class="columns is-multiline">
    <div class="column is-2">
      <abbr title="Tipo">Tp.</abbr> <b>{{visit.tipo}}</b>
    </div>
    <div class="column is-2">
      <abbr title="Fecha">F.</abbr> <b>{{new Date(visit.fecha).toLocaleDateString()}}</b>
    </div>
    <div class="column is-2">
      <abbr title="Hora de salida">H. sal.</abbr> <b>{{visit.hora_salida}}</b>
    </div>
    <div class="column is-2">
      <abbr title="Hora de regreso">H. reg.</abbr> <b>{{visit.hora_regreso}}</b>
    </div>
    <div class="column is-1">
      <abbr title="Distancia">Dist.</abbr> <b>{{visit.distancia}}</b>
    </div>
    <div class="column is-2">
      <abbr title="Localidad">Loc.</abbr> <b>{{visit.localidad}}</b>
    </div>
    <div class="column is-1">
      <abbr title="Presencial">Pres.</abbr> <b>{{visit.presencial ? 'Sí' : 'No'}}</b>
    </div>
    <div class="column is-10">
      <abbr title="Impresión">Imp.</abbr> <b>{{visit.impresion}}</b>
    </div>
    <div class="column is-2">
      <div class="buttons is-justify-content-flex-end">
        <button title="Editar" type="button" class="button is-primary is-outlined" @click="editarVisita(fct, visit)">
          <span class="icon">
            <svg-icon class="mdi" type="mdi" :path="mdiPencil"></svg-icon>
          </span>
        </button>
        <button title="Borrar" type="button" class="button is-danger" @click="borrarVisita(fct, visit)">
          <span class="icon">
            <svg-icon class="mdi" type="mdi" :path="mdiTrashCanOutline"></svg-icon>
          </span>
        </button>
      </div>
    </div>
  </div>
</div>


<!-- <div class="table-container box"> -->
  <!-- <table class="table"> -->
    <!--   <thead> -->
      <!--     <th> -->
        <!--       Tipo  -->
        <!--     </th> -->
      <!--     <th> -->
        <!--       Fecha -->
        <!--     </th> -->
      <!--     <th> -->
        <!--       H. salida -->
        <!--     </th> -->
      <!--     <th> -->
        <!--       H. regreso -->
        <!--     </th> -->
      <!--     <th> -->
        <!--       Distancia -->
        <!--     </th> -->
      <!--     <th> -->
        <!--       Localidad  -->
        <!--     </th> -->
      <!--     <th> -->
        <!--       Presencial -->
        <!--     </th> -->
      <!--     <th> -->
        <!--       Impresión -->
        <!--     </th> -->
      <!--     <th> -->
        <!--       Editar -->
        <!--     </th> -->
      <!--     <th> -->
        <!--       Borrar -->
        <!--     </th> -->
      <!--   </thead> -->
    <!--   <tbody> -->
      <!--     <tr v-for="visit of fct.visitas" :key="visit.id"> -->
        <!--       <td> -->
          <!--         {{visit.tipo}} -->
          <!--       </td> -->
        <!--       <td> -->
          <!--         {{new Date(visit.fecha).toLocaleDateString()}} -->
          <!--       </td> -->
        <!--       <td> -->
          <!--         {{visit.hora_salida}} -->
          <!--       </td> -->
        <!--       <td> -->
          <!--         {{visit.hora_regreso}} -->
          <!--       </td> -->
        <!--       <td> -->
          <!--         {{visit.distancia}} -->
          <!--       </td> -->
        <!--       <td> -->
          <!--         {{visit.localidad}} -->
          <!--       </td> -->
        <!--       <td> -->
          <!--         {{visit.presencial ? 'Sí' : 'No'}} -->
          <!--       </td> -->
        <!--       <td> -->
          <!--         {{visit.impresion}} -->
          <!--       </td> -->
        <!--       <td> -->
          <!--         <button type="button" class="button is-primary is-outlined" @click="editarVisita(fct, visit)"> -->
            <!--           <span class="icon"> -->
              <!--             <svg-icon class="mdi" type="mdi" :path="mdiPencil"></svg-icon> -->
              <!--           </span> -->
            <!--         </button> -->
          <!--       </td> -->
        <!--       <td> -->
          <!--         <button type="button" class="button is-danger" @click="borrarVisita(fct, visit)"> -->
            <!--           <span class="icon"> -->
              <!--             <svg-icon class="mdi" type="mdi" :path="mdiTrashCanOutline"></svg-icon> -->
              <!--           </span> -->
            <!--         </button> -->
          <!--       </td> -->
        <!--     </tr> -->
      <!--   </tbody> -->
    <!-- </table>   -->
  <!-- </div> -->
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiTrashCanOutline, mdiPencil, mdiPlus} from '@mdi/js'

export default {
    props: ['fct'],
    components: {
        SvgIcon
    },
    data() {
        return {
            mdiTrashCanOutline,
            mdiPencil,
            mdiPlus,
            FCT: gestionFCTStore(), 
        }
    },
    methods: {
        addVisita: function(fct) {
            this.$router.push({name: 'anyadirVisita', params: {fctId: fct.id} });
        },
        editarVisita: function(fct, visita) {
            this.$router.push({name: 'editarVisita', params: {fctId: fct.id, tipo: visita.tipo} });
        },
        borrarVisita: async function (fct, visita) {
            if (confirm("¿Desea eliminar la visita?")) {
                this.FCT.deleteVisit(fct, visita).then(respuesta => {
                    this.FCT.enviarMensaje("Visita borrada con éxito", false);
                    this.$router.push({name: 'visitas', params: this.$route.params });
                }).catch(error => {
                    console.log("error");
                    this.FCT.enviarMensaje(error, true);
                });
            }
        }
    }
}
</script>

<style></style>
