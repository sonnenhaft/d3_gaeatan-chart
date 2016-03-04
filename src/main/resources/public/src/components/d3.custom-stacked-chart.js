window.d3.selection.prototype.customStackedChart = function ( params ) {
    var width = params.fullWidth - params.left - params.right;
    var height = params.fullHeight - params.top - params.bottom;

    this.width = width;
    this.height = height;
    this.margin = params;

    this.attr({
        width: this.width + this.margin.left + this.margin.right,
        height: this.height + this.margin.top + this.margin.bottom
    });
    this.select('.content').attr({ transform: 'translate(' + this.margin.left + ',' + this.margin.top + ')' });

    var yScale = d3.scale.linear().range([ height - 60, -60 ]);

    function y( d ) {return yScale(d.y0 + d.y);}

    function h( d ) {return yScale(d.y0) - yScale(d.y0 + d.y);}

    function values( d ) {return d.values;}

    var bottomAxis = d3.svg.axis().orient('bottom').tickSize(10, 0);

    var svgContent = this;
    var selected;
    return function ( chartData ) {
        var chartArea = svgContent.select('.chart-area');
        var layers = d3.layout.stack().values(values)(chartData);
        var yMax = d3.max(layers, function ( d ) {
            return d3.max(values(d), function ( d ) { return d.y0 + d.y});
        });
        yScale.domain([ 0, yMax ]);

        var tooltip = d3.select('#tooltip').style('opacity', 0);
        var xMax = chartData[ 0 ].values.length;
        var range = d3.range(xMax);
        var xScale = d3.scale.ordinal().rangeBands([ 0, width ], 0.1, 0).domain(range);

        var x = function ( ignored, i ) { return xScale(i);};
        selected = null;
        chartArea.select('.our-super-chart').bindData('g', layers, { fill: dataUI.pickColor }).bindData('rect', values, {
            x: x,
            width: xScale.rangeBand(),
            y: y,
            height: h,
            stroke: '#E61610',
            'stroke-width': 0
        }).on({
                click: function ( values, valueIndex, layerIndex ) {
                    var layer = layers[ layerIndex ];
                    params.onSelected(layer, valueIndex);
                },
                mouseover: function ( values, valueIndex, layerIndex ) {
                    d3.select(this).attr({ 'stroke-width': 1 });
                    tooltip.style({
                        left: d3.event.clientX + 10 + 'px',
                        top: d3.event.clientY - 50 + 'px'
                    }).transition().duration(100).style({ opacity: 1 });
                    tooltip.select('.number').text(values.y);
                    tooltip.select('.max').text(yMax);
                    tooltip.select('.percent').text(d3.round(values.y / yMax * 100));
                    var layer = layers[ layerIndex ];
                    tooltip.select('.label').text(layer.label);
                },
                mouseout: function () {
                    d3.select(this).attr({ 'stroke-width': 0 });
                    tooltip.transition().duration(500).style('opacity', 0);
                }
            })
            .attr({ x: x, width: xScale.rangeBand(), 'stroke-width': 0 })
            .transition().duration(500)
            .attr({ y: y, height: h });

        bottomAxis.tickValues(d3.range(0, xMax, d3.round(xMax / 4))).scale(xScale);
        chartArea.select('.x.axis').attr('transform', 'translate(' + 0 + ',' + (height - 57) + ')').call(bottomAxis);
    }
};
