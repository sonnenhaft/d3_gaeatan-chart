(function ( d3 ) {
    var reRenderChart = d3.select('#custom-chart').customStackedChart({
        top: 0, right: 40, bottom: 30, left: 10,
        fullWidth: 960, fullHeight: 600
    });

    var called = false;
    d3.select('#brushDatePicker').brushDatePicker({
        margin: {
            top: 0, right: 40, bottom: 0, left: 10,
            fullWidth: 960, fullHeight: 50
        },
        dateSelection: [ new Date(2015, 7, 1), new Date(2015, 8, 1) ],
        brushHeight: 30,
        dateUpdated: d3.simpleThrottle(function ( dateRange ) {
            //function dateToString( dt ) {
            //     return '' + (dt.getFullYear()) + '-' + (dt.getMonth() + 1) + '-' + (dt.getDate())
            // }

            // var url = false && '/api/data/salesstatus/' + dateToString(params.dateSelection[ 0 ]) + '/' + dateToString(params.dateSelection[ 1 ]);

            var format = d3.time.format("%Y-%m-%d");
            d3.select('.start-date').text(format(dateRange[ 0 ]));
            d3.select('.end-date').text(format(dateRange[ 1 ]));
            d3.json(called ? '/stubs/2015-08-01to2015-08-03-2.json' : '/stubs/2015-08-01to2015-08-03.json').get(function ( error, json ) {
                reRenderChart(json);
                called = !called;
            });
        }, 1000)
    });
})(window.d3);