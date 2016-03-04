dataUI = {};

dataUI.COLORS_PALETTE = [
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
];

dataUI.DEFAULT_COLOR = '#ddd';

dataUI.pickColor = function ( ignored, colorIndex ) {
    return dataUI.COLORS_PALETTE[ colorIndex ] || dataUI.DEFAULT_COLOR;
};