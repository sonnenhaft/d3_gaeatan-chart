function dateToString( dt ) {
    return '' + (dt.getFullYear()) + '-' + (dt.getMonth() + 1) + '-' + (dt.getDate())
}


(function ( d3 ) {

    var tableArea = d3.select('.table-area');

    var stubSelected = false;
    var reRenderChart = d3.select('#custom-chart').customStackedChart({
        top: 0, right: 40, bottom: 30, left: 10,
        fullWidth: 960, fullHeight: 600,
        onSelected: function ( layer, valueIndex, daysRange, layerIndex ) {
            tableArea.select('.table-label').text(layer.label);
            tableArea.select('.table-days').text((valueIndex + 1) + ' day' + (valueIndex ? 's' : ''));
            tableArea.classed('hidden', false);
            tableArea.style('opacity', 0.5);
            stubSelected = !stubSelected;
            ///api/data/sales/{from}/{to}/{status}/{day}
            d3.json('/api/data/sales/' + dateToString(daysRange[0]) + '/'+ dateToString(daysRange[1])+ '/'+ layerIndex+ '/'+ valueIndex).get(function ( e, data ) {
                var format = d3.time.format('%Y-%-m-%-d %Hh%M');
                var trs = tableArea.select('table tbody').bindData('tr', data.map(function ( d ) {
                    return [ format(new Date(d.creation)), d.name ];
                }));
                trs.style('visibility', 'hidden').transition()
                    .delay(function ( d, i ) {return i * 100; })
                    .style('visibility', 'visible');
                trs.bindData('td', function ( d ) {
                    return d;
                }).text(function ( d ) {
                    return d;
                });
                tableArea.transition().duration(500).style('opacity', 1);
            });
        }
    });

    var dataSelected = false;
    d3.select('#brushDatePicker').brushDatePicker({
        margin: {
            top: 0, right: 40, bottom: 0, left: 10,
            fullWidth: 960, fullHeight: 50
        },
        dateSelection: [ new Date(2015, 7, 1), new Date(2015, 8, 1) ],
        brushHeight: 30,
        dateUpdated: d3.simpleDebounce(function ( dateRange ) {
            //
             var url =  '/api/data/salesstatus/' + dateToString(dateRange[ 0 ]) + '/' + dateToString(dateRange[ 1 ]);
            tableArea.classed('hidden', true);
            var format = d3.time.format('%Y-%m-%d');
            d3.select('.start-date').text(format(dateRange[ 0 ]));
            d3.select('.end-date').text(format(dateRange[ 1 ]));
            d3.selectAll('.start-date, .end-date').style('opacity', 0.5);
            d3.json(url).get(function ( error, json ) {
                reRenderChart(json, dateRange);
                d3.selectAll('.start-date, .end-date').transition().duration(500).style('opacity', 1);
                dataSelected = !dataSelected;
            });
        }, 500, true) // initially was 500 in here, but looked ugly a bit
    });
})(window.d3);
