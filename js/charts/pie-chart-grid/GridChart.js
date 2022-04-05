class GridChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      margin: _config.margin,
      height: _config.height - _config.margin.top - _config.margin.bottom,
      width: _config.width - _config.margin.left - _config.margin.right,
      colors: _config.colors,
      utils: _config.functions,
    };

    this.data = _data;

    this.setScoreBands = _config.functions.setScoreBands;
    this.setFinancialPerfBands = _config.functions.setFinancialPerfBands;
    this.aggregateData = _config.functions.aggregateData;
    this.setGridPos = _config.functions.setGridPos;
    this.getAllPlatforms = _config.functions.getAllPlatforms;

    this.initVis();
  }

  initVis() {
    const vis = this;
    const {
      width, height, margin, parentElement,
    } = vis.config;

    vis.svg = d3.select(parentElement)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    vis.chart = vis.svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    vis.bands = vis.setScoreBands();
    vis.xAxisVals = new Array(3);
    vis.bands.forEach((s, i) => {
      vis.xAxisVals[i] = s.scoreBand.toUpperCase();
    });

    vis.bands = vis.setFinancialPerfBands(vis.data, vis.bands);
    vis.yAxisVals = new Array(3);
    vis.bands.forEach((s, i) => {
      vis.yAxisVals[i] = s.perfBand.toUpperCase();
    });

    vis.xScale = d3.scaleBand()
      .range([0, width])
      .domain(vis.xAxisVals)
      .padding(0.01);

    vis.chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(vis.xScale)
        .tickSize(0))
      .selectAll('text')
      .attr('class', 'grid-chart-mark-labels');

    vis.chart.append('text')
      .attr('class', 'grid-chart-label')
      .attr('text-anchor', 'end')
      .attr('x', width - 235)
      .attr('y', height + 60)
      .text('Segmented Rotten Tomatoes Score');

    vis.yScale = d3.scaleBand()
      .range([height, 0])
      .domain(vis.yAxisVals);

    vis.chart.append('g')
      .call(d3.axisLeft(vis.yScale)
        .tickSize(0))
      .selectAll('text')
      .attr('class', 'grid-chart-mark-labels')
      .style('text-anchor', 'end')
      .attr('dx', '1.7em')
      .attr('dy', '-0.5em')
      .attr('transform', 'rotate(-90)');

    vis.chart.append('text')
      .attr('class', 'grid-chart-label')
      .attr('text-anchor', 'end')
      .attr('x', -230)
      .attr('y', -65)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text('Segmented Financial Performance');

    vis.chart.append('text')
      .attr('id', 'grid-chart-header')
      .attr('class', 'chart-header')
      .attr('text-anchor', 'end')
      .attr('x', width + 8)
      .attr('y', -25)
      .text(('Proportion of Movies by Platform, Financial Performance, and Rotten Tomatoes Score'));
    // }

    // updateVis() {
    // const vis = this;
    vis.platforms = getAllPlatforms(vis.data);
    vis.aggregatedData = vis.aggregateData(vis.data, vis.bands, vis.platforms);
    vis.aggregatedData = vis.setGridPos(vis.aggregatedData, vis.config);

    vis.renderVis();
  }

  renderVis() {
    const vis = this;
    const pieChartGroups = vis.chart.selectAll()
      .data(vis.aggregatedData)
      .enter()
      .append('g')
      .attr('id', (_, i) => `grid-chart-pie-chart-${i}`);

    // eslint-disable-next-line no-underscore-dangle
    [vis.pieChartGroups] = pieChartGroups._groups;
    vis.pieChartGroups.forEach((g, i) => {
      const currVal = vis.aggregatedData[i].value.total;
      const multiViewPieChart = new MultiViewPieChart({
        parentElement: `#${g.id}`,
        width: Math.sqrt(currVal * 50),
        height: Math.sqrt(currVal * 50),
        colors: vis.config.colors,
        utils: vis.config.utils,
      }, vis.aggregatedData[i]);
      multiViewPieChart.updateVis();
    });

    vis.chart.selectAll()
      .data(vis.aggregatedData, (d) => `${d.group}:${d.variable}`)
      .join('rect')
      .attr('x', (d) => vis.xScale(d.group))
      .attr('y', (d) => vis.yScale(d.variable))
      .attr('width', vis.xScale.bandwidth())
      .attr('height', vis.yScale.bandwidth())
      .style('stroke', 'black')
      .style('stroke-width', 2.5)
      .style('fill', 'none')
      .attr('class', 'grid-box');
  }
}
