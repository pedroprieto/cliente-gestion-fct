<template>
  <div class="container">
    <TituloPagina :titulo="`Importar FEs del curso ${FCT.curso} período ${FCT.getPeriodoText()}`" />
    <article id="mensaje" class="notification is-info">
      Descarga y rellena el Excel que se proporciona en el siguiente enlace con los datos
      correspondientes a las FEs:
      <a href="/office_templates/toma_datos_fe.xlsx">Excel de toma de datos</a>
    </article>
    <article id="mensaje" class="notification is-info">
      Copia y pega el contenido de la tabla de EXCEL en el siguiente cuadro de texto.
    </article>
    <form @submit.prevent="importarFCTs()">
      <div class="field">
        <label for="impresion" class="label">Lista de FEs</label>
        <div class="control">
          <textarea
            @paste="pasteCSV"
            required
            v-model="listado"
            class="textarea"
            id="impresion"
            type="text"
            placeholder=""
          ></textarea>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-primary">Enviar</button>
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
  components: {
    TituloPagina
  },
  data() {
    return {
      listado: '',
      titulo: '',
      FCT: gestionFCTStore()
    }
  },
  methods: {
    importarFCTs: async function () {
      this.FCT.importarFCTs(this.listado).then(() => {
        this.cancelarEdicion()
      })
    },

    processDate: function (str) {
      const ISO_REGEX = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}(T[\d:.]+Z?)?$/
      const ES_LONG_REGEX = /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/
      const ES_SHORT_REGEX = /^\d{1,2}[-/]\d{1,2}[-/]\d{2}$/

      if (ISO_REGEX.test(str)) {
        return str.replace(/\//g, '-').slice(0, 10) // normalize separators, keep date only
      }
      if (ES_LONG_REGEX.test(str)) {
        const [day, month, year] = str.split(/[-/]/)
        return `${year}-${month}-${day}`
      }
      if (ES_SHORT_REGEX.test(str)) {
        const [day, month, year] = str.split(/[-/]/)
        return `20${year}-${month}-${day}` // assumes 2000s
      }
      return str
    },
    pasteCSV: function (event) {
      event.preventDefault()
      const raw = event.clipboardData.getData('text/plain')
      const csv = this.tsvToCsv(raw)
      this.listado = csv
    },
    tsvToCsv(tsv) {
      return tsv
        .split('\n')
        .map((row) =>
          row
            .split('\t')
            .map((cell) => {
              // Proceso también fechas para homogeneizar tanto formato ISO como español
              // Escape cells that contain commas, quotes, or newlines
              if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                return '"' + cell.replace(/"/g, '""') + '"'
              }
              return this.processDate(cell)
            })
            .join(',')
        )
        .filter(
          (row) =>
            row !=
            'Nombre Alumno,NIF Alumno,Nombre Empresa,Dirección Empresa,Localidad,Ciclo,Grupo,Nombre Tutor,Nombre Instructor,NIF Instructor,Curso,Período,Fecha de inicio,Fecha de fin,Horas'
        )
        .join('\n')
    },
    cancelarEdicion: function () {
      this.$router.push({ name: 'fcts' })
    }
  }
}
</script>

<style></style>
