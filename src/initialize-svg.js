function initializeSvg( selection, margin, width, height ) {
    return selection.html(d3.select('script#custom-chart-template').text()).select('svg').attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).select('.content').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}

var called = false;
function getJson() {
    function dateToString( dt ) {
        return '' + (dt.getFullYear()) + '-' + (dt.getMonth() + 1) + '-' + (dt.getDate())
    }

    var url = false && '/api/data/salesstatus/' + dateToString(params.dateSelection[ 0 ]) + '/' + dateToString(params.dateSelection[ 1 ]);
    return new Promise(function ( success ) {
        d3.json(called ? '/stubs/2015-08-01to2015-08-03-2.json' : '/stubs/2015-08-01to2015-08-03.json').get(function ( error, json ) {
            success(json);
            called = !called;
        });
    })
}