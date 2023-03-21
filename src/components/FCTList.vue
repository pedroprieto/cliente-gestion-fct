<template>
  <div class="level">
    <div class="level-left ">
      <div class="level-item">
        <button @click="FCT.importarFCTs()" class="button is-primary">
          <span class="icon">
            <svg-icon class="mdi" type="mdi" :path="mdiDownload"></svg-icon>
          </span>
          <span>
            Importar FCTs
          </span>
        </button>
      </div>
      <div class="level-item">
        <div class="control has-icons-left">
          <input class="input" name="" type="text" v-model="query" placeholder="Buscar..." />
          <span class="icon is-left">
            <svg-icon class="mdi" type="mdi" :path="mdiMagnify"></svg-icon>
          </span>
        </div>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <button :disabled="!anySelected" @click="FCT.generarCertificados('cert_alumno')" class="button is-outlined is-primary">
        <span class="icon">
          <svg-icon class="mdi" type="mdi" :path="mdiAccountSchool"></svg-icon>
        </span>
        <span>
          Certificados de alumado
        </span>
      </button>
      </div>
      <div class="level-item">
        <button
        :disabled="!anySelected"
        @click="FCT.generarCertificados('cert_instructor')"
        class="button is-outlined is-primary"
        >
        <span class="icon">
          <svg-icon class="mdi" type="mdi" :path="mdiHumanMaleBoard"></svg-icon>
        </span>
        <span>
          Certificados de instructores
        </span>
      </button>
      </div>
      <div class="level-item">
        <button :disabled="!anySelected" @click="FCT.generarCertificados('fm18')" class="button is-outlined is-primary">
        <span class="icon">
          <svg-icon class="mdi" type="mdi" :path="mdiClipboardListOutline"></svg-icon>
        </span>
        <span>
          FM18s
        </span>
      </button>
      </div>
      <div class="level-item">
        <button :disabled="!anySelected" @click="generarEtiquetas()" class="button is-outlined is-primary">
          <span class="icon">
            <svg-icon class="mdi" type="mdi" :path="mdiLabelOutline"></svg-icon>
          </span>
          <span>
            Etiquetas
          </span>
        </button>
      </div>
    </div>
  </div>
  
  <div @click="selectRow(fct)" class="box cursorPointer" :class="{'is-selected': fct.selected}" v-for="fct of filteredFCTs" :key="fct.id">
    <div class="columns is-multiline is-align-items-center">
      <div class="column cursorPointer is-narrow">
        <input type="checkbox" v-model="fct.selected" @change="checkAll()"/>
    </div>
      <div class="columns column is-multiline">
      
        <div class="column is-3">
          <abbr title="Empresa">Emp.</abbr> <b>{{fct.empresa}}</b>
        </div>
        <div class="column is-3">
          <abbr title="Alumn@">Al.</abbr> <b>{{fct.alumno}}</b>
        </div>
        <div class="column is-2">
          <abbr title="Fecha de inicio">F. ini.</abbr> <b>{{new Date(fct.fecha_inicio).toLocaleDateString()}}</b>
        </div>
        <div class="column is-2">
          <abbr title="Fecha de finalización">F. fin.</abbr> <b>{{new Date(fct.fecha_fin).toLocaleDateString()}}</b>
        </div>
        <div class="column is-2">
          <abbr title="Instructor">Inst.</abbr> <b>{{fct.instructor}}</b>
        </div>
        <div class="column is-3">
          <span class="tags">
            <span class="tag" :class="{'is-success': fct.visita_ini, 'is-warning': !fct.visita_ini}">Inicial</span>
            <span class="tag" :class="{'is-success': fct.visita_seg, 'is-warning': !fct.visita_seg}">Seguimiento</span>
            <span class="tag" :class="{'is-success': fct.visita_fin, 'is-warning': !fct.visita_fin}">Final</span>
          </span>
        </div>
        <div class="column is-3">
          <abbr title="Dirección">Dir.</abbr> <b>{{fct.dir_empresa}}</b>
        </div>
        <div class="column is-1">
          <abbr title="Localidad">Loc.</abbr> <b>{{fct.localidad}}</b>
        </div>
        <div class="column is-5">
          <div class="buttons is-justify-content-flex-end">
            <button title="Mostrar visitas" class="button is-primary" @click="mostrarVisitas(fct)">
              <span class="icon">
                  <svg-icon class="mdi" type="mdi" :path="mdiTrainCar"></svg-icon>
              </span>
            </button>
            <button title="Certificado de alumno" class="button is-info" @click.stop="FCT.generarCertificados('cert_alumno', fct)">
            <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiAccountSchool"></svg-icon>
            </span>
          </button>
          <button title="Certificado de instructor" class="button is-info" @click.stop="FCT.generarCertificados('cert_instructor', fct)">
            <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiHumanMaleBoard"></svg-icon>
            </span>
          </button>
          <button title="FM18" class="button is-info" @click.stop="FCT.generarCertificados('fm18', fct)">
            <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiClipboardListOutline"></svg-icon>
            </span>
          </button>
          <button title="Etiqueta" class="button is-info" @click.stop="generarEtiqueta(fct)">
            <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiLabelOutline"></svg-icon>
            </span>
          </button>
          <button title="Eliminar" class="button is-danger" @click="borrarFCT(fct)">
            <span class="icon">
              <svg-icon class="mdi" type="mdi" :path="mdiTrashCanOutline"></svg-icon>
            </span>
          </button>
          </div>
        </div>
      </div>
  
    </div>
  </div>
  

<!-- <div class="table-container box"> -->
  <!--   <table class="table is-hoverable"> -->
    <!--     <thead> -->
      <!--       <th> -->
        <!--         <input type="checkbox" @click="toggleSelected()" v-model="allSelected" /> -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         Empresa -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         Alumno -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         F. inicio -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         F. fin -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         Instructor -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         Localidad -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         Dirección -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         <abbr title="Visitas">Visitas</abbr> -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         <abbr title="Visitas">Ver visitas</abbr> -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         <abbr title="Certificado de alumno">C. al.</abbr> -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         <abbr title="Certificado de instructor">C. in.</abbr> -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         FM18 -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         <abbr title="Etiqueta">Et.</abbr> -->
        <!--       </th> -->
      <!--       <th> -->
        <!--         Eliminar -->
        <!--       </th> -->
      <!--     </thead> -->
    <!--     <tbody> -->
      <!--       <tr :class="{'is-selected': fct.selected}" v-for="fct of FCT.fcts" :key="fct.id"> -->
        <!--         <td class="cursorPointer"> -->
          <!--           <input type="checkbox" v-model="fct.selected" @change="checkAll()"/> -->
          <!--         </td> -->
        <!--         <td class="cursorPointer" @click="selectRow(fct)"> -->
          <!--           {{fct.empresa}} -->
          <!--         </td> -->
        <!--         <td class="cursorPointer" @click="selectRow(fct)"> -->
          <!--           {{fct.alumno}} -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           {{new Date(fct.fecha_inicio).toLocaleDateString()}} -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           {{new Date(fct.fecha_fin).toLocaleDateString()}} -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           {{fct.instructor}} -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           {{fct.localidad}} -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           {{fct.dir_empresa}} -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           <span class="tags"> -->
            <!--             <span class="tag" :class="{'is-success': fct.visita_ini, 'is-warning': !fct.visita_ini}">Inicial</span> -->
            <!--             <span class="tag" :class="{'is-success': fct.visita_seg, 'is-warning': !fct.visita_seg}">Seguimiento</span> -->
            <!--             <span class="tag" :class="{'is-success': fct.visita_fin, 'is-warning': !fct.visita_fin}">Final</span> -->
            <!--           </span> -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           <button class="button is-primary" @click="mostrarVisitas(fct)"> -->
            <!--               <span class="icon"> -->
              <!--                   <svg-icon class="mdi" type="mdi" :path="mdiTrainCar"></svg-icon> -->
              <!--               </span> -->
            <!--             </button> -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           <button class="button is-info" @click.stop="FCT.generarCertificados('cert_alumno', fct)"> -->
            <!--             <span class="icon"> -->
              <!--               <svg-icon class="mdi" type="mdi" :path="mdiAccountSchool"></svg-icon> -->
              <!--             </span> -->
            <!--           </button> -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           <button class="button is-info" @click.stop="FCT.generarCertificados('cert_instructor', fct)"> -->
            <!--             <span class="icon"> -->
              <!--               <svg-icon class="mdi" type="mdi" :path="mdiHumanMaleBoard"></svg-icon> -->
              <!--             </span> -->
            <!--           </button> -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           <button class="button is-info" @click.stop="FCT.generarCertificados('fm18', fct)"> -->
            <!--             <span class="icon"> -->
              <!--               <svg-icon class="mdi" type="mdi" :path="mdiClipboardListOutline"></svg-icon> -->
              <!--             </span> -->
            <!--           </button> -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           <button class="button is-info" @click.stop="generarEtiqueta(fct)"> -->
            <!--             <span class="icon"> -->
              <!--               <svg-icon class="mdi" type="mdi" :path="mdiLabelOutline"></svg-icon> -->
              <!--             </span> -->
            <!--           </button> -->
          <!--         </td> -->
        <!--         <td> -->
          <!--           <button class="button is-danger" @click="borrarFCT(fct)"> -->
            <!--             <span class="icon"> -->
              <!--               <svg-icon class="mdi" type="mdi" :path="mdiTrashCanOutline"></svg-icon> -->
              <!--             </span> -->
            <!--           </button> -->
          <!--         </td> -->
        <!--       </tr> -->
      <!--     </tbody> -->
    <!--   </table> -->
  <!-- </div> -->
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiMagnify, mdiAccount, mdiLock, mdiAccountSchool, mdiHumanMaleBoard, mdiClipboardListOutline, mdiLabelOutline, mdiTrainCar, mdiTrashCanOutline, mdiDownload} from '@mdi/js'

