/**
 * This class represents the PieChart's axis labels' tooltip.
 * The tooltip pops up when the user hovers over the pie chart.
 */
class PieTip extends ToolTip {
  constructor(id, data, ...elts) {
    super(id, data, elts);
  }

  generateChart() {
    this._elts.forEach((elt) => {
      elt.on('mouseover', (_e, d) => {
        // Select top rated movies
        const selectedPlatform = d.data[0];
        const sampleMovies = [];
        let filteredData = this._data;
        filteredData = this._data.filter((item) => item.platform === selectedPlatform);
        filteredData.sort((a, b) => (a['Rotten Tomato Score'] < b['Rotten Tomato Score'] ? 1 : -1));
        let i = 0;
        while (i < filteredData.length && i < 5) {
          sampleMovies.push(filteredData[i]);
          i += 1;
        }
        // Create tooltip with top rated movies
        let listItems = '';
        sampleMovies.forEach((m) => {
          listItems += `<li class='tooltip-list-item'><b class='tooltip-list-item'>${m.Title}</b> 🍅 ${m['Rotten Tomato Score']}%</li>`;
        });

        d3.select(`#${this._id}`)
          .style('opacity', 1)
          .style('z-index', 5)
          .html(`
          <div class='tooltip-list'>
            <b class='tooltip-list'>${selectedPlatform}</b></br>
            <i class='tooltip-list'>Top Rated Movies</i>
          </div>
          <ol class='tooltip-list'>
            ${listItems}
          </ol>
        `);
      }).on('mousemove', (e) => {
        d3.select(`#${this._id}`)
          .style('left', `${e.pageX + 20}px`)
          .style('top', `${e.pageY + 20}px`);
      }).on('mouseleave', () => {
        d3.select(`#${this._id}`)
          .style('opacity', 0)
          .style('z-index', -5);
      });
    });
  }
}
