(function ( d3, isStubApi ) {
    var stubUrls = {};

    function getStubUrl( url ) {
        stubUrls[ url ] = !stubUrls[ url ];
        return url + '-' + (stubUrls[ url ] ? 1 : 2) + '.json';
    }

    var dateToString = function dateToString( dt ) {return '' + (dt.getFullYear()) + '-' + (dt.getMonth() + 1) + '-' + (dt.getDate());};
    var getApiUrl = function ( url, datesRange ) {return [ url, dateToString(datesRange[ 0 ]), dateToString(datesRange[ 1 ]) ].join('/');};
    var createLink = function ( name, link ) {return link ? [ '<a href="', link, '">', name, '</a>' ].join('') : name;};
    var firstArgumentFn = function ( d ) { return d; };

    var tableArea = d3.select('.table-area');
    var reRenderChart = d3.select('#custom-chart').customStackedChart({
        top: 0, right: 40, bottom: 30, left: 10,
        fullWidth: 960, fullHeight: 600,
        onSelected: function ( layer, valueIndex, datesRange, layerIndex ) {
            tableArea.select('.table-label').text(layer.label);
            tableArea.select('.table-days').text((valueIndex + 1) + ' day' + (valueIndex ? 's' : ''));
            tableArea.classed('hidden', false).style('opacity', 0.5);
            // /api/data/sales/{string: from}/{string: to}/{int: status}/{int: day}
            d3.json(isStubApi ? getStubUrl('stubs/sales') : [ getApiUrl('/api/data/sales', datesRange), layerIndex, valueIndex ].join('/')).get(function ( e, data ) {
                var format = d3.time.format('%Y-%-m-%-d %Hh%M');
                var trs = tableArea.select('table tbody').bindData('tr', data.map(function ( d ) {
                    return [ format(new Date(d.creation)), createLink(d.name, d.link) ];
                }));
                trs.style('visibility', 'hidden').transition()
                    .delay(function ( d, i ) {return i * 100; })
                    .style('visibility', 'visible');
                trs.bindData('td', firstArgumentFn).html(firstArgumentFn);
                tableArea.transition().duration(500).style('opacity', 1);
            });
        }
    });

    d3.select('#brushDatePicker').brushDatePicker({
        margin: {
            top: 0, right: 40, bottom: 0, left: 10,
            fullWidth: 960, fullHeight: 50
        },
        dateSelection: [ new Date(2015, 7, 1), new Date(2015, 8, 1) ],
        brushHeight: 30,
        dateUpdated: d3.simpleDebounce(function ( dateRange ) {
            tableArea.classed('hidden', true);
            var format = d3.time.format('%Y-%m-%d');
            d3.select('.start-date').text(format(dateRange[ 0 ]));
            d3.select('.end-date').text(format(dateRange[ 1 ]));
            d3.selectAll('.start-date, .end-date').style('opacity', 0.5);

            // /api/data/sales/{string: from}/{string: to}/{int: status}/{int: day}
            d3.json(isStubApi ? getStubUrl('stubs/salesstatus') : getApiUrl('/api/data/salesstatus', dateRange)).get(function ( e, json ) {
                reRenderChart(json, dateRange);
                d3.selectAll('.start-date, .end-date').transition().duration(500).style('opacity', 1);
            });
        }, 500, true) // initially was 500 in here, but looked ugly a bit
    });
})(window.d3, location.href.indexOf('stub') !== -1);
