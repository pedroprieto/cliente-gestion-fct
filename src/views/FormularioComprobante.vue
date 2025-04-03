<template>
  <div class="container">
    <TituloPagina :titulo="titulo" />
    <form @submit.prevent="subirTicket()">
      <div class="field">
        <label for="comprobante" class="label">Comprobante</label>
        <div class="control">
          <input required @change="actualizarFichero" type="file" id="comprobante" />
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-primary" :disabled="!archivo">Enviar</button>
        </div>
        <div class="control">
          <button type="button" @click="cancelarEdicion()" class="button is-link is-light">
            Cancelar
          </button>
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
      archivo: null,
      url: '',
      titulo: '',
      FCT: gestionFCTStore(),
      visita: {},
      fct: {}
    }
  },
  async created() {
    this.titulo = 'Subir comprobante'
    this.fct = this.FCT.getFCT(this.fctId)
    this.visita = this.FCT.getVisit(this.fctId, this.tipo)
  },
  methods: {
    cancelarEdicion: function () {
      this.$router.push({ name: 'visitas', params: this.$route.params })
    },
    actualizarFichero: async function (event) {
      try {
        this.archivo = event.target.files[0]
        this.url = await this.FCT.getTicket(this.fctId, this.visita, this.archivo.type)
        // let extension = this.archivo.split('.').pop();
      } catch {
        this.FCT.enviarMensaje('Error al subir el fichero.', true)
      }
    },
    subirTicket: async function (event) {
      try {
        await this.FCT.uploadFile(this.url, this.archivo, this.visita.href)
        this.FCT.enviarMensaje('Fichero subido con éxito.', false)
        this.$router.replace({ name: 'visitas', params: this.$route.params })
      } catch {
        this.FCT.enviarMensaje('Error al subir el fichero.', true)
      }
    }
  }
}
</script>

<style></style>
