class BarChart {
  constructor(_config, _rawData) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 550,
      containerHeight: 300,
      margin: {
        top: 90, right: 10, bottom: 20, left: 60,
      },
      colors: _config.colors,
    };
    this.rawData = _rawData;

    this.getMaxGenreCount = _config.functions.getMaxGenreCount;
    this.setGenreCounts = _config.functions.setGenreCounts;
    this.crosstabFormat = _config.functions.crosstabFormat;

    this.initVis();
  }

  initVis() {
    const vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0]);

    vis.xScale = d3.scaleBand()
      .range([0, vis.width])
      .padding([0.3]);

    vis.xSubGroupScale = d3.scaleBand()
      .range([0, vis.xScale.bandwidth()])
      .padding([0.2]);

    vis.colourScale = d3.scaleOrdinal()
      .range(vis.config.colors.barColors);

    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickSizeOuter(0)
      .tickSize(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(5)
      .tickSize(-vis.width)
      .tickSizeOuter(0);

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.svg.append('text')
      .attr('class', 'chart-header')
      .attr('x', vis.config.margin.left)
      .attr('y', vis.config.margin.bottom)
      .text('Number of Movies by Genre for Each Platform');

    vis.chart = vis.svg
      .append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.xAxisG = vis.chart
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chart
      .append('g')
      .attr('class', 'axis y-axis');

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    const platformToGenres = new Map();
    this.setGenreCounts(platformToGenres, this.rawData);

    this.barData = [];
    this.barData = this.crosstabFormat(platformToGenres);

    vis.updateScales();
    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    vis.renderBars();
    vis.renderLegend();

    vis.xAxisG
      .call(vis.xAxis)
      .call((g) => g.select('.domain').remove());

    vis.yAxisG
      .call(vis.yAxis)
      .call((g) => g.select('.domain').remove())
      .selectAll('.tick line').attr('opacity', 0.25);
  }

  /* Purpose: Update barChart view based on current selected filters
   * @param {Array} _data = array of data objects: movies
   * @param {string} _selectedGenres =
   *    string representing genres selected in barChart view; null if none selected
   */
  update(_data, _selectedGenres) {
    const vis = this;

    // Update view with given data array
    vis.rawData = _data;
    vis.initVis();
  }

  /* Purpose: update domain of scales */
  updateScales() {
    const vis = this;

    vis.maxBarCount = vis.getMaxGenreCount(vis.rawData) + 20;
    vis.platforms = d3.map(vis.barData, (d) => d.group);
    vis.genres = vis.barData.columns.slice(1);

    vis.yScale
      .domain([0, vis.maxBarCount]);

    vis.xScale
      .domain(vis.platforms);

    vis.xSubGroupScale
      .domain(vis.genres)
      .range([0, vis.xScale.bandwidth()]);

    vis.colourScale
      .domain(vis.genres);
  }

  /* Purpose: Create and render a grouped bar chart */
  renderBars() {
    const vis = this;

    // Bind data to visual elements using .join() for genre & platform
    vis.svg.append('g')
      .selectAll('g')
      // join data: loop group per group
      .data(vis.barData)
      .join('g')
      .attr('class', 'group platform-barchart')
      .attr('transform', (d) => `translate(${vis.xScale(d.group)},0)`)
      .selectAll('rect')
      .data((d) => vis.genres.map((key) => ({ key, value: d[key] })))
      .join('rect')
      .attr('class', 'subgroup genre-barchart')
      .attr('x', (d) => vis.xSubGroupScale(d.key) + vis.config.margin.left)
      .attr('y', (d) => vis.yScale(d.value) + vis.config.margin.top)
      .attr('width', vis.xSubGroupScale.bandwidth())
      .attr('height', (d) => vis.height - vis.yScale(d.value))
      .attr('fill', (d) => vis.colourScale(d.key));
  }

  /* Purpose: Create and render a legend (checkbox & label) */
  renderLegend() {
    const vis = this;
    // Add one checkbox in the legend for each label
    const size = 15;
    vis.svg.selectAll('boxes')
      .data(vis.genres)
      .join('rect')
      .attr('class', 'checkbox-barchart')
      .attr('x', (d, i) => vis.config.margin.left + i * (size + 41))
      .attr('y', vis.config.margin.bottom + 20)
      .attr('width', size)
      .attr('height', size)
      .style('fill', (d) => vis.colourScale(d));

    // Add legend label
    vis.svg.selectAll('labels')
      .data(vis.genres)
      .join('text')
      .attr('class', 'label-barchart widget')
      .attr('x', (d, i) => vis.config.margin.left + i * (size + 42))
      .attr('y', vis.config.margin.bottom + 20 + size * 1.8)
      .text((d) => d)
      .attr('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('font-size', '11.5px');
  }
}
