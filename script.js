window.d3.selection.prototype.customChart = function ( params ) {
    var width = params.margin.fullWidth - params.margin.left - params.margin.right;
    var height = params.margin.fullHeight - params.margin.top - params.margin.bottom;
    var svgContent = initializeSvg(this, params.margin, width, height);

    buildDateSelection();
    getJson().then(rerenderChart);

    function buildDateSelection() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var brushHeight = 30;

        var xDay = d3.time.scale().domain([ new Date(2015, 7, 1), today - 1 ]).range([ 0, width ]);

        var brush = d3.svg.brush()
            .x(xDay)
            .extent(params.dateSelection)
            .on('brush', brushed);

        svgContent.append('rect')
            .attr('class', 'grid-background')
            .attr('width', width)
            .attr('height', brushHeight);

        svgContent.append('g')
            .attr('class', 'x grid')
            .attr('transform', 'translate(0,' + brushHeight + ')')
            .call(d3.svg.axis()
                .scale(xDay)
                .orient('bottom')
                .ticks(d3.time.months, 1)
                .tickSize(-height)
                .tickFormat(''))
            .selectAll('.tick')
            .classed('minor', function ( d ) {
                return d.getHours();
            });

        svgContent.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + brushHeight + ')')
            .call(d3.svg.axis()
                .scale(xDay)
                .orient('bottom')
                .ticks(d3.time.months, 1)
                .tickPadding(0))
            .selectAll('text')
            .attr('x', 6)
            .style('text-anchor', null);

        var gBrush = svgContent.append('g').attr('class', 'brush').call(brush);

        gBrush.selectAll('rect').attr('height', brushHeight);

        function brushed() {
            var extent0 = brush.extent();
            var extent1;

            // if dragging, preserve the width of the extent
            if ( d3.event.mode === 'move' ) {
                var d0 = d3.time.day.round(extent0[ 0 ]);
                extent1 = [
                    d0,
                    d3.time.day.offset(d0, Math.round((extent0[ 1 ] - extent0[ 0 ]) / 864e5))
                ];
            } else { // otherwise, if resizing, round both dates
                extent1 = extent0.map(d3.time.day.round);

                // if empty when rounded, use floor & ceil instead
                if ( extent1[ 0 ] >= extent1[ 1 ] ) {
                    extent1[ 0 ] = d3.time.day.floor(extent0[ 0 ]);
                    extent1[ 1 ] = d3.time.day.ceil(extent0[ 1 ]);
                }
            }

            d3.select(this).call(brush.extent(extent1));

            if ( extent1[ 0 ] != params.dateSelection[ 0 ] && extent1[ 1 ] != params.dateSelection[ 1 ] ) {
                params.dateSelection = extent1;
                getJson().then(rerenderChart);
            }
        }
    }

    function rerenderChart( chartData ) {
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
        var xAxis = d3.svg.axis().ticks(20).scale(xRange).orient('bottom');
        var yRange = d3.scale.linear().domain([ 0, yStackMax ]).range([ height, 0 ]);
        yRange.domain([ 0, yStackMax ]);

        svgContent.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);

        var layer = svgContent.selectAll('.layer').data(stackedDatas).enter().append('g').attr('class', 'layer').style('fill', pickColor);
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

