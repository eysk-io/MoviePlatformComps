class BarChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 650,
      containerHeight: 300,
      margin: {
        top: 30, right: 10, bottom: 20, left: 60,
      },
      colors: _config.barColors,
      allGenres: _config.genres.sort(),
      allPlatforms: _config.platforms,
    };
    this.data = _data;

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
      .padding([0.3]);

    vis.xSubGroupScale = d3.scaleBand()
      .range([0, vis.xScale.bandwidth()])
      .padding([0.2]);

    vis.colourScale = d3.scaleOrdinal()
      .range(vis.config.colors);

    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickSizeOuter(0)
      .tickSize(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(5)
      .tickSize(-vis.width)
      .tickSizeOuter(0);

    vis.xAxisG = vis.chartArea.append('g')
      .attr('class', 'axis x-axis mark-label')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chartArea.append('g')
      .attr('class', 'axis y-axis');

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    vis._setGenreCounts();

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

    vis.maxBarCount = vis._getMaxGenreCount() + 20;
    vis.platforms = d3.map(vis.barData, (d) => d.group);
    vis.genres = vis.config.allGenres;

    vis.yScale
      .domain([0, vis.maxBarCount]);

    vis.xScale
      .domain(vis.config.allPlatforms);

    vis.xSubGroupScale
      .domain(vis.config.allGenres)
      .range([0, vis.xScale.bandwidth()]);

    vis.colourScale
      .domain(vis.config.allGenres);
  }

  /* Purpose: Create and render a grouped bar chart */
  renderBars() {
    const vis = this;

    // Bind data to visual elements using .join() for genre & platform
    const bars = vis.chart.selectAll('.bar')
      // join data: loop group per subgroup
      .data(vis.barData, vis.xValue)
      .join('g')
      .attr('class', (d) => `bar ${d.group} platform-barchart`)
      .attr('id', (d) => `${d.group}`)
      .attr('transform', (d) => `translate(${vis.xScale(d.group)},0)`)
      // bars
      .selectAll('rect')
      .data((d) => vis.genres.map((key) => ({ key, value: d[key] })))
      .join('rect')
      // set class to parent's class to get platform
      // eslint-disable-next-line func-names
      .attr('class', function (d, i) { return d3.select(this.parentNode).attr('class'); })
      .attr('x', (d) => vis.xSubGroupScale(vis.xValue(d)) + vis.config.margin.right)
      .attr('y', (d) => vis.yScale(vis.yValue(d)))
      .attr('width', vis.xSubGroupScale.bandwidth())
      .attr('height', (d) => vis.height - vis.yScale(d.value))
      .attr('fill', (d) => vis.colourScale(d.key));

    // Add tooltips
    new BarTip('bar-chart-tooltip', vis.data, bars)
      .generateChart();
  }

  /**
   * returns the max genre x platform count for grouped bar chart: used to set bar chart height
   * @returns int: the max genre x platform count
   */
  _getMaxGenreCount() {
    const vis = this;
    const { data } = vis;

    const groupedPlatformGenre = d3.rollups(data, (v) => v.length, (d) => `${d.platform}-${d.genre}`);
    const dataPlatformGenre = Array.from(groupedPlatformGenre, ([key, count]) => ({ key, count }));
    dataPlatformGenre.sort((a, b) => b.count - a.count);

    return dataPlatformGenre[0].count;
  }

  /**
   * Aggregates genre count based on platform.
   * The result is updated to map object passed in as parameter
   * @returns a flat crosstab object array
   */
  _setGenreCounts() {
    const vis = this;
    const { config, data } = vis;
    const { allGenres } = config;

    const platformToGenres = new Map();
    data.sort((a, b) => d3.ascending(a.genre, b.genre));

    let allCounts;
    data.forEach((d) => {
      if (platformToGenres.has(d.platform)) {
        allCounts = platformToGenres.get(d.platform);
      } else {
        allCounts = new Map();
        allGenres.forEach((g) => allCounts.set(g, 0));
      }
      const currCount = allCounts.get(d.genre);
      allCounts.set(d.genre, currCount + 1);
      platformToGenres.set(d.platform, allCounts);
    });
    return this._crosstabFormat(platformToGenres);
  }

  /**
   * Converts aggregated genre count map into a flat crosstab object array for grouped bar chart
   * @param {*} genreCounts
   * @returns a flat crosstab object array
   */
  _crosstabFormat(genreCounts) {
    const vis = this;

    let barGroups = []; let
      keys = [];
    barGroups = Array.from(genreCounts, ([group, genre]) => ({ group, genre }));

    let i = 0; const
      barData = [];
    barGroups.forEach((d) => {
      let temp = [];
      temp = Array.from(barGroups[i].genre, ([name, value]) => ({ name, value }));
      const tempObj = temp.reduce((total, current) => {
        total[current.name] = current.value.toString();
        return total;
      }, { group: barGroups[i].group });
      barData.push(tempObj);
      i += 1;
    });
    keys = Object.keys(barData[0]);
    barData.columns = keys;

    vis.barData = barData;
  }
}
