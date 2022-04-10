class GridYAxisLabelTip extends ToolTip {
  constructor(id, data, ...elts) {
    super(id, data, elts);
  }

  generateChart() {
    const tipHtml = '<span></b>Segmented Financial Performance (Y-Axis):</b></span></br></br>'
      + '"Financial Performance" is calculated by taking each movie\'s <span><strong><i>log<sub>e</sub>(Gross Revenue/Cost)</i></strong></span>.<br><br>'
      + 'Each row of the y-axis (LOW, MED, HIGH) contains an equal range of the calculated Financial Performance.';

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
