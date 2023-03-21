<template>
  <div class="level">
    <div class="level-left ">
      <button @click="FCT.importarFCTs()" class="button is-primary is-centered">
        <span class="icon">
          <svg-icon class="mdi" type="mdi" :path="mdiDownload"></svg-icon>
        </span>
        <span>
          Importar FCTs
        </span>
      </button>
    </div>
    <div class="buttons level-right">
      <button :disabled="!anySelected" @click="generarCertificados('cert_alumno')" class="button is-outlined is-primary">
        <span class="icon">
          <svg-icon class="mdi" type="mdi" :path="mdiAccountSchool"></svg-icon>
        </span>
        <span>
          Certificados de alumado
        </span>
      </button>
      <button
        :disabled="!anySelected"
        @click="generarCertificados('cert_instructor')"
        class="button is-outlined is-primary"
        >
        <span class="icon">
          <svg-icon class="mdi" type="mdi" :path="mdiHumanMaleBoard"></svg-icon>
        </span>
        <span>
          Certificados de instructores
        </span>
      </button>
      <button :disabled="!anySelected" @click="generarCertificados('fm18')" class="button is-outlined is-primary">
        <span class="icon">
          <svg-icon class="mdi" type="mdi" :path="mdiClipboardListOutline"></svg-icon>
        </span>
        <span>
          FM18s
        </span>
      </button>
      <button :disabled="!anySelected" @click="mostrarEtiquetas()" class="button is-outlined is-primary">
        <span class="icon">
          <svg-icon class="mdi" type="mdi" :path="mdiLabelOutline"></svg-icon>
        </span>
        <span>
          Etiquetas
        </span>
      </button>
    </div>
  </div>

<div class="table-container box">
  <table class="table is-hoverable">
    <thead>
      <th>
        <input type="checkbox" @click="toggleSelected()" v-model="allSelected" />
      </th>
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
      <tr v-for="fct of FCT.fcts" :key="fct.id" @click="selectRow(fct)">
        <td>
          <input type="checkbox" v-model="fct.selected" @change="checkAll()"/>
        </td>
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
          <button class="button is-link" @click.stop="generarCertificado('cert_alumno', fct)">
            <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiAccountSchool"></svg-icon>
            </span>
          </button>
        </td>
        <td>
        <button class="button is-link" @click.stop="generarCertificado('cert_instructor', fct)">
          <span class="icon">
            <svg-icon class="mdi" type="mdi" :path="mdiHumanMaleBoard"></svg-icon>
          </span>
        </button>
        </td>
        <td>
        <button class="button is-link" @click.stop="generarCertificado('fm18', fct)">
          <span class="icon">
            <svg-icon class="mdi" type="mdi" :path="mdiClipboardListOutline"></svg-icon>
          </span>
        </button>
        </td>
        <td>
        <button class="button is-link" @click.stop="generarEtiqueta(fct)">
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
import { mdiAccount, mdiLock, mdiAccountSchool, mdiHumanMaleBoard, mdiClipboardListOutline, mdiLabelOutline, mdiTrainCar, mdiTrashCanOutline, mdiDownload} from '@mdi/js'

export default {
    computed: {
        anySelected: function() {
            return this.FCT.fcts.filter(f => f.selected).length;
        }
    },
    components: {
        SvgIcon
    },
    data() {
        return {
            allSelected: false,
            mdiAccount,
            mdiLock,
            mdiAccountSchool,
            mdiHumanMaleBoard,
            mdiLabelOutline,
            mdiTrainCar,
            mdiClipboardListOutline,
            mdiTrashCanOutline,
            mdiDownload,
            FCT: gestionFCTStore(), 
            visitaEditar: null
        }
    },
    methods: {
        selectRow: function(fct) {
            fct.selected = !fct.selected;
            this.checkAll();
        },
        checkAll: function() {
            if ((this.FCT.fcts.filter(f => f.selected)).length == this.FCT.fcts.length) {
                this.allSelected = true;
            } else {
                this.allSelected = false;
            }
        },
        mostrarEtiquetas: function() {
            this.$router.push({name: 'etiquetas', params: this.$route.params});
        },
        generarCertificados: function (tipo) {
            this.FCT.generarCertificados(tipo)
        },
        toggleSelected() {
            if (this.allSelected) {
                this.allSelected = false
                for (let fct of this.FCT.fcts) {
                    fct.selected = false
                }
            } else {
                this.allSelected = true
                for (let fct of this.FCT.fcts) {
                    fct.selected = true
                }
            }
        },
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

<style>
  tbody tr {
  cursor: pointer;
  }
</style>
