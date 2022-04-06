class BarChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 550,
      containerHeight: 300,
      margin: {
        top: 90, right: 10, bottom: 20, left: 60,
      },
      colors: _config.colors,
      allGenres: _config.genres,
      allPlatforms: _config.platforms,
    };
    this.data = _data;

    this.getMaxGenreCount = _config.functions.getMaxGenreCount;
    this.setGenreCounts = _config.functions.setGenreCounts;
    this.crosstabFormat = _config.functions.crosstabFormat;

    this.initVis();
  }

  initVis() {
    const vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.svg.append('text')
      .attr('class', 'chart-header')
      .attr('x', vis.config.margin.left)
      .attr('y', vis.config.margin.bottom)
      .text('Number of Movies by Genre for Each Platform');

    vis.chartArea = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.chart = vis.chartArea.append('g');

    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0]);

    vis.xScale = d3.scaleBand()
      .range([0, vis.width])
      // .domain(vis.config.colors.allPlatforms)
      .padding([0.3]);

    vis.xSubGroupScale = d3.scaleBand()
      // .domain(vis.config.colors.allGenres)
      .range([0, vis.xScale.bandwidth()])
      .padding([0.2]);

    vis.colourScale = d3.scaleOrdinal()
      // .domain(vis.config.colors.allGenres)
      .range(vis.config.colors.barColors);

    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickSizeOuter(0)
      .tickSize(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(5)
      .tickSize(-vis.width)
      .tickSizeOuter(0);

    vis.xAxisG = vis.chartArea.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chartArea.append('g')
      .attr('class', 'axis y-axis');

    vis.updateVis();
    vis.renderLegend();
  }

  updateVis() {
    const vis = this;
    const { config, data } = vis;
    const { allGenres, allPlatforms } = config;

    vis.barData = [];
    vis.barData = vis.setGenreCounts(data, allGenres, allPlatforms);

    // Specify accessor functions
    vis.xValue = (d) => d.key;
    vis.yValue = (d) => d.value;

    vis.updateScales();
    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    vis.renderBars();

    vis.xAxisG
      .call(vis.xAxis)
      .call((g) => g.select('.domain').remove());

    vis.yAxisG
      .call(vis.yAxis)
      .call((g) => g.select('.domain').remove())
      .selectAll('.tick line').attr('opacity', 0.25);
  }

  /* Purpose: update domain of scales */
  updateScales() {
    const vis = this;

    vis.maxBarCount = vis.getMaxGenreCount(vis.data) + 20;
    vis.platforms = d3.map(vis.barData, (d) => d.group);
    // vis.genres = vis.barData.columns.slice(1);
    // vis.platforms = vis.config.colors.allPlatforms;
    vis.genres = vis.config.colors.allGenres;

    vis.yScale
      .domain([0, vis.maxBarCount]);

    vis.xScale
      .domain(vis.config.colors.allPlatforms);

    vis.xSubGroupScale
      .domain(vis.config.colors.allGenres)
      .range([0, vis.xScale.bandwidth()]);

    vis.colourScale
      .domain(vis.config.colors.allGenres);
  }

  /* Purpose: Create and render a grouped bar chart */
  renderBars() {
    const vis = this;

    // Bind data to visual elements using .join() for genre & platform
    const bars = vis.chart.selectAll('.bar')
      // join data: loop group per subgroup
      .data(vis.barData, vis.xValue)
      .join('g')
      .attr('class', 'bar group platform-barchart')
      .attr('transform', (d) => `translate(${vis.xScale(d.group)},0)`)
      // bars
      .selectAll('rect')
      .data((d) => vis.genres.map((key) => ({ key, value: d[key] })))
      .join('rect')
      .attr('class', 'bar subgroup genre-barchart')
      .attr('x', (d) => vis.xSubGroupScale(vis.xValue(d)) + vis.config.margin.right)
      .attr('y', (d) => vis.yScale(vis.yValue(d)))
      .attr('width', vis.xSubGroupScale.bandwidth())
      .attr('height', (d) => vis.height - vis.yScale(d.value))
      .attr('fill', (d) => vis.colourScale(d.key));
  }

  /* Purpose: Create and render a legend (checkbox & label) */
  renderLegend() {
    const vis = this;
    const genres = vis.config.colors.allGenres;

    // Add one checkbox in the legend for each label
    const size = 15;
    vis.svg.selectAll('boxes')
      .data(genres)
      .join('rect')
      .attr('class', 'checkbox-barchart')
      .attr('x', (d, i) => vis.config.margin.left + i * (size + 41))
      .attr('y', vis.config.margin.bottom + 20)
      .attr('width', size)
      .attr('height', size)
      .style('fill', (d) => vis.colourScale(d));

    // Add legend label
    vis.svg.selectAll('labels')
      .data(genres)
      .join('text')
      .attr('class', 'label-barchart widget')
      .attr('x', (d, i) => vis.config.margin.left + i * (size + 42))
      .attr('y', vis.config.margin.bottom + 20 + size * 1.8)
      .text((d) => d)
      .attr('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('font-size', '12px');
  }
}
