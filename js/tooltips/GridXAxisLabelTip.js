class GridXAxisLabelTip extends ToolTip {
  constructor(id, data, ...elts) {
    super(id, data, elts);
  }

  generateChart() {
    const tipHtml = '<span></b>Segmented Rotten Tomatoes Score (X-Axis):</b></span></br></br>'
      + 'Each column of the x-axis (LOW, MED, HIGH) contains an equal range of Rotten Tomatoes Score, which range is based on the entire dataset.';

    this._elts.forEach((elt) => {
      elt.on('mouseover', () => {
        d3.select(`#${this._id}`)
          .style('opacity', 1)
          .style('z-index', 5)
          .html(tipHtml);
      }).on('mousemove', (e) => {
        d3.select(`#${this._id}`)
          .style('left', `${e.pageX + 20}px`)
          .style('top', `${e.pageY + 20}px`);
      }).on('mouseout', () => {
        d3.select(`#${this._id}`)
          .style('opacity', 0)
          .style('z-index', -5);
      });
    });
  }
}
