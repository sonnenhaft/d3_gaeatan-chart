window.d3.selection.prototype.customChart = function ( params ) {
    var width = params.margin.fullWidth - params.margin.left - params.margin.right;
    var height = params.margin.fullHeight - params.margin.top - params.margin.bottom;
    var svgContent = initializeSvg(this, params.margin, width, height);

    initializeDateSelectionArea(svgContent.select('.date-selection-area'), params, width, height, function ( dateRange ) {
        getJson(dateRange).then(rerenderChart);
    });

    function rerenderChart( chartData ) {
        var chartArea = svgContent.select('.chart-area');
        var days = chartData[ 0 ].values.length;
        var stackedDatas = d3.layout.stack().values(function ( d ) {
            return d.values;
        })(chartData);

        var yStackMax = d3.max(stackedDatas, function ( stackedDatas ) {
            return d3.max(stackedDatas.values, function ( d ) {
                return d.y0 + d.y;
            });
        });

        var xRange = d3.scale.ordinal().domain(d3.range(days)).rangeRoundBands([ 0, width ], 0.08);
        var yRange = d3.scale.linear().domain([ 0, yStackMax ]).range([ height, 0 ]);
        yRange.domain([ 0, yStackMax ]);

        var xAxis = d3.svg.axis().ticks(20).scale(xRange).orient('bottom');
        chartArea.select('.x.axis').attr('transform', 'translate(0,' + (height - 70) + ')').call(xAxis);

        var layer = chartArea.select('.our-super-chart').selectAll('.layer').data(stackedDatas).enter().append('g').attr('class', 'layer').style('fill', pickColor);
        var rect = layer.selectAll('rect').data(function ( d ) {
            return d.values;
        }).enter().append('rect').attr({
            x: function ( d ) {return xRange(d.x)},
            width: xRange.rangeBand(),
            y: function ( d ) {return yRange(d.y0 + d.y);},
            height: function ( d ) {return yRange(d.y0) - yRange(d.y0 + d.y);}
        });
    }
};

