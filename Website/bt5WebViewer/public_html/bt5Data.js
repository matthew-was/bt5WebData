/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

singleBT5 = function(file) {
    var data = [];
    for (var i=0; i<file.points; i++) {
        try {
            a2 = file.column["a2"][i];
            monitor = file.column["monitor"][i];
            sum = file.counts[i][1] + file.counts[i][2] + file.counts[i][4] + file.counts[i][5] + file.counts[i][6];
            total = sum * 1000000 / monitor;
            data.push([parseFloat(a2), parseInt(total)]);
        } catch(err) 
        {
            console.log(file.filename + " has error " + err.message);
        }
    }    
    var plottable_data = {
        'type': '1d',
        'title': file.comment,
        'metadata': {},
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
