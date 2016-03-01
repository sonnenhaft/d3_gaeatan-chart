function initializeSvg( selection, margin, width, height ) {
    return selection.html(d3.select('script#custom-chart-template').text()).select('svg').attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).select('.content').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}

var called = false;
var stubUrl = '2015-08-01to2015-08-03.json';
function getJson() {
    function dateToString( dt ) {
        return '' + (dt.getFullYear()) + '-' + (dt.getMonth() + 1) + '-' + (dt.getDate())
    }

    var url = false && '/api/data/salesstatus/' + dateToString(params.dateSelection[ 0 ]) + '/' + dateToString(params.dateSelection[ 1 ]);
    return new Promise(function ( success ) {

        if ( called ) {
            stubUrl = '2015-08-01to2015-08-03-2.json';
        }
        d3.json(url || stubUrl).get(function ( error, json ) {
            success(json);
            if ( !called ) {
                called = true;
            }
        });
    })
}

function pickColor( ignored, colorIndex ) {
    return [
            '#C4DAF1', //nouveau
            '#9FCBE1', // prise de contact
            '#F3F1D1', // Pas de contact
            '#F5EFB6', // Bascule CMU
            '#F3E765', // Vente annulée
            '#D4E8CE', // En cours
            '#DACFE8', // Terminée
            '#BFA2E3', // À facturer
            '#A06CE3', // Payé
            '#E0A99E', // 'Dossier retourné',
            '#D77C6E' // 'Post traitement'
        ][ colorIndex ] || '#ddd';
}