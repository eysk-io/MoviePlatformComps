class MultiViewPieChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      width: _config.width,
      height: _config.height,
      platformColors: _config.platformColors,
      xPos: _data.xPos,
      yPos: _data.yPos,
    };
    this.data = _data;

    this.initVis();
  }

  initVis() {
    const vis = this;
    const {
      platformColors,
      width,
      height,
      parentElement,
      xPos,
      yPos,
    } = vis.config;
    this.colorsList = new Array(platformColors.length);

    const { value } = vis.data;
    const numValues = Object.keys(value).length;
    vis.allCounts = new Array(numValues - 1);
    vis.platforms = new Array(numValues - 1);

    vis.svg = d3.select(parentElement)
      .attr('width', width)
      .attr('height', height);

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${xPos}, ${yPos})`);
  }

  updateVis() {
    const vis = this;
    const { config, data } = vis;
    const { width, height, platformColors } = config;

    vis.radius = Math.max(
      Math.min(width, height) / 2,
      10,
    );

    vis.platforms = Object.getOwnPropertyNames(data.value);
    vis.platforms.shift();
    const colorsProps = Object.getOwnPropertyNames(platformColors);
    colorsProps.forEach((p, i) => {
      vis.colorsList[i] = platformColors[p];
    });

    let idx = 0;
    Object.keys(data.value).forEach((k) => {
      if (k !== 'total') {
        vis.allCounts[idx] = data.value[k];
        idx += 1;
      }
    });

    vis.renderVis();
  }

  renderVis() {
    const vis = this;
    const {
      colorsList,
      allCounts,
      platforms,
      radius,
    } = vis;

    const pie = d3.pie();

    vis.chart.arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    vis.chart.selectAll('path')
      .data(pie(allCounts))
      .join('path')
      .attr('fill', (_d, i) => colorsList[i])
      .attr('d', vis.chart.arc);

    const countData = [];
    allCounts.forEach((c, i) => {
      countData.push([platforms[i], c]);
    });

    new MultiViewPieTip('multi-view-pie-chart-tooltip', countData, vis.chart)
      .generateChart();
  }
}
