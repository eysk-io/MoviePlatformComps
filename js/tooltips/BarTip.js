class BarTip extends ToolTip {
  constructor(id, data, ...elts) {
    super(id, data, elts);
  }

  generateChart() {
    this._elts.forEach((elt) => {
      elt.on('mouseover', (_e, d) => {
        const path = _e.path[1];
        const platform = path.id;

        // Select top 5 box office movies
        const selectedPlatform = platform;
        const selectedGenre = d.key;
        const sampleMovies = [];
        let filteredData = this._data;

        filteredData = this._data.filter((i) => (
          i.platform === selectedPlatform && i.genre === selectedGenre));
        // convert gross to numeric field before sorting
        filteredData.forEach((fd) => {
          Object.keys(fd).forEach((attr) => {
            if (attr === 'gross') {
              fd[attr] = +fd[attr];
            }
          });
        });

        filteredData.sort((a, b) => b.gross - a.gross);
        // check for < 5 rows of filtered data
        let rows = 5;
        if (filteredData.length < 5) {
          rows = filteredData.length;
        }

        let i = 0;
        while (i < filteredData.length && i < rows) {
          sampleMovies.push(filteredData[i]);
          i += 1;
        }
        // currency formatter
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        });

        // Create tooltip with top grossing  movies
        let listItems = '';
        sampleMovies.forEach((m) => {
          listItems += `<li class='tooltip-list-item'><b class='tooltip-list-item'>${m.Title}</b> 🎫 ${formatter.format(m.gross)}`;
        });

        d3.select(`#${this._id}`)
          .style('opacity', 1)
          .style('z-index', 5)
          .html(`
          <div class='tooltip-list'>
            <b class='tooltip-list'>${selectedPlatform}-${selectedGenre}</b></br>
            <i class='tooltip-list'>Top Box Office Movies by Platform and Genre</i>
          </div>
          <ol class='tooltip-list'>
            ${listItems}
          </ol>
        `);
      }).on('mousemove', (e) => {
        d3.select(`#${this._id}`)
          .style('left', `${e.pageX - 40}px`)
          .style('top', `${e.pageY - 140}px`);
      }).on('mouseleave', () => {
        d3.select(`#${this._id}`)
          .style('opacity', 0)
          .style('z-index', -5);
      });
    });
  }
}
