d3.simpleDebounce = function ( fn, waitPeriod, noFirstDelay ) {
    var timeout;
    return function () {
        var args = arguments;
        if ( noFirstDelay ) {
            noFirstDelay = false;
            fn.apply(null, args);
            return;
        }
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            fn.apply(null, args);
        }, waitPeriod);
    }
};