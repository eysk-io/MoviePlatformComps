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

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left + 100},${vis.config.margin.top + 150})`);

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

    const t = d3.transition()
      .duration(300)
      .ease(d3.easeLinear);

    const pie = d3.pie()
      .value((d) => d[1]);
    const pieData = pie(Object.entries(vis.platformMovieCountJSON));

    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(100);

    const arcs = vis.chart.selectAll('path')
      .data(pieData)
      .join('path')
      .attr('fill', (d) => vis.config.colors[vis.platformMap[d.data[0]]])
      .attr('d', arcGenerator);

    const labels = vis.chart.selectAll('text')
      .data(pieData)
      .join('text')
      .transition(t)
      .text((d) => d.data[1])
      .attr('transform', (d) => `translate(${arcGenerator.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 14)
      .style('fill', 'white');

    // Add tooltips
    new PieTip('pie-chart-tooltip', vis.data, arcs)
      .generateChart();
  }
}
