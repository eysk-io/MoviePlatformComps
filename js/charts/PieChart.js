class PieChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 300,
      containerHeight: _config.containerHeight || 300,
      margin: _config.margin || {
        top: 20, right: 20, bottom: 20, left: 60,
      },
      colors: _config.colors,
      utils: _config.functions,
    };
    this.colorsList = new Array(_config.colors.length);
    this.getAllPlatforms = _config.functions.getAllPlatforms;

    this.data = _data;
    this.initVis();
  }

  initVis() {
    const vis = this;
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.radius = Math.min(vis.width, vis.height) / (2 - vis.config.margin.top);
    vis.platforms = vis.getAllPlatforms(vis.data);

    // vis.config.colors.platformColors

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.title = vis.svg.append('g')
      .append('text')
      .attr('class', 'chart-header')
      .text('Number of Movies by Platform')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  }

  updateVis() {
    const vis = this;

    vis.renderVis();
  }

  renderVis() {
    
    const vis = this;
    vis.platformMap = {
      'Netflix': 'netflix',
      'Hulu': 'hulu',
      'Prime Video': 'amazon',
      'Disney+': 'disney'
    }
    vis.platformMovieCount = d3.rollups(this.data, (v) => v.length, (d) => d.platform);
    vis.platformMovieCountJSON = {}
    vis.platformMovieCount.forEach(element => {
      vis.platformMovieCountJSON[element[0]] = element[1]
    })

    // console.log(vis.platformMovieCountJSON)

    // console.log(Object.values(vis.config.colors.platformColors))

    const chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left + 100},${vis.config.margin.top + 150})`);

    const pie = d3.pie()
                .value(function(d) {
                  return d[1];
                 });
    var data_ready = pie(Object.entries(vis.platformMovieCountJSON))

    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(100);

    const arcs = chart.selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('fill', (d, i) => {
        return  vis.config.colors.platformColors[vis.platformMap[d.data[0]]]
      })
      .attr('d', arcGenerator);

    const labels = chart.selectAll('text')
      .data(data_ready)
      .join('text')
      .text((d) => d.data[1])
      .attr('transform', (d) => `translate(${arcGenerator.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 14)
      .style('fill', 'white');
  }
}
