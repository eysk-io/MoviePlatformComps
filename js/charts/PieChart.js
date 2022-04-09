class PieChart {
  // Class constructor with initial configuration
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 290,
      containerHeight: _config.containerHeight || 300,
      margin: _config.margin || {
        top: 20, right: 20, bottom: 20, left: 60,
      },
      colors: _config.platformColors,
      platforms: _config.platforms,
      utils: _config.functions,
    };
    this.colorsList = new Array(_config.platformColors.length);

    this.data = _data;
    this.initVis();
  }

  // Initialize the svg container, scales, axes, and append static elements
  initVis() {
    // Calculate inner chart size. Margin specifies the space around the actual chart.
    const vis = this;
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.radius = Math.min(vis.width, vis.height) / (2 - vis.config.margin.top);

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    // Add title
    vis.title = vis.svg.append('g')
      .append('text')
      .attr('class', 'chart-header')
      .text('Number of Movies by Platform')
      .style('font-size', 16)
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    vis.renderVis();
  }

  renderVis() {
    const vis = this;
    vis.platformMap = {
      Netflix: 'Netflix',
      Hulu: 'Hulu',
      'Prime Video': 'Prime',
      'Disney+': 'Disney',
    };
    // Get count of movies for each platform
    vis.platformMovieCount = d3.rollups(this.data, (v) => v.length, (d) => d.platform);
    vis.platformMovieCountJSON = {};
    vis.platformMovieCount.forEach((element) => {
      const [currElt, nextElt, ...rest] = element;
      vis.platformMovieCountJSON[currElt] = nextElt;
    });

    const chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left + 100},${vis.config.margin.top + 150})`);

    // Create pie chart
    const pie = d3.pie()
      .value((d) => d[1]);
    const pieData = pie(Object.entries(vis.platformMovieCountJSON));

    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(100);

    // Add pie chart slices
    const arcs = chart.selectAll('path')
      .data(pieData)
      .join('path')
      .attr('fill', (d) => vis.config.colors[vis.platformMap[d.data[0]]])
      .attr('d', arcGenerator);

    // At labels to each slice of the pie chart
    const labels = chart.selectAll('text')
      .data(pieData)
      .join('text')
      .text((d) => d.data[1])
      .attr('transform', (d) => `translate(${arcGenerator.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 14)
      .style('fill', 'white');

    // Add tooltips
    arcs.on('mouseover', (event, d) => {
      const selectedPlatform = d.data[0];
      const sampleMovies = [];
      const dataCopy = structuredClone(vis.data);
      dataCopy.sort((a, b) => (a['Rotten Tomato Score'] > b['Rotten Tomato Score'] ? 1 : -1));
      let numMovies = 0;
      let i = 0;
      while (numMovies < 5) {
        if (dataCopy[i].platform === selectedPlatform) {
          sampleMovies.push(vis.data[i]);
          numMovies += 1;
        }
        i += 1;
      }
      d3.select('#pie-chart-tooltip')
        .style('opacity', 1)
        .html(`
        <div class=${'pie-chart-list'}>
          <b  class=${'pie-chart-list'}>${selectedPlatform}</b>
        </div>
        <div class=${'pie-chart-list'}>
          <i  class=${'pie-chart-list'}>Top Rated Movies</i>
        </div>
        <ol class=${'pie-chart-list'}>
          <li class=${'pie-chart-list'}><b class=${'pie-chart-list'}>${sampleMovies[0].Title}</b> 🍅 ${sampleMovies[0]['Rotten Tomato Score']}%</li>
          <li class=${'pie-chart-list'}><b class=${'pie-chart-list'}>${sampleMovies[1].Title}</b> 🍅 ${sampleMovies[1]['Rotten Tomato Score']}%</li>
          <li class=${'pie-chart-list'}><b class=${'pie-chart-list'}>${sampleMovies[2].Title}</b> 🍅 ${sampleMovies[2]['Rotten Tomato Score']}%</li>
          <li class=${'pie-chart-list'}><b class=${'pie-chart-list'}>${sampleMovies[3].Title}</b> 🍅 ${sampleMovies[3]['Rotten Tomato Score']}%</li>
          <li class=${'pie-chart-list'}><b class=${'pie-chart-list'}>${sampleMovies[4].Title}</b> 🍅 ${sampleMovies[4]['Rotten Tomato Score']}%</li>
        </ol>
      `);
    })
      .on('mousemove', (event) => {
        d3.select('#pie-chart-tooltip')
          .style('left', `${event.pageX + 20}px`)
          .style('top', `${event.pageY + 20}px`);
      })
      .on('mouseleave', () => {
        d3.select('#pie-chart-tooltip').style('opacity', 0);
      });
  }
}
