//modified from https://github.com/dfm/optimize.js


var p0, i, x, truth, model = function (a, x) {
    'use strict';
    var i, j, result = [],
        sig2 = a[1] * a[1],
        norm,
        diff;
    norm = a[0] / Math.sqrt(2 * Math.PI * sig2);

    x = optimize.vector.atleast_1d(x);
    a = optimize.vector.atleast_1d(a);

    for (i = 0; i < x.length; i += 1) {
        diff = x[i] - a[2];
        result.push(norm * Math.exp(-0.5 * diff * diff / sig2));
    }

    for (j = 3; j < a.length; j += 1) {
        for (i = 0; i < x.length; i += 1) {
            result[i] += a[j] * Math.pow(x[i], j - 3);
        }
    }
    return result;
};

var do_fit = function (data, medianVal, maxVal) {
    'use strict';
    var i, p1, chi, chi2, order = window.order, xrange = [-1, 1];

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

    chi = function (p) {
        var i, chi = [];
        if (Math.abs(p[1]) > (xrange[1] - xrange[0]) || p[2] > xrange[1] || p[2] < xrange[0]) {
            for (i = 0; i < data.length; i += 1) {
                chi.push(1e10);
            }
        }
        for (i = 0; i < data.length; i += 1) {
            chi.push((data[i].y - model(p, data[i].x)[0]));
        }
        return chi;
    };
    chi2 = function (p) {
        var c = chi(p);
        return optimize.vector.dot(c, c);
    };
    //p1 = optimize.newton(chi, p0);
    p1 = optimize.fmin(chi2, p0);

    return p1[2];
};

var firstData = function (data) {
    'use strict';

    var objLength = data.length,
        objData = data,
        fitdata = [],
        medianData = [],
        i,
        medianVal,
        maxVal,
        offsetVal;
    for (i = 0; i < objLength; i += 1) {
        if (objData[i][0] >= -1 && objData[i][0] <= 0.6) {
            fitdata.push(i);
            fitdata[i] = {};
            fitdata[i].x = objData[i][0];
            fitdata[i].y = objData[i][1];
            medianData[i] = objData[i][1];
        }
    }

    function median(values) {
        values.sort(function (a, b) {
            return a - b;
        });
        var half = Math.floor(values.length / 2);
        if (values.length % 2) {
            return values[half];
        } else {
            return (values[half - 1] + values[half]) / 2.0;
        }
    }

    medianVal = median(medianData);
    maxVal = Math.max.apply(null, medianData);
    offsetVal = do_fit(fitdata, medianVal, maxVal);

    return offsetVal;


};