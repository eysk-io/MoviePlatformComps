class PieChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 400,
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

    const colorsProps = Object.getOwnPropertyNames(vis.config.colors.platformColors);

    colorsProps.forEach((p, i) => {
      vis.colorsList[i] = vis.config.colors.platformColors[p];
    });

    vis.colorScale = d3.scaleOrdinal()
      .domain(vis.platforms)
      .range(vis.colorsList);

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

    vis.platformMovieCount = d3.rollups(this.data, (v) => v.length, (d) => d.platform);
    const data = [
      vis.platformMovieCount[0][1],
      vis.platformMovieCount[1][1],
      vis.platformMovieCount[2][1],
      vis.platformMovieCount[3][1],
    ];

    const chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left + 100},${vis.config.margin.top + 150})`);

    const pie = d3.pie();

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(100);

    const arcs = chart.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g');

    arcs.append('path')
      .attr('fill', (d, i) => {
        const value = d.data;
        return vis.colorsList[i];
      })
      .attr('d', arc);

    arcs.append('text')
      .text((d) => d.data)
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 14);

    arcs.append('text')
      .text((d) => d.data)
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 14)
      .style('fill', 'white');

    const size = 18;
    vis.legend = vis.svg.append('g');

    vis.legend.attr('transform', `translate(${190},0)`);

    vis.legend.selectAll('squares')
      .data(vis.colorsList)
      .enter()
      .append('rect')
      .attr('x', 100)
      .attr('y', (d, i) => 100 + i * (size + 5))
      .attr('width', size)
      .attr('height', size)
      .style('fill', (d) => d);

    vis.legend.selectAll('labels')
      .data(vis.platforms)
      .enter()
      .append('text')
      .attr('class', 'widget')
      .attr('x', 100 + size * 1.2)
      .attr('y', (d, i) => 100 + i * (size + 5) + (size / 2))
      .attr('text-anchor', 'left')
      .style('fill', (d, i) => vis.colorsList[i])
      .style('alignment-baseline', 'middle')
      .text((d) => d);
  }
}
