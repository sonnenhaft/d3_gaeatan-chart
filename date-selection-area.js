function initializeDateSelectionArea( svgContent, params, width, height, callback ) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var xDay = d3.time.scale().domain([ new Date(2015, 7, 1), today - 1 ]).range([ 0, width ]);

    svgContent.select('.grid-background').attr({ width: width, height: params.brushHeight });

    svgContent.select('.x.grid').attr('transform', 'translate(0,' + params.brushHeight + ')').call(d3.svg.axis()
        .scale(xDay)
        .orient('bottom')
        .ticks(d3.time.months, 1)
        .tickSize(-height)
        .tickFormat(''))
        .selectAll('.tick').classed('minor', function ( d ) {return d.getHours();});

    svgContent.select('.x.axis').attr('transform', 'translate(0,' + params.brushHeight + ')').call(d3.svg.axis()
        .scale(xDay)
        .orient('bottom')
        .ticks(d3.time.months, 1)
        .tickPadding(0))
        .selectAll('text').attr('x', 6).style('text-anchor', null);

    var brushFn = d3.svg.brush().x(xDay).extent(params.dateSelection).on('brush', function brushed() {
        var extent0 = brushFn.extent();
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

        d3.select(this).call(brushFn.extent(extent1));

        if ( extent1[ 0 ] != params.dateSelection[ 0 ] && extent1[ 1 ] != params.dateSelection[ 1 ] ) {
            params.dateSelection = extent1;
            callback(params.dateSelection);
        }
    });

    callback(params.dateSelection);

    svgContent.select('g.brush')
        .call(brushFn)
        .selectAll('rect').attr('height', params.brushHeight);
}