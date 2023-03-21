<template>
<div class="table-container">
  <table class="table">
    <thead>
      <th>
        Empresa
      </th>
      <th>
        Alumno
      </th>
      <th>
        F. inicio
      </th>
      <th>
        F. fin
      </th>
      <th>
        Instructor
      </th>
      <th>
        Localidad
      </th>
      <th>
        Dirección
      </th>
      <th>
        <abbr title="Visitas">Visitas</abbr>
      </th>
      <th>
        <abbr title="Certificado de alumno">C. al.</abbr>
      </th>
      <th>
        <abbr title="Certificado de instructor">C. in.</abbr>
      </th>
      <th>
        FM18
      </th>
      <th>
        <abbr title="Etiqueta">Et.</abbr>
      </th>
      <th>
        Eliminar
      </th>
    </thead>
    <tbody>
      <tr v-for="fct of FCT.fcts" :key="fct.id">
        <td>
          {{fct.empresa}}
        </td>
        <td>
          {{fct.alumno}}
        </td>
        <td>
          {{new Date(fct.fecha_inicio).toLocaleDateString()}}
        </td>
        <td>
          {{new Date(fct.fecha_fin).toLocaleDateString()}}
        </td>
        <td>
          {{fct.instructor}}
        </td>
        <td>
          {{fct.localidad}}
        </td>
        <td>
          {{fct.dir_empresa}}
        </td>
        <td>
          <button class="button is-primary" @click="mostrarVisitas(fct)">
            <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiTrainCar"></svg-icon>
            </span>
          </button>
        </td>
        <td>
          <button class="button is-link" @click="generarCertificado('cert_alumno', fct)">
            <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiAccountSchool"></svg-icon>
            </span>
          </button>
        </td>
        <td>
        <button class="button is-link" @click="generarCertificado('cert_instructor', fct)">
          <span class="icon">
            <svg-icon class="mdi" type="mdi" :path="mdiHumanMaleBoard"></svg-icon>
          </span>
        </button>
        </td>
        <td>
        <button class="button is-link" @click="generarCertificado('fm18', fct)">
          <span class="icon">
            <svg-icon class="mdi" type="mdi" :path="mdiClipboardListOutline"></svg-icon>
          </span>
        </button>
        </td>
        <td>
        <button class="button is-link" @click="generarEtiqueta(fct)">
          <span class="icon">
            <svg-icon class="mdi" type="mdi" :path="mdiLabelOutline"></svg-icon>
          </span>
        </button>
        </td>
        <td>
          <button class="button is-danger" @click="borrarFCT(fct)">
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
import { mdiAccount, mdiLock, mdiAccountSchool, mdiHumanMaleBoard, mdiClipboardListOutline, mdiLabelOutline, mdiTrainCar, mdiTrashCanOutline} from '@mdi/js'

export default {
    components: {
        SvgIcon
    },
    data() {
        return {
            mdiAccount,
            mdiLock,
            mdiAccountSchool,
            mdiHumanMaleBoard,
            mdiLabelOutline,
            mdiTrainCar,
            mdiClipboardListOutline,
            mdiTrashCanOutline,
            FCT: gestionFCTStore(), 
            visitaEditar: null
        }
    },
    methods: {
        mostrarVisitas: function(fct) {
            this.$router.push({name: 'visitas', params: {fctId: fct.id} });
        },
        changeTab: function (fct, tab) {
            fct.selectedTab = tab
        },
        borrarFCT: async function (fct) {
            if (confirm("¿Desea eliminar la FCT? Se borrarán también las visitas asociadas.")) {
                this.FCT.deleteFCT(fct).then(respuesta => {
                    this.FCT.enviarMensaje("FCT borrada con éxito", false);
                }).catch(error => {
                    console.log("error");
                    this.FCT.enviarMensaje(error, true);
                    });
            }
        },
        generarEtiqueta: function(fct) {
            this.FCT.resetSeleccion();
            fct.selected = true;
            this.$router.push('etiquetas', {params: this.$route.params});
         },
        generarCertificado: function (tipo, fct) {
            this.FCT.generarCertificados(tipo, fct)
    }
  }
}
</script>

<style></style>
