window.d3.selection.prototype.customChart = function ( params ) {
    var width = params.margin.fullWidth - params.margin.left - params.margin.right;
    var height = params.margin.fullHeight - params.margin.top - params.margin.bottom;
    var svgContent = initializeSvg(this, params.margin, width, height);

    initializeDateSelectionArea(svgContent.select('.date-selection-area'), params, width, height, function ( dateRange ) {
        // TODO: add debounce in here
        getJson(dateRange).then(rerenderChart).then(function () {
            window.setTimeout(function () {
                getJson(dateRange).then(rerenderChart);
            }, 1000)
        });
    });

    var yRange = d3.scale.linear().range([ height, 0 ]);
    var xRange = d3.scale.ordinal().rangeRoundBands([ 0, width ], 0.08);
    var xAxis = d3.svg.axis().ticks(10).orient('bottom');

    function values( d ) {return d.values;}

    function rerenderChart( chartData ) {
        var chartArea = svgContent.select('.chart-area');
        var layers = d3.layout.stack().values(values)(chartData);
        yRange.domain([ 0, d3.max(layers, function ( stackedDatas ) {
            return d3.max(stackedDatas.values, function ( d ) { return d.y0 + d.y});
        }) ]);
        xRange.domain(d3.range(chartData[ 0 ].values.length));

        function y( d ) {return yRange(d.y0 + d.y);}

        function h( d ) {return yRange(d.y0) - yRange(d.y0 + d.y);}

        chartArea.select('.our-super-chart').superEnter('g', layers, {
            fill: pickColor
        }).superEnter('rect', values, {
            width: xRange.rangeBand(),
            x: function ( d ) {return xRange(d.x)},
            y: y,
            height: h
        }).transition().duration(500).attr({ y: y, height: h });

        chartArea.select('.x.axis').attr('transform', 'translate(0,' + (height - 60) + ')').call(xAxis.scale(xRange));
    }
};
