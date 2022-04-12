class GridYAxisMarkTip extends ToolTip {
  constructor(id, data, ...elts) {
    super(id, data, elts);
  }

  generateChart() {
    this._elts.forEach((elt) => {
      elt.on('mouseover', () => {
        d3.select(`#${this._id}`)
          .style('opacity', 1)
          .style('z-index', 5)
          .html(`
            <div class="tooltip-list"><b class="tooltip-list">
              ${this._data.perfBand.toUpperCase()}</b> performance 📈
            </div>
            </br>
            <div class="tooltip-list"><b class="tooltip-list">
              <b class="tooltip-list">
                ${this._data.minPerf} <= Gross Revenue/Cost < ${this._data.maxPerf}
              </b>
            </div>
          `);
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
