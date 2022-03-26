class InnovationChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      margin: _config.margin,
      height: _config.height - _config.margin.top - _config.margin.bottom,
      width: _config.width - _config.margin.left - _config.margin.right,
    };

    this.data = _data;

    this.setScoreBands = setScoreBands;
    this.setRevenueBands = setRevenueBands;
    this.aggregateData = aggregateData;

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

    vis.bands = vis.setRevenueBands(vis.data, vis.bands);
    vis.yAxisVals = new Array(3);
    vis.bands.forEach((s, i) => {
      vis.yAxisVals[i] = s.revenueBand.toUpperCase();
    });

    vis.xScale = d3.scaleBand()
      .range([0, width])
      .domain(vis.xAxisVals)
      .padding(0.01);

    vis.chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(vis.xScale))
      .selectAll('text')
      .attr('id', 'innovXAxis');

    vis.chart.append('text')
      .attr('id', 'innovXAxisLabel')
      .attr('text-anchor', 'end')
      .attr('x', width - 235)
      .attr('y', height + 60)
      .text('Segmented Rotten Tomatoes Score');

    vis.yScale = d3.scaleBand()
      .range([height, 0])
      .domain(vis.yAxisVals)
      .padding(0.01);

    vis.chart.append('g')
      .call(d3.axisLeft(vis.yScale))
      .selectAll('text')
      .attr('id', 'innovYAxis')
      .style('text-anchor', 'end')
      .attr('dx', '1.7em')
      .attr('dy', '-0.5em')
      .attr('transform', 'rotate(-90)');

    vis.chart.append('text')
      .attr('id', 'innovYAxisLabel')
      .attr('text-anchor', 'end')
      .attr('x', -255)
      .attr('y', -65)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text('Segmented Gross Revenue');

    vis.chart.append('text')
      .attr('id', 'innovHeader')
      .attr('text-anchor', 'end')
      .attr('x', width + 55)
      .attr('y', -30)
      .text(('Proportion of Movies by Platform, Gross Revenue, and Rotten Tomatoes Score').toUpperCase());

    vis.colors = d3.scaleLinear()
      .range(['white', '#69b3a2'])
      .domain([1, 500]);
  }

  updateVis() {
    const vis = this;

    vis.aggregatedData = vis.aggregateData(vis.data, vis.bands);

    vis.renderVis();
  }

  renderVis() {
    const vis = this;
    vis.chart.selectAll()
      .data(vis.aggregatedData, (d) => `${d.group}:${d.variable}`)
      .join('rect')
      .attr('x', (d) => vis.xScale(d.group))
      .attr('y', (d) => vis.yScale(d.variable))
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('width', vis.xScale.bandwidth())
      .attr('height', vis.yScale.bandwidth())
      .style('fill', (d) => vis.colors(d.value));
  }
}

function setScoreBands() {
  const numGrids = 3;
  const result = new Array(numGrids);
  const minScore = 0;
  const maxScore = 100;

  for (let i = 0; i < numGrids; i += 1) {
    const currScore = (i + 1) * (maxScore / numGrids);
    let currMin;
    let currMax;
    let currBand;

    if (i === 0) {
      currMin = minScore;
      currMax = Math.round(currScore);
      currBand = 'low';
    } else if (i === 1) {
      currMin = result[i - 1].maxScore + 1;
      currMax = Math.round(currScore);
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

function setRevenueBands(data, bands) {
  const numGrids = 3;
  const result = bands;
  const minRevenue = 0;

  let maxRevenue = 0;
  data.forEach((d) => {
    if (+d.gross > maxRevenue) {
      maxRevenue = +d.gross;
    }
  });

  for (let i = 0; i < bands.length; i += 1) {
    const currRevenue = (i + 1) * (maxRevenue / numGrids);
    let currMin;
    let currMax;
    let currBand;

    if (i === 0) {
      currMin = minRevenue;
      currMax = Math.round(currRevenue);
      currBand = 'low';
    } else if (i === 1) {
      currMin = result[i - 1].maxRevenue + 1;
      currMax = Math.round(currRevenue);
      currBand = 'med';
    } else {
      currMin = result[i - 1].maxRevenue + 1;
      currMax = maxRevenue;
      currBand = 'high';
    }

    budgetObj = {
      minRevenue: currMin,
      maxRevenue: currMax,
      revenueBand: currBand,
    };

    result[i] = { ...result[i], ...budgetObj };
  }

  return result;
}

function aggregateData(data, bands) {
  // group = x axis value
  // variable = y axis value

  const aggregatedData = new Array(9);
  const varsByGroup = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  data.forEach((d) => {
    let row;
    if (d.gross <= bands[0].maxRevenue) {
      row = 0;
    } else if (d.gross <= bands[1].maxRevenue) {
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

    varsByGroup[row][col] += 1;
  });

  let aggregatedDataIdx = 0;
  for (let varIdx = 0; varIdx < varsByGroup.length; varIdx += 1) {
    for (let groupIdx = 0; groupIdx < varsByGroup[0].length; groupIdx += 1) {
      aggregatedData[aggregatedDataIdx] = {
        variable: bands[varIdx].revenueBand.toUpperCase(),
        group: bands[groupIdx].scoreBand.toUpperCase(),
        value: varsByGroup[varIdx][groupIdx],
      };
      aggregatedDataIdx += 1;
    }
  }
  return aggregatedData;
}
