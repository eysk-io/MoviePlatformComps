class MultiViewPieTip extends ToolTip {
  constructor(id, data, ...elts) {
    super(id, data, elts);
  }

  generateChart() {
    const total = this._data.reduce((a, b) => a + b, 0);

    this._elts.forEach((elt) => {
      elt.on('mouseover', (_e, d) => {
        let metrics = '';
        Object.keys(d.value).forEach((k, i) => {
          if (i === 0) {
            metrics += `<p>${k}: ${total}</p>`;
          } else {
            metrics += `<p>${k}: ${this._data[i - 1]}</p>`;
          }
        });
        d3.select(`#${this._id}`)
          .style('opacity', 1)
          .style('z-index', 5)
          .html(`
            <p>Rotten Tomatoes Score: ${d.group}</p>
            <p>Financial Performance: ${d.variable}</p>
            ${metrics}
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
