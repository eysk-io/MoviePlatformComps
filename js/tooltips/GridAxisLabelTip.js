/**
 * This class represents the GridChart's axis labels' tooltip.
 * The tooltip pops up when the user hovers over each axis header.
 */
class GridAxisLabelTip extends ToolTip {
  constructor(id, data, tipHtml, ...elts) {
    super(id, data, elts);
    this._tipHtml = tipHtml;
  }

  generateChart() {
    this._elts.forEach((elt) => {
      elt.on('mouseover', () => {
        d3.select(`#${this._id}`)
          .style('opacity', 1)
          .style('z-index', 5)
          .html(this._tipHtml);
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
