<template>
  <div class="field">
    <button @click="addVisita(fct)" class="button is-primary is-centered">
      <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiPencil"></svg-icon>
            </span>
      <span>

    Añadir visita
      </span>
  </button>
    
  </div>
  <div class="table-container">
  <table class="table">
    <thead>
      <th>
        Tipo 
      </th>
      <th>
        Fecha
      </th>
      <th>
        H. salida
      </th>
      <th>
        H. regreso
      </th>
      <th>
        Distancia
      </th>
      <th>
        Localidad 
      </th>
      <th>
        Presencial
      </th>
      <th>
        Impresión
      </th>
      <th>
        Editar
      </th>
      <th>
        Borrar
      </th>
    </thead>
    <tbody>
      <tr v-for="visit of fct.visitas" :key="visit.id">
        <td>
          {{visit.tipo}}
        </td>
        <td>
          {{new Date(visit.fecha).toLocaleDateString()}}
        </td>
        <td>
          {{visit.hora_salida}}
        </td>
        <td>
          {{visit.hora_regreso}}
        </td>
        <td>
          {{visit.distancia}}
        </td>
        <td>
          {{visit.localidad}}
        </td>
        <td>
          {{visit.presencial ? 'Sí' : 'No'}}
        </td>
        <td>
          {{visit.impresion}}
        </td>
        <td>
          <button class="button is-primary is-outlined" @click="editarVisita(fct, visit)">
            <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiPencil"></svg-icon>
            </span>
          </button>
        </td>
        <td>
          <button class="button is-danger" @click="borrarVisita(fct, visit)">
            <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiTrashCanOutline"></svg-icon>
            </span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>  
  </div>
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
