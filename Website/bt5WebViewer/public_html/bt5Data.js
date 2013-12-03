/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

singleBT5 = function(file) {
    var data = [];
    var meta = {};
    for (var i=0; i<file.points; i++) {
        try {
            a2 = file.column["a2"][i];
            monitor = file.column["monitor"][i];
            sum = file.counts[i][1] + file.counts[i][2] + file.counts[i][4] + file.counts[i][5] + file.counts[i][6];
            total = sum * 1000000 / monitor;
            data.push([parseFloat(a2), parseFloat(total)]);
            meta.date = file.date;
        } catch(err) {}
    }
    if (typeof(file.column["temp"]) === "object") {
        var tempmin = parseFloat(Math.min.apply( Math, file.column["temp"]));
        var tempmax = parseFloat(Math.max.apply( Math, file.column["temp"]));
        var tempsum = 0;
        var tpoints = parseInt(file.column["temp"].length);
        for (j=0; j<tpoints; j++) {
            tempsum += parseFloat(file.column["temp"][j]);
        }
        meta.tempmin = tempmin;
        meta.tempmax= tempmax;
        meta.tempsum= tempsum;
        meta.tpoints = tpoints;
    }
    if (typeof(file.column["h-field"]) === "object") {
        var hfmin = parseFloat(Math.min.apply( Math, file.column["h-field"]));
        var hfmax = parseFloat(Math.max.apply( Math, file.column["h-field"]));
        var hfsum = 0;
        var hpoints = parseInt(file.column["h-field"].length);
        for (j=0; j<hpoints; j++) {
            hfsum += parseFloat(file.column["h-field"][j]);
        }
        meta.hfmin = hfmin;
        meta.hfmax= hfmax;
        meta.hfsum= hfsum;
        meta.hpoints = hpoints;
    }
    
    var plottable_data = {
        'type': '1d',
        'title': file.comment,
        'metadata': meta,
        'options': {
            'axes': {
                'xaxis': {'label': "a2"},
                'yaxis': {'label': "Counts x 10^6 / Monitor"}
            },
            'series': [{'label': file.filename}]
        },
        'xlabel': 'X',
        'ylabel': 'Y',
        'data': [data]
    };
    return plottable_data;
};

    function predicatBy(prop){
        return function(a,b){
            if( a[prop] > b[prop]){
                return 1;
            }else if( a[prop] < b[prop] ){
                return -1;
            }
            return 0;
        };
    }
    
compileBT5Object = function(BT5Obj, BT5JSON, title) {
    if (title in BT5Obj) {
        for(var j=0;j<BT5JSON["data"][0].length;j++) {
            BT5Obj[title]["data"][0].push(BT5JSON["data"][0][j]);
        };
        if (BT5Obj[title].metadata.date.valueOf() > BT5JSON.metadata.date.valueOf()) {
            try {
                BT5Obj[title]["metdata"]["date"] = BT5JSON["metadata"]["date"];
            } catch (err) {
                console.log(err);
            }
        }
        BT5Obj[title]["metadata"]["tpoints"] += parseFloat(BT5JSON["metadata"]["tpoints"]);
        BT5Obj[title]["metadata"]["tempsum"] += parseFloat(BT5JSON["metadata"]["tempsum"]);
        if (BT5JSON["metadata"]["tempmin"] < BT5Obj[title]["metadata"]["tempmin"]) {
            BT5Obj[title]["metadata"]["tempmin"] = BT5JSON["metadata"]["tempmin"];
        }
        if (BT5JSON["metadata"]["tempmax"] > BT5Obj[title]["metadata"]["tempmax"]) {
            BT5Obj[title]["metadata"]["tempmax"] = BT5JSON["metadata"]["tempmax"];
        }
        BT5Obj[title]["metadata"]["hpoints"] += parseFloat(BT5JSON["metadata"]["hpoints"]);
        BT5Obj[title]["metadata"]["hfsum"] += parseFloat(BT5JSON["metadata"]["hfsum"]);
        if (BT5JSON["metadata"]["hfmin"] < BT5Obj[title]["metadata"]["hfmin"]) {
            BT5Obj[title]["metadata"]["hfmin"] = BT5JSON["metadata"]["hfmin"];
        }
        if (BT5JSON["metadata"]["hfmax"] > BT5Obj[title]["metadata"]["hfmax"]) {
            BT5Obj[title]["metadata"]["hfmax"] = BT5JSON["metadata"]["hfmax"];
        }
    } else {
        BT5Obj[title] = BT5JSON;
    }
    BT5Obj[title]["data"][0].sort(predicatBy(0));
    return (BT5Obj);
};