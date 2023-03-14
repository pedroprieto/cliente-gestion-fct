import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'
import { groupByISOWeek } from './groupByISOWeek.js'
import { cursoPeriodoStore } from '@/stores/cursoperiodo'

export const gestionFCTStore = defineStore('gestionfct', {
    state: () => {
        return {
            usuario: '',
            password: '',
            curso: cursoPeriodoStore().getCursoActual(),
            periodo: cursoPeriodoStore().getPeriodoActual(),
            fm34s: [],
            fcts: [
                {
                    alumno: 'alumno test',
                    nif_alumno: '123456789k',
                    empresa: 'empresa test',
                    dir_empresa: 'dir_empresa_test',
                    localidad: 'localidad test',
                    ciclo: 'ciclo test',
                    grupo: 'grupo test',
                    tutor: 'tutor test',
                    instructor: 'instructor test',
                    nif_instructor: '987654321e',
                    curso: '2013-2014',
                    periodo: '5',
                    fecha_inicio: new Date('2023-03-11'),
                    fecha_fin: new Date('2023-06-30'),
                    horas: 400,
                    id: 1,
                    visitas: []
                }
            ],
            visits: []
        }
    },
    actions: {
        checkLogin: function() {
            return sessionStorage.getItem("user");
        },
        updateCurso: function (curso) {
            this.curso = curso;
            // this.curso = cursoPeriodoStore().getcursoslist().includes(curso) ? curso : cursoPeriodoStore().getCursoActual();
            // console.log(this.curso);
            // TODO: actualizar ruta a válida
            // this.$router.push({path: this.$route.path, query: {curso: this.curso, periodo: this.periodo.value}})
        },
        updatePeriodo: function (periodo) {
            this.periodo = periodo;
        },
        loadFCTs: async function (url) {
            // TODO ajax
            for (let fct of this.fcts) {
                this.loadVisitsToFCT(fct);
            }
            return this.fcts
        },
        loadVisitsToFCT: function (fct) {
            fct.visitas = this.getVisitsByFCTId(fct.id)
            fct.visita_ini = fct.visitas.find((v) => v.tipo == 'inicial')
            fct.visita_seg = fct.visitas.find((v) => v.tipo == 'seguimiento')
            fct.visita_fin = fct.visitas.find((v) => v.tipo == 'final')
            fct.visita_adicional = fct.visitas.filter((v) => v.tipo == 'adicional')

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
        getFCTSByEmpresa: async function (empresa) {
            return this.fcts.filter((fct) => {
                return fct.empresa == empresa
            })
        },
        deleteFCTWithVisits: async function (fctId) {
            this.fcts = this.fcts.filter((f) => f.id != fctId)
            this.visits = this.visits.filter((v) => v.fctId != fctId)
        },
        deleteVisit: async function (fct, visit) {
            this.visits = this.visits.filter((v) => v.id != visit.id)
            this.loadVisitsToFCT(fct);
        },
        addVisit: async function (visitData, fct) {
            visitData.fctId = fct.id;
            visitData.empresa = fct.empresa;
            visitData.fecha = new Date(visitData.fecha)
            visitData.id == uuidv4();
            this.visits.push(visitData);
            this.loadVisitsToFCT(fct);
        },
        updateVisit: async function (visitData) {
            let foundVisit = this.visits.find((v) => v.id == visitData.id)
            foundVisit = Object.assign(foundVisit, visitData)
            this.loadVisitsToFCT(fct);
        },
        generarCertificados: function (tipo, fct) {
            // fct.visita_ini = fct.visitas.find(v => v.tipo == 'inicial');
            // fct.visita_seg = fct.visitas.find(v => v.tipo == 'seguimiento');
            // fct.visita_fin = fct.visitas.find(v => v.tipo == 'final');
            let url = `http://localhost:5173/office_templates/${tipo}.docx`
            var generation_date = new Date().toLocaleDateString('es')
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
            let groups = groupByISOWeek(this.visits);
            this.fm34s = Object.entries(groups).map(([clave, data]) => {
                return data;
            });
            return this.fm34s;

        },
        generarFM34s: function () {
            let url = `/office_templates/fm34.docx`
            PizZipUtils.getBinaryContent(url, (err, content) => {
                const zip = new PizZip(content)
                const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })
                let listaFM34s = this.fm34s.filter((fm34) => fm34.selected);
                if (listaFM34s.length == 0)
                    return;
                let tutor = "TUTOR";
                let ciclo = "CICLO";
                if (this.fcts[0]) {
                    tutor = this.fcts[0].tutor;
                    ciclo = this.fcts[0].ciclo;

                }
                doc.setData({
                    tutor,
                    ciclo,
                    fm34s: JSON.parse(
                        JSON.stringify(listaFM34s, function (key, value) {
                            if ((key == 'fecha') || (key == 'start') || (key == 'end')) {
                                return new Date(value).toLocaleDateString('es')
                            }
                            return value
                        })
                    ),
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