export default {
    computed: {
        anySelected: function() {
            return this.FCT.fcts.filter(f => f.selected).length;
        },
        filteredFCTs: function() {
            return this.FCT.fcts.filter(f => {
                let res = this.matchQuery(f.empresa);
                res = res || this.matchQuery(f.alumno);
                res = res || this.matchQuery(f.instructor);
                res = res || this.matchQuery(f.dir_empresa);
                res = res || this.matchQuery(f.localidad);
                res = res || this.matchQuery(f.fecha_inicio);
                res = res || this.matchQuery(f.fecha_fin);
                return res;
            });
            
        }
    },
    components: {
        SvgIcon
    },
    data() {
        return {
            query: "",
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
            mdiMagnify,
            FCT: gestionFCTStore(), 
            visitaEditar: null
        }
    },
    methods: {
        matchQuery: function(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(this.query.toLowerCase());
        },
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
        generarEtiquetas: function() {
            this.$router.push({name: 'etiquetas', params: this.$route.params});
        },
        generarEtiqueta: function(fct) {
            this.FCT.resetSeleccion();
            fct.selected = true;
            this.generarEtiquetas();
        },
        toggleSelected() {
            if (this.allSelected) {
                this.allSelected = false
                this.FCT.resetSeleccion();
            } else {
                this.allSelected = true
                this.FCT.selectAll();
            }
        },
        mostrarVisitas: function(fct) {
            this.$router.push({name: 'visitas', params: {fctId: fct.id} });
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
    }
}
</script>

<style>
.cursorPointer {
    cursor: pointer;
}
</style>
