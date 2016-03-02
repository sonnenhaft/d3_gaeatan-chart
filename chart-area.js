window.d3.selection.prototype.customChart = function ( params ) {
    var width = params.margin.fullWidth - params.margin.left - params.margin.right;
    var height = params.margin.fullHeight - params.margin.top - params.margin.bottom;
    var svgContent = initializeSvg(this, params.margin, width, height);

    initializeDateSelectionArea(svgContent.select('.date-selection-area'), params, width, height, simpleThrottle(function ( dateRange ) {
        getJson(dateRange).then(rerenderChart);
    }, 1000));

    var yScale = d3.scale.linear().range([ height - 60, 0 ]);

    function y( d ) {return yScale(d.y0 + d.y);}

    function h( d ) {return yScale(d.y0) - yScale(d.y0 + d.y);}

    function values( d ) {return d.values;}

    var bottomAxis = d3.svg.axis().orient('bottom').tickSize(10, 0);

    function rerenderChart( chartData ) {
        var chartArea = svgContent.select('.chart-area');
        var layers = d3.layout.stack().values(values)(chartData);
        var yMax = d3.max(layers, function ( d ) {
            return d3.max(values(d), function ( d ) { return d.y0 + d.y});
        });
        yScale.domain([ 0, yMax ]);

        var tooltip = d3.select('#tooltip');
        var xMax = chartData[ 0 ].values.length;
        var range = d3.range(xMax);
        var xScale = d3.scale.ordinal().rangeBands([ 0, width ], 0.1).domain(range);
        chartArea.select('.our-super-chart').bindData('g', layers, { fill: dataUi.pickColor }).bindData('rect', values, {
            width: xScale.rangeBand(),
            x: function ( d, i ) { return xScale(i);},
            y: y,
            height: h,
            stroke: '#E61610',
            'stroke-width': 0
        }).on({
            mouseover: function ( d ) {
                d3.select(this).attr({ 'stroke-width': 1 });
                tooltip.style({
                    left: d3.event.pageX - 45 + 'px',
                    top: d3.event.pageY - 80 + 'px'
                }).transition().duration(100).style({ opacity: 1 });
                tooltip.select('.number').text(d.y);
                tooltip.select('.max').text(yMax);
                tooltip.select('.percent').text(d3.round(d.y / yMax * 100));
            },
            mouseout: function () {
                d3.select(this).attr({ 'stroke-width': 0 });
                tooltip.transition().duration(500).style('opacity', 0);
            }
        }).transition().duration(500).attr({ y: y, height: h });

        bottomAxis.tickValues(d3.range(0, xMax, d3.round(xMax / 4))).scale(xScale);
        chartArea.select('.x.axis').attr('transform', 'translate(' + 0 + ',' + (height - 57) + ')').call(bottomAxis);
    }
};
