// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.com/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function () {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}

Date.prototype.fromWeek = function (w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

export const groupByISOWeek = function(visits) {

    let visitsNoDuplicates = visits.reduce((acc, visit) => {
        let fecha = new Date(visit.fecha).toISOString().substr(0, 10);
        let clave = `${fecha}-${visit.hora_salida}-${visit.hora_regreso}`;
        let exist = Boolean(acc[clave]);
        acc[clave] = exist ? acc[clave] : {
            ...visit
        };
        acc[clave].tipo = exist ? [...new Set([...acc[clave].tipo, visit.tipo])] : [visit.tipo];
        return acc;
    }, {});
    

    let groups = Object.entries(visitsNoDuplicates).sort().reduce((acc, [clave, visita]) => {
        let f = new Date(visita.fecha);
        let c1 = `${f.getWeekYear()}W${f.getWeek()}`;
        let startWeek = new Date(f);
        startWeek.setDate(f.getDate() - f.getDay() + 1);
        let endWeek = new Date(f);
        endWeek.setDate(f.getDate() - f.getDay() + 7);
        acc[c1] = acc[c1] || {start: startWeek, end: endWeek, visits: []};
        acc[c1].visits.push(visita);
        return acc;
    }, {});
    
    return groups;
}
