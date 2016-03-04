d3.simpleThrottle = function ( fn, restPeriod ) {
    var free = true;
    return function () {
        if ( free ) {
            fn.apply(this, arguments);
            free = false;
            setTimeout(function () {
                free = true;
            }, restPeriod)
        }
    }
};