class PieTip {
  constructor(id, elt, data) {
    this._id = id;
    this._elt = elt;
    this._data = data;
  }

  generateChart() {
    this._elt.on('mouseover', (_e, d) => {
      const selectedPlatform = d.data[0];
      const sampleMovies = [];
      const dataCopy = structuredClone(this._data);
      dataCopy.sort((a, b) => (a['Rotten Tomato Score'] > b['Rotten Tomato Score'] ? 1 : -1));
      let numMovies = 0;
      let idx = 0;
      while (numMovies < 5) {
        if (dataCopy[idx].platform === selectedPlatform) {
          sampleMovies.push(this._data[idx]);
          numMovies += 1;
        }
        idx += 1;
      }

      let listItems = '';
      sampleMovies.forEach((m) => {
        listItems += `<li class=${'pie-chart-list'}><b class=${'pie-chart-list'}>${m.Title}</b> 🍅 ${m['Rotten Tomato Score']}%</li>`;
      });

      d3.select(this._id)
        .style('opacity', 1)
        .style('z-index', 5)
        .html(`
        <div class=${'pie-chart-list'}>
          <b  class=${'pie-chart-list'}>${selectedPlatform}</b>
        </div>
        <div class=${'pie-chart-list'}>
          <i  class=${'pie-chart-list'}>Top Rated Movies</i>
        </div>
        <ol class=${'pie-chart-list'}>
          ${listItems}
        </ol>
      `);
    }).on('mousemove', (e) => {
      d3.select(this._id)
        .style('left', `${e.pageX + 20}px`)
        .style('top', `${e.pageY + 20}px`);
    }).on('mouseleave', () => {
      d3.select(this._id)
        .style('opacity', 0)
        .style('z-index', -5);
    });
  }
}
