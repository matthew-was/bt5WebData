//modified from https://github.com/dfm/optimize.js


var firstData = function(data) {

    var objLength = data.length;
    var objData = data;
    var fitdata = [];
    var medianData = [];
    for (i = 0; i < objLength; i++) {
        if (objData[i][0] >= -1 && objData[i][0] <= 0.6) {
            fitdata.push(i);
            fitdata[i] = {};
            fitdata[i].x = objData[i][0];
            fitdata[i].y = objData[i][1];
            medianData[i] = objData[i][1];
        }
    }

    function median(values) {
        values.sort(function(a, b) {
            return a - b;
        });
        var half = Math.floor(values.length / 2);
        if (values.length % 2)
            return values[half];
        else
            return (values[half - 1] + values[half]) / 2.0;
    }

    var medianVal = median(medianData);
    var maxVal = Math.max.apply(null, medianData);
    var offsetVal = do_fit(fitdata, medianVal, maxVal);

    return offsetVal;


};


var p0, i, x, truth, model = function(a, x) {
    var i, j, result = [], sig2 = a[1] * a[1], norm;
    norm = a[0] / Math.sqrt(2 * Math.PI * sig2);

    x = optimize.vector.atleast_1d(x);
    a = optimize.vector.atleast_1d(a);

    for (i = 0; i < x.length; i++) {
        var diff = x[i] - a[2];
        result.push(norm * Math.exp(-0.5 * diff * diff / sig2));
    }

    for (j = 3; j < a.length; j++) {
        for (i = 0; i < x.length; i++) {
            result[i] += a[j] * Math.pow(x[i], j - 3);
        }
    }
    return result;
};

var do_fit = function(data, medianVal, maxVal) {
    var i, p1, chi;
    var order = window.order;

    var xrange = [-1, 1];

    if (order < 0) {
        window.order = 0;
        order = 0;
    }
    $("#order").text(window.order);

    //if (typeof(p0) === "undefined" || p0 === null) {
    p0 = [maxVal, 0.1, 0.1, medianVal];
    //} else {
    //    console.log(p0.length, order + 3);
    //    if (p0.length > order + 3) {
    //        p0 = p0.slice(0, order + 3);
    //    } else {
    //        for (i = p0.length; i <= order + 3; i++) p0.push(0.0);
    //    }
    //}
    //console.log(order, p0.length);

    chi = function(p) {
        var i, chi = [];
        if (Math.abs(p[1]) > (xrange[1] - xrange[0]) ||
                p[2] > xrange[1] || p[2] < xrange[0]) {
            for (i = 0; i < data.length; i++) {
                chi.push(1e10);
            }
        }
        for (i = 0; i < data.length; i++) {
            chi.push((data[i].y - model(p, data[i].x)[0]));
        }
        return chi;
    };
    chi2 = function(p) {
        var c = chi(p);
        return optimize.vector.dot(c, c);
    };
    //p1 = optimize.newton(chi, p0);
    p1 = optimize.fmin(chi2, p0);

    return p1[2];
};

