d3.simpleDebounce = function ( fn, waitPeriod ) {
    var timeout;
    return function () {
        clearTimeout(timeout);
        var args = arguments;
        timeout = setTimeout(function () {
            fn.apply(null, args);
        }, waitPeriod);
    }
};