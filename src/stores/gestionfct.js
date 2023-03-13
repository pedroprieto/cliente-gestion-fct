import { defineStore } from 'pinia'
const { v4: uuidv4 } = require('uuid');

export const gestionFCTStore = defineStore('gestionfct', () => {
    let fcts = [
        {
            alumno: "alumno test",
            nif_alumno: "123456789k",
            empresa: "empresa test",
            dir_empresa: "dir_empresa_test",
            localidad: "localidad test",
            ciclo: "ciclo test",
            grupo: "grupo test",
            tutor: "tutor test",
            instructor: "instructor test",
            nif_instructor: "987654321e",
            curso: "2013-2014",
            periodo: "5",
            fecha_inicio: "2023-03-11",
            fecha_fin: "2023-06-30",
            horas: 400,
            id: 1
        }
    ];
    let visits = [];

    return {
        loadFCTs: async function (url) {
            // TODO ajax
            return fcts;
        },
        getVisitsByFCTId: async function (fctId) {
            return visits.filter(visit => visit.fctId == fctId);
        },
        getVisitsByDate: async function (start, end) {
            return visits.filter(visit => {
                let cond = (new Date(visit.fecha) >= start);
                if (end) {
                    cond = cond && (visit.fecha <= end);
                }
                return cond;
            });
        },
        getFCTSByEmpresa: async function (empresa) {
            return fcts.filter(fct => {
                return fct.empresa == empresa;
            });
        },
        deleteFCTWithVisits: async function (fctId) {
            fcts = fcts.filter(f => f.id != fctId);
            visits = visits.filter(v => v.fctId != fctId);
        },
        deleteVisit: async function (visitId) {
            visits = visits.filter(v => v.id != visitId);
        },
        addVisit: async function(visitData) {
            visits.push({
                ...visitData,
                id: uuidv4()
            });
        },
        updateVisit: async function(visitData) {
            let foundVisit = visits.find(v => v.id == visitData.id);
            foundVisit = Object.assign(foundVisit, visitData);
        },

    }
})
