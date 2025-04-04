import { defineStore } from 'pinia'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'
import { groupByISOWeek } from './groupByISOWeek.js'
import { CP } from '../aux/cursoperiodo.js'

export const gestionFCTStore = defineStore('gestionfct', {
  state: () => {
    return {
      kmsvisitas: { kms: 0, importe: 0 },
      listadoKmsImportes: [],
      formActive: false,
      editingItem: null,
      loginError: false,
      loading: false,
      mensaje: '',
      error: false,
      mostrarMensaje: false,
      usuario: '',
      password: '',
      curso: '',
      periodo: '',
      fm34s: [],
      fcts: [],
      visits: []
    }
  },
  actions: {
    getTicket(fctId, visit, type) {
      let url = `${visit.href}/ticket?type=${type}`
      return this.request(url, 'GET').then((response) => {
        return response.text()
      })
    },
    getTicketGet(fctId, visit) {
      let url = visit.href + '/ticketGet'
      return this.request(url, 'GET').then((response) => {
        return response.text()
      })
    },
    async downloadFile(url, visit) {
      let resp = await fetch(url)
      let blob = await resp.blob()
      let url2 = await URL.createObjectURL(blob)
      var link = document.createElement('a')
      link.download = `${visit.fecha}-${visit.hora_regreso}-${visit.empresa.replace(
        /[,.:; ]/g,
        ''
      )}-${visit.tipo}.${blob.extension}`
      link.href = url2
      link.target = '_blank'
      link.click()
      // window.open(url2, '_blank')
      // URL.revokeObjectURL(url2)
    },
    async uploadFile(url, file, visita) {
      this.loading = true
      return fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })
        .then((response) => {
          return this.request(visita.href + '/ticket', 'PUT', { importe: visita.importe })
        })
        .then((response) => {
          this.loading = false
          if (response.ok) {
            visita.comprobante = true
            this.calcularKMsVisitas()
          } else {
            throw new Error('No se ha podido subir el archivo')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetSeleccion() {
      this.fcts.forEach((fct) => {
        fct.selected = false
      })
    },
    selectAll() {
      this.fcts.forEach((fct) => {
        fct.selected = true
      })
    },
    request(url, method, body) {
      let fullUrl = `${import.meta.env.VITE_API_URL}${url}`

      let headers = new Headers()
      headers.set('Authorization', 'Basic ' + btoa(this.usuario + ':' + this.password))
      headers.set('Content-Type', 'application/json')
      let params = {
        method: method,
        mode: 'cors',
        headers
      }
      if (body) params.body = JSON.stringify(body)
      return fetch(fullUrl, params)
    },
    resetMensaje() {
      this.mostrarMensaje = false
      this.error = false
      this.mensaje = ''
    },
    enviarMensaje(texto, error) {
      this.mostrarMensaje = true
      this.error = error
      this.mensaje = texto
    },
    loadCredentials: function () {
      this.usuario = sessionStorage.getItem('user')
      this.password = sessionStorage.getItem('password')
    },
    deleteCredentials: function () {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('password')
      this.usuario = ''
      this.password = ''
    },
    checkLogin: function () {
      return this.usuario
    },
    importarFCTs: function () {
      if (
        !confirm(
          `¿Desea importar las FCTs del curso ${this.curso}, período ${
            CP.getPeriodoFromCode(this.periodo).text
          }?`
        )
      )
        return
      let url = `/api/users/${this.usuario}/import_fcts`
      let data = {
        curso: this.curso,
        periodo: this.periodo
      }
      this.loading = true
      return this.request(url, 'POST', data)
        .then((response) => {
          this.loading = false
          if (response.ok) {
            this.enviarMensaje('Importación realizada con éxito!', false)
            return this.loadFCTs()
          } else if (response.status == 404) {
            this.enviarMensaje(
              `No se han encontrado FCTs en el curso ${this.curso}, perídodo ${
                CP.getPeriodoFromCode(this.periodo).text
              }. Comprueba que existen en el SAO en el período correspondiente.`,
              false
            )
          } else {
            throw new Error('Ha ocurrido un error. Por favor, inténtelo de nuevo.')
          }
        })
        .catch((error) => {
          if (error.cause == 'auth') {
            this.deleteCredentials()
            this.loginError = true
          } else {
            this.enviarMensaje(error, true)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    calcularKMsVisitas() {
      this.kmsvisitas = this.visits.reduce(
        (acc, visita) => {
          acc.kms += visita.distancia
          if (!isNaN(visita.importe)) acc.importe += parseFloat(visita.importe)
          return acc
        },
        { kms: 0, importe: 0 }
      )
      let url = `/api/users/${this.usuario}/kmsimporte/${this.curso}/${this.periodo}`
      this.request(url, 'PUT', this.kmsvisitas)
    },
    async getKmsVisitas() {
      let url = `/api/kmsimporte/${this.curso}/${this.periodo}`
      this.request(url, 'GET')
        .then((response) => {
          return response.json()
        })
        .then((datos) => {
          this.listadoKmsImportes = datos
        })
    },
    loadFCTs: function () {
      console.log('loading FCTs')
      this.loading = true
      this.loginError = false
      let url = `/api/users/${this.usuario}/fcts?curso=${this.curso}&periodo=${this.periodo}`

      return this.request(url, 'GET')
        .then((response) => {
          if (response.ok) {
            this.loginError = false
            return response.json()
          } else {
            if (response.status == 401) {
              throw new Error('Error de autenticación.', { cause: 'auth' })
            } else {
              throw new Error('Ha ocurrido un problema al obtener los datos')
            }
          }
        })
        .then((datos) => {
          this.visits = []
          this.fcts = []
          datos.map((item) => {
            if (item.type == 'FCT') {
              this.fcts.push(item)
            } else {
              this.visits.push(item)
            }
          })
          this.calcularKMsVisitas()
          for (let fct of this.fcts) {
            this.loadVisitsToFCT(fct)
          }
          // Generar FM34s
          this.getFM34s()
        })
        .catch((error) => {
          if (error.cause == 'auth') {
            this.deleteCredentials()
            this.loginError = true
          } else {
            this.enviarMensaje(error, true)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadVisitsToFCT: function (fct) {
      fct.visitas = this.getVisitsByFCTId(fct.id)
      fct.visita_ini = fct.visitas.find((v) => v.tipo == 'inicial')
      fct.visita_seg = fct.visitas.find((v) => v.tipo == 'seguimiento')
      fct.visita_fin = fct.visitas.find((v) => v.tipo == 'final')
      fct.visita_adicional = fct.visitas.filter((v) => v.tipo == 'adicional')
    },
    getVisit: function (fctId, visitaId) {
      return this.visits.find((v) => v.fctId == fctId && v.visitaId == visitaId)
    },
    getFCT: function (fctId) {
      return this.fcts.find((f) => f.id == fctId)
    },
    getVisitsByFCTId: function (fctId) {
      return this.visits.filter((visit) => visit.fctId == fctId)
    },
    getVisitsByDate: async function (start, end) {
      return this.visits.filter((visit) => {
        let cond = new Date(visit.fecha) >= start
        if (end) {
          cond = cond && visit.fecha <= end
        }
        return cond
      })
    },
    getFCTsMismaEmpresa: function (fct, tipo) {
      return this.fcts.filter((f) => {
        let check = true
        if (tipo == 'inicial') check = !f.visita_ini
        if (tipo == 'seguimiento') check = !f.visita_seg
        if (tipo == 'final') check = !f.visita_fin
        return f.empresa == fct.empresa && f.id != fct.id && check
      })
    },
    deleteVisit: function (fct, visit) {
      let url = visit.href
      this.loading = true
      return this.request(url, 'DELETE')
        .then((response) => {
          this.loading = false
          if (response.ok) {
            this.visits = this.visits.filter((v) => v != visit)
            this.loadVisitsToFCT(fct)
            this.getFM34s()
          } else {
            throw new Error('No se ha podido borrar la visita')
          }
        })
        .finally(() => {
          this.calcularKMsVisitas()
          this.loading = false
        })
    },
    deleteFCT: function (fct) {
      let url = fct.href
      let headers = new Headers()
      headers.set('Authorization', 'Basic ' + btoa(this.usuario + ':' + this.password))
      headers.set('Content-Type', 'application/json')
      this.loading = true
      return this.request(url, 'DELETE')
        .then((response) => {
          this.loading = false
          if (response.ok) {
            this.fcts = this.fcts.filter((f) => f.id != fct.id)
            this.visits = this.visits.filter((v) => v.fctId != fct.id)
            this.getFM34s()
          } else {
            throw new Error('No se ha podido borrar la FCT')
          }
        })
        .finally(() => {
          this.calcularKMsVisitas()
          this.loading = false
        })
    },
    addVisit: function (visitData, fct) {
      let url = fct.hrefVisit
      this.loading = true
      return this.request(url, 'POST', visitData)
        .then((response) => {
          this.loading = false
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('No se ha podido crear la visita')
          }
        })
        .then((newVisits) => {
          this.visits.push(...newVisits)
          for (let fctId of visitData.related) {
            this.loadVisitsToFCT(this.getFCT(fctId))
          }
          this.loadVisitsToFCT(fct)
          this.getFM34s()
        })
        .finally(() => {
          this.calcularKMsVisitas()
          this.loading = false
        })
    },
    updateVisit: function (visita, visitData, fct) {
      let url = visita.href
      this.loading = true
      return this.request(url, 'PUT', visitData)
        .then((response) => {
          this.loading = false
          if (response.ok) {
            visita = Object.assign(visita, visitData)
            this.loadVisitsToFCT(fct)
            this.getFM34s()
          } else {
            throw new Error('No se ha podido actualizar la visita')
          }
        })
        .finally(() => {
          this.calcularKMsVisitas()
          this.loading = false
        })
    },
    generarCertificados: function (tipo, fct) {
      let url = `${import.meta.env.BASE_URL}office_templates/${tipo}.docx`
      var generation_date = new Date().toLocaleDateString('es', { dateStyle: 'long' })
      PizZipUtils.getBinaryContent(url, (err, content) => {
        const zip = new PizZip(content)
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })
        let listaFCTs = !fct ? this.fcts.filter((fct) => fct.selected) : [fct]
        doc.setData({
          certs: JSON.parse(
            JSON.stringify(listaFCTs, function (key, value) {
              if (key == 'fecha') {
                return new Date(value).toLocaleDateString('es')
              }
              if (key == 'fecha_inicio') {
                return new Date(value).toLocaleDateString('es')
              }
              if (key == 'fecha_fin') {
                return new Date(value).toLocaleDateString('es')
              }
              return value
            })
          ),
          generation_date: generation_date
        })
        doc.render()
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        // Output the document using Data-URI
        saveAs(out, `${tipo}.docx`)
      })
    },
    getFM34s: function () {
      let groups = groupByISOWeek(this.visits)
      this.fm34s = Object.entries(groups).map(([clave, data]) => {
        return data
      })
    },
    generarFM34s: function () {
      let url = `${import.meta.env.BASE_URL}office_templates/fm34.docx`
      PizZipUtils.getBinaryContent(url, (err, content) => {
        const zip = new PizZip(content)
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })
        let listaFM34s = this.fm34s.filter((fm34) => fm34.selected)
        if (listaFM34s.length == 0) return
        let tutor = 'TUTOR'
        let ciclo = 'CICLO'
        if (this.fcts[0]) {
          tutor = this.fcts[0].tutor
          ciclo = this.fcts[0].ciclo
        }
        doc.setData({
          tutor,
          ciclo,
          fm34s: JSON.parse(
            JSON.stringify(listaFM34s, function (key, value) {
              if (key == 'fecha' || key == 'start' || key == 'end') {
                return new Date(value).toLocaleDateString('es')
              }
              return value
            })
          )
        })
        doc.render()
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        // Output the document using Data-URI
        saveAs(out, `fm34.docx`)
      })
    }
  }
})
