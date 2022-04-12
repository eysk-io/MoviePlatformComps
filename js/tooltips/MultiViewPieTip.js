class MultiViewPieTip extends ToolTip {
  constructor(id, data, ...elts) {
    super(id, data, elts);
  }

  generateChart() {
    // must this._data to get total
    // elt's data does NOT contain updated values
    const total = this._data.reduce((a, b) => a + b[1], 0);

    this._elts.forEach((elt) => {
      elt.on('mouseover', (_e, d) => {
        const sorted = this._data;
        sorted.sort((a, b) => b[1] - a[1]);

        let metrics = '';
        Object.keys(d.value).forEach((_k, i) => {
          if (i > 0) {
            metrics += `<li class='tooltip-list-item'><b class='tooltip-list-item'>${sorted[i - 1][0]}:</b> ${sorted[i - 1][1]}</li>`;
          } else {
            metrics += `<li class='tooltip-list-item'><b class='tooltip-list-item'><u class='tooltip-list-item'>TOTAL:</b> ${total}</u></li>`;
          }
        });
        d3.select(`#${this._id}`)
          .style('opacity', 1)
          .style('z-index', 5)
          .html(`
            <div class='tooltip-list'>
              <b class='tooltip-list'>
                Rotten Tomatoes Score 🍅 ${d.group}
              </b>
            </div>
            <div class='tooltip-list'>
              <b class='tooltip-list'>
                Financial Performance 💰 ${d.variable}
              </b>
            </div>
            </br>
            <div class='tooltip-list'>
              <b class='tooltip-list'>
                Number of Movies by Platform
              </b>
              </br>
              <b class='tooltip-list'>
                Ranked from Most to Least:
              </b>
            </div>
            <ul class='tooltip-list'>
              ${metrics}
            </ul>
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
