window.d3.selection.prototype.brushDatePicker = (function () {
    var prevDate2;

    function getUpdatedRangeFromExtent( currentDateExtent ) {
        var date1, date2;
        // if dragging, preserve the width of the extent
        if ( d3.event.mode === 'move' ) {
            date1 = d3.time.day.round(currentDateExtent[ 0 ]);
            date2 = d3.time.day.offset(date1, Math.round((currentDateExtent[ 1 ] - currentDateExtent[ 0 ]) / 864e5))
        } else { // otherwise, if resizing, round both dates
            var extent1 = currentDateExtent.map(d3.time.day.round);
            date1 = extent1[ 0 ];
            date2 = extent1[ 0 ];
            // if empty when rounded, use floor & ceil instead
            if ( date1 >= date2 ) {
                date1 = d3.time.day.floor(currentDateExtent[ 0 ]);
                date2 = d3.time.day.ceil(currentDateExtent[ 1 ]);
            }
        }
        prevDate2 = date2;
        return [ date1, date2 ];
    }

    function initDom() {
        // TODO: if component will be reused, create a remove method to clean $$ fields
        // to prevent memory leaks
        var content = this.append('g').attr({ 'class': 'content' });
        this.$$content = content;
        this.$$backgroundBlock = content.append('rect').attr({ 'class': 'grid-background' });
        this.$$xGrid = content.append('g').attr({ 'class': 'x grid' });
        this.$$xAxis = content.append('g').attr({ 'class': 'x axis' });
        this.$$brush = content.append('g').attr({ 'class': 'brush' });
    }

    function initData( params ) {
        var margin = params.margin;
        this.margin = margin;
        this.width = margin.fullWidth - margin.left - margin.right;
        this.height = margin.fullHeight - margin.top - margin.bottom;
        this.params = params;

        var todaysMidnight = new Date();
        todaysMidnight.setHours(0, 0, 0, 0);
        this.xDayScale = d3.time.scale().domain([ new Date(2015, 7, 1), todaysMidnight - 1 ]);
    }

    function getAxis( xDayScale ) {
        return d3.svg.axis().orient('bottom').ticks(d3.time.months, 1).tickPadding(0).scale(xDayScale);
    }

    function transform( a, b ) { return { transform: 'translate(' + (a || 0) + ',' + (b || 0) + ')' };}

    function updateDom() {
        this.attr({
            width: this.width + this.margin.left + this.margin.right,
            height: this.height + this.margin.top + this.margin.bottom
        });

        this.$$content.attr(transform(this.margin.left, this.margin.top));

        var params = this.params;

        this.$$backgroundBlock.attr({ width: this.width, height: params.brushHeight });

        this.xDayScale.range([ 0, this.width ]);
        this.$$xAxis.attr(transform(0, params.brushHeight))
            .call(getAxis(this.xDayScale))
            .selectAll('text').attr('x', 6).style('text-anchor', 'start');
        this.$$xGrid.attr(transform(0, params.brushHeight))
            .call(getAxis(this.xDayScale).tickSize(-this.height).tickFormat(''))
            .selectAll('.tick').classed('minor', function ( date ) {return date.getHours();});

        var brushFn = d3.svg.brush().x(this.xDayScale).extent(params.dateSelection).on('brush', function () {
            var dates = getUpdatedRangeFromExtent(brushFn.extent());
            d3.select(this).call(brushFn.extent(dates));
            params.dateUpdated(dates);
        });
        this.$$brush.call(brushFn).selectAll('rect').attr('height', params.brushHeight);
        params.dateUpdated(params.dateSelection);
    }

    return function ( params ) {
        initData.call(this, params);
        return this.call(initDom).call(updateDom);
    }
})();