window.d3.selection.prototype.superEnter = function ( tag, data, attrs, opt_class ) {
    var enteredSelection = this.selectAll(tag).data(data);
    enteredSelection.enter().append(tag).attr(attrs).attr('class', opt_class);
    enteredSelection.exit().remove();
    return enteredSelection;
};