class GridChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      margin: _config.margin,
      height: _config.height - _config.margin.top - _config.margin.bottom,
      width: _config.width - _config.margin.left - _config.margin.right,
      platformColors: _config.platformColors,
      allPlatforms: _config.platforms,
    };

    this.data = _data;
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

    vis.bands = vis._setScoreBands();
    vis.xAxisVals = new Array(3);
    vis.bands.forEach((s, i) => {
      vis.xAxisVals[i] = s.scoreBand.toUpperCase();
    });

    vis.bands = vis._setFinancialPerfBands();
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

    vis.aggregatedData = vis._aggregateData();
    vis.aggregatedData = vis._setGridPos();

    const pieChartGroups = vis.chart.selectAll()
      .data(vis.aggregatedData)
      .join('g')
      .attr('id', (_, i) => `grid-chart-pie-chart-${i}`);

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

    vis.multiViewPieCharts = [];

    // eslint-disable-next-line no-underscore-dangle
    [vis.pieChartGroups] = pieChartGroups._groups;
    vis.pieChartGroups.forEach((g, i) => {
      const currVal = vis.aggregatedData[i].value.total;
      const multiViewPieChart = new MultiViewPieChart({
        parentElement: `#${g.id}`,
        width: Math.sqrt(currVal * 50),
        height: Math.sqrt(currVal * 50),
        platformColors: vis.config.platformColors,
      }, vis.aggregatedData[i]);
      vis.multiViewPieCharts.push(multiViewPieChart);
    });

    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    vis.aggregatedData = vis._aggregateData();
    vis.aggregatedData = vis._setGridPos();

    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    vis.pieChartGroups.forEach((_g, i) => {
      const currVal = vis.aggregatedData[i].value.total;
      vis.multiViewPieCharts[i].config.width = Math.sqrt(currVal * 50);
      vis.multiViewPieCharts[i].config.height = Math.sqrt(currVal * 50);
      vis.multiViewPieCharts[i].data = vis.aggregatedData[i];
      vis.multiViewPieCharts[i].updateVis();
    });
  }

  _aggregateData() {
    // group = x axis value
    // variable = y axis value

    const vis = this;
    const {
      data,
      bands,
      config,
      _getPerfScore,
    } = vis;
    const { allPlatforms } = config;

    const aggregatedData = new Array(9);
    const varsByGroup = [
      [{ total: 0 }, { total: 0 }, { total: 0 }],
      [{ total: 0 }, { total: 0 }, { total: 0 }],
      [{ total: 0 }, { total: 0 }, { total: 0 }],
    ];

    varsByGroup.forEach((v) => {
      v.forEach((g) => {
        allPlatforms.forEach((p) => {
          g[p] = 0;
        });
      });
    });

    data.forEach((d) => {
      if (+d.budget !== 0 && +d.gross !== 0) {
        const currPerf = _getPerfScore(d);

        let row;
        if (currPerf < bands[0].maxPerf) {
          row = 0;
        } else if (currPerf < bands[1].maxPerf) {
          row = 1;
        } else {
          row = 2;
        }

        let col;
        if (d['Rotten Tomato Score'] <= bands[0].maxScore) {
          col = 0;
        } else if (d['Rotten Tomato Score'] <= bands[1].maxScore) {
          col = 1;
        } else {
          col = 2;
        }

        varsByGroup[row][col].total += 1;
        varsByGroup[row][col][d.platform] += 1;
      }
    });

    let aggregatedDataIdx = 0;
    for (let varIdx = 0; varIdx < varsByGroup.length; varIdx += 1) {
      for (let groupIdx = 0; groupIdx < varsByGroup[0].length; groupIdx += 1) {
        aggregatedData[aggregatedDataIdx] = {
          variable: bands[varIdx].perfBand.toUpperCase(),
          group: bands[groupIdx].scoreBand.toUpperCase(),
          value: varsByGroup[varIdx][groupIdx],
        };
        aggregatedDataIdx += 1;
      }
    }
    return aggregatedData;
  }

  /**
     * [
     *  {xPos: 120, yPos: 600} (Low, Low) (Variable(x), Group(y))
     *  {xPos: 360, yPos: 600} (Low, Med)
     *  {xPos: 600, yPos: 600} (Low, High)
     *  {xPos: 120, yPos: 360} (Med, Low)
     *  {xPos: 360, yPos: 360} (Med, Med)
     *  {xPos: 600, yPos: 360} (Med, High)
     *  {xPos: 120, yPos: 120} (High, Low)
     *  {xPos: 360, yPos: 120} (High, Med)
     *  {xPos: 600, yPos: 120} (High, High)
     * ]
     */
  _setGridPos() {
    const vis = this;
    const { aggregatedData, config } = vis;

    const gridWidthStart = config.width / 6;
    const gridHeightStart = config.height / 6;
    for (let i = aggregatedData.length - 1; i >= 0; i -= 1) {
      const pos = {
        xPos: gridWidthStart + gridWidthStart * 2 * ((aggregatedData.length - 1 - i) % 3),
        yPos: gridHeightStart + gridHeightStart * 2 * Math.floor(i / 3),
      };

      const dataIdx = aggregatedData.length - 1 - i;
      aggregatedData[dataIdx] = { ...aggregatedData[dataIdx], ...pos };
    }

    return aggregatedData;
  }

  _setScoreBands() {
    const vis = this;
    const { data } = vis;

    const numGrids = 3;
    const result = new Array(numGrids);
    let minScore = Number.MAX_SAFE_INTEGER;
    let maxScore = Number.MIN_SAFE_INTEGER;

    data.forEach((d) => {
      minScore = Math.min(minScore, +d['Rotten Tomato Score']);
      maxScore = Math.max(maxScore, +d['Rotten Tomato Score']);
    });
    const scoreIncrement = (maxScore - minScore) / numGrids - 1;

    for (let i = 0; i < numGrids; i += 1) {
      let currMin;
      let currMax;
      let currBand;

      if (i === 0) {
        currMin = minScore;
        currMax = Math.round(currMin + scoreIncrement);
        currBand = 'low';
      } else if (i === 1) {
        currMin = result[i - 1].maxScore + 1;
        currMax = Math.round(currMin + scoreIncrement);
        currBand = 'med';
      } else {
        currMin = result[i - 1].maxScore + 1;
        currMax = maxScore;
        currBand = 'high';
      }

      result[i] = {
        minScore: currMin,
        maxScore: currMax,
        scoreBand: currBand,
      };
    }

    return result;
  }

  _setFinancialPerfBands() {
    const vis = this;
    const { data, bands } = vis;

    const numGrids = 3;
    const result = bands;
    let minPerf = Number.MAX_SAFE_INTEGER;
    let maxPerf = Number.MIN_SAFE_INTEGER;

    data.forEach((d) => {
      if (+d.budget !== 0 && +d.gross !== 0) {
        const currPerf = this._getPerfScore(d);
        maxPerf = Math.max(
          currPerf,
          maxPerf,
        );

        minPerf = Math.min(
          currPerf,
          minPerf,
        );
      }
    });

    const bandSize = parseFloat((maxPerf - minPerf).toFixed(3)) / numGrids;

    let prevPerf = minPerf;
    for (let i = 0; i < bands.length; i += 1) {
      const currPerf = prevPerf + bandSize;
      let currMin;
      let currMax;
      let currBand;

      if (i === 0) {
        currMin = prevPerf;
        currMax = currPerf;
        currBand = 'low';
      } else if (i === 1) {
        currMin = prevPerf;
        currMax = currPerf;
        currBand = 'med';
      } else {
        currMin = prevPerf;
        currMax = maxPerf;
        currBand = 'high';
      }

      const budgetObj = {
        minPerf: currMin,
        maxPerf: currMax,
        perfBand: currBand,
      };

      prevPerf = currPerf;

      result[i] = { ...result[i], ...budgetObj };
    }

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  _getPerfScore(d) {
    return Math.log(+d.gross / +d.budget);
  }
}
