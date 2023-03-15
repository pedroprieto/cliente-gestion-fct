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
            loading: false,
            mensaje: "",
            error: false,
            mostrarMensaje: false,
            usuario: '',
            password: '',
            curso: "",
            periodo: "",
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
        request(url, method, body) {
            let headers = new Headers();
            headers.set('Authorization', 'Basic ' + btoa(this.usuario + ":" + this.password));
            headers.set('Content-Type', 'application/json');
            let params = {
                method: method,
                mode: 'cors',
                headers
            };
            console.log(body);
            if (body)
                params.body = JSON.stringify(body);
            return fetch(url, params);
        },
        resetMensaje() {
            this.mostrarMensaje = false;
            this.error = false;
            this.mensaje = "";
        },
        enviarMensaje(texto, error) {
            this.mostrarMensaje = true;
            this.error = error;
            this.mensaje = texto;
        },
        loadCredentials: function() {
            this.usuario = sessionStorage.getItem("user");
            this.password = sessionStorage.getItem("password");
        },
        checkLogin: function() {
            return this.usuario;
        },
        updateCurso: function (curso) {
            this.curso = curso;
        },
        updatePeriodo: function (periodo) {
            this.periodo = periodo;
        },
        loadFCTs: async function () {
            console.log("loading FCTs");
            let url = `http://localhost:3000/api/users/${this.usuario}/fcts?curso=${this.curso}&periodo=${this.periodo.value}`;
                
            return this.request(url, 'GET')
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Ha ocurrido un problema al obtener los datos");
                    }
                }).then(datos => {
                    this.visits = [];
                    this.fcts = [];
                    console.log(datos);
                    datos.map(item => {
                        if (item.type == 'FCT') {
                            this.fcts.push(item);
                        } else {
                            this.visits.push(item);
                        }
                    });
                    console.log(this.visits);
                    for (let fct of this.fcts) {
                        this.loadVisitsToFCT(fct);
                    }
                }).catch(error => {
                    console.log("error");
                    this.enviarMensaje(error, true);
                });
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
        deleteVisit: function (fct, visit) {
            let url = `http://localhost:3000/api/users/${this.usuario}/fcts/items/${fct.id}/visits/item/${visit.id}`;
            this.loading = true;
            return this.request(url, 'DELETE')
                .then(response => {
                    this.loading = false;
                    if (response.ok) {
                        this.visits = this.visits.filter((v) => v.id != visit.id)
                        this.loadVisitsToFCT(fct);
                    } else {
                        throw new Error("No se ha podido borrar la visita");
                    }
                });
        },
        deleteFCT: function (fct) {
            let url = `http://localhost:3000/api/users/${this.usuario}/fcts/items/${fct.id}`;
            let headers = new Headers();
                headers.set('Authorization', 'Basic ' + btoa(this.usuario + ":" + this.password));
                headers.set('Content-Type', 'application/json');
            this.loading = true;
            return this.request(url, 'DELETE')
                .then(response => {
                    this.loading = false;
                    if (response.ok) {
                        this.fcts = this.fcts.filter(f => f.id != fct.id);
                        this.visits = this.visits.filter((v) => v.fctId != fct.id)
                    } else {
                        throw new Error("No se ha podido borrar la FCT");
                    }
                });
        },
        // TODO: hacer que servidor devuelva visita con datos correctos tras update y add
        addVisit: function (visitData, fct) {
            let url = `http://localhost:3000/api/users/${this.usuario}/fcts/items/${fct.id}/visits`;
            this.loading = true;
            return this.request(url, 'POST', visitData)
                .then(response => {
                    this.loading = false;
                    if (response.ok) {
                        this.visits.push(visitData);
                        this.loadVisitsToFCT(fct);
                    } else {
                        throw new Error("No se ha podido crear la visita");
                    }
                });
        },
        updateVisit: function (visitData, fct) {
            let url = `http://localhost:3000/api/users/${this.usuario}/fcts/items/${fct.id}/visits/item/${visitData.id}`;
            this.loading = true;
            return this.request(url, 'PUT', visitData)
                .then(response => {
                    this.loading = false;
                    if (response.ok) {
                        let foundVisit = this.visits.find((v) => v.id == visitData.id);
                        foundVisit = Object.assign(foundVisit, visitData)
                        this.loadVisitsToFCT(fct);
                    } else {
                        throw new Error("No se ha podido actualizar la visita");
                    }
                });
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
