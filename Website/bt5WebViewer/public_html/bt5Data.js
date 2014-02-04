/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

singleBT5 = function(file) {
    'use strict';
    var data = [], meta = {}, i, j, a2, monitor, sum, total, tempmin, tempmax, tempsum, tpoints, hfmin, hfmax, hfsum, hpoints, plottable_data;
    for (i = 0; i < file.points; i += 1) {
        try {
            a2 = file.column.a2[i];
            monitor = file.column.monitor[i];
            sum = file.counts[i][1] + file.counts[i][2] + file.counts[i][4] + file.counts[i][5] + file.counts[i][6];
            total = sum * 1000000 / monitor;
            data.push([parseFloat(a2), parseFloat(total)]);
            meta.date = file.date;
        } catch (err) {}
    }
    if (typeof (file.column.temp) === "object") {
        tempmin = parseFloat(Math.min.apply(Math, file.column.temp));
        tempmax = parseFloat(Math.max.apply(Math, file.column.temp));
        tempsum = 0;
        tpoints = parseInt(file.column.temp.length, 10);
        for (j = 0; j < tpoints; j += 1) {
            tempsum += parseFloat(file.column.temp[j]);
        }
        meta.tempmin = tempmin;
        meta.tempmax = tempmax;
        meta.tempsum = tempsum;
        meta.tpoints = tpoints;
    }
    if (typeof (file.column["h-field"]) === "object") {
        hfmin = parseFloat(Math.min.apply(Math, file.column["h-field"]));
        hfmax = parseFloat(Math.max.apply(Math, file.column["h-field"]));
        hfsum = 0;
        hpoints = parseInt(file.column["h-field"].length, 10);
        for (j = 0; j < hpoints; j += 1) {
            hfsum += parseFloat(file.column["h-field"][j]);
        }
        meta.hfmin = hfmin;
        meta.hfmax = hfmax;
        meta.hfsum = hfsum;
        meta.hpoints = hpoints;
    }

    plottable_data = {
        'type': '1d',
        'title': file.comment,
        'metadata': meta,
        'options': {
            'axes': {
                'xaxis': {
                    'label': "a2"
                },
                'yaxis': {
                    'label': "Counts x 10^6 / Monitor"
                }
            },
            'series': [{
                'label': file.filename
            }]
        },
        'xlabel': 'X',
        'ylabel': 'Y',
        'data': [data]
    };
    return plottable_data;
}

function predicatBy(prop) {
    'use strict';
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    };
}

function compileBT5Object(BT5Obj, BT5JSON, title) {
    'use strict';
    var j;
    if (BT5Obj.hasOwnProperty(title) === true) {
        for (j = 0; j < BT5JSON.data[0].length; j += 1) {
            BT5Obj[title].data[0].push(BT5JSON.data[0][j]);
        }
        if (BT5Obj[title].metadata.date.valueOf() > BT5JSON.metadata.date.valueOf()) {
            try {
                BT5Obj[title].metdata.date = BT5JSON.metadata.date;
            } catch (err) {
                // console.log(err);
            }
        }
        BT5Obj[title].metadata.tpoints += parseFloat(BT5JSON.metadata.tpoints);
        BT5Obj[title].metadata.tempsum += parseFloat(BT5JSON.metadata.tempsum);
        if (BT5JSON.metadata.tempmin < BT5Obj[title].metadata.tempmin) {
            BT5Obj[title].metadata.tempmin = BT5JSON.metadata.tempmin;
        }
        if (BT5JSON.metadata.tempmax > BT5Obj[title].metadata.tempmax) {
            BT5Obj[title].metadata.tempmax = BT5JSON.metadata.tempmax;
        }
        BT5Obj[title].metadata.hpoints += parseFloat(BT5JSON.metadata.hpoints);
        BT5Obj[title].metadata.hfsum += parseFloat(BT5JSON.metadata.hfsum);
        if (BT5JSON.metadata.hfmin < BT5Obj[title].metadata.hfmin) {
            BT5Obj[title].metadata.hfmin = BT5JSON.metadata.hfmin;
        }
        if (BT5JSON.metadata.hfmax > BT5Obj[title].metadata.hfmax) {
            BT5Obj[title].metadata.hfmax = BT5JSON.metadata.hfmax;
        }
    } else {
        BT5Obj[title] = BT5JSON;
    }
    BT5Obj[title].data[0].sort(predicatBy(0));
    return (BT5Obj);
}