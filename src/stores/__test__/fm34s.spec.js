import { beforeEach, describe, it, expect } from 'vitest'
import { groupByISOWeek } from '../groupByISOWeek'

process.env.TZ = 'UTC';

// 2015W19
var v1 = {
    empresa: 'empresa1',
    tipo: 'inicial',
    distancia: 30,
    fecha: "2015-05-08",
    hora_salida: '09:00',
    hora_regreso: '11:00',
    localidad: 'localidad test 1',
    impresion: 'texto impresión test 1',
    presencial: true
};

//2015W19
var v2_same_date = {
    empresa: 'empresa1',
    tipo: 'seguimiento',
    distancia: 30,
    fecha: "2015-05-08",
    hora_salida: '09:00',
    hora_regreso: '11:00',
    localidad: 'localidad test 1',
    impresion: 'texto impresión test 2',
    presencial: true
};

//2015W19
var v3_other_hour = {
    empresa: 'empresa3',
    tipo: 'final',
    distancia: 30,
    fecha: "2015-05-08",
    hora_salida: '15:00',
    hora_regreso: '17:00',
    localidad: 'localidad test 3',
    impresion: 'texto impresión test 3',
    presencial: true
};

//2015W19
var v4_same_week = {
    empresa: 'empresa4',
    tipo: 'inicial',
    distancia: 30,
    fecha: "2015-05-05",
    hora_salida: '15:00',
    hora_regreso: '17:00',
    localidad: 'localidad test 4',
    impresion: 'texto impresión test 4',
    presencial: true
};

//2015W15
var v5_other_week = {
    empresa: 'empresa5',
    tipo: 'seguimiento',
    distancia: 30,
    fecha: "2015-04-08",
    hora_salida: '15:00',
    hora_regreso: '17:00',
    localidad: 'localidad test 5',
    impresion: 'texto impresión test 5',
    presencial: true
};

//2015W15
// No presencial
var v5_other_week_bis = {
    empresa: 'empresa5',
    tipo: 'seguimiento',
    distancia: 30,
    fecha: "2015-04-08",
    hora_salida: '19:00',
    hora_regreso: '22:00',
    localidad: 'localidad test 5',
    impresion: 'texto impresión test 5',
    presencial: false
};

//2015W19
var v6_same_week = {
    empresa: 'empresa6',
    tipo: 'final',
    distancia: 30,
    fecha: "2015-05-07",
    hora_salida: '15:00',
    hora_regreso: '17:00',
    localidad: 'localidad test 6',
    impresion: 'texto impresión test 6',
    presencial: true
};

var result = {
    "2015W15": {
        start: new Date("2015-04-06"),
        end: new Date("2015-04-12"),
        visits: [
            {
                empresa: 'empresa5',
                tipo: ['seguimiento'],
                distancia: 30,
                fecha: "2015-04-08",
                hora_salida: '15:00',
                hora_regreso: '17:00',
                localidad: 'localidad test 5',
                impresion: 'texto impresión test 5',
                presencial: true
            }
        ]
    },
    "2015W19": {
        start: new Date("2015-05-04"),
        end: new Date("2015-05-10"),
        visits: [
            {
                empresa: 'empresa4',
                tipo: ['inicial'],
                distancia: 30,
                fecha: "2015-05-05",
                hora_salida: '15:00',
                hora_regreso: '17:00',
                localidad: 'localidad test 4',
                impresion: 'texto impresión test 4',
                presencial: true
            },
            {
                empresa: 'empresa6',
                tipo: ['final'],
                distancia: 30,
                fecha: "2015-05-07",
                hora_salida: '15:00',
                hora_regreso: '17:00',
                localidad: 'localidad test 6',
                impresion: 'texto impresión test 6',
                presencial: true
            },
            {
                empresa: 'empresa1',
                tipo: ['inicial', 'seguimiento'],
                distancia: 30,
                fecha: "2015-05-08",
                hora_salida: '09:00',
                hora_regreso: '11:00',
                localidad: 'localidad test 1',
                impresion: 'texto impresión test 1',
                presencial: true

            },
            {
                empresa: 'empresa3',
                tipo: ['final'],
                distancia: 30,
                fecha: "2015-05-08",
                hora_salida: '15:00',
                hora_regreso: '17:00',
                localidad: 'localidad test 3',
                impresion: 'texto impresión test 3',
                presencial: true
            }
        ]
    }
}

describe('Comprobación de FM34', () => {
    
    it('Agrupación de visitas por semana y año', async function () {
        let visits = [v1, v2_same_date, v3_other_hour, v4_same_week, v5_other_week, v5_other_week_bis, v6_same_week];
        let res = groupByISOWeek(visits);
        expect(res).to.deep.equal(result);
    });

})
