class MultiViewPieChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      width: _config.width,
      height: _config.height,
      colors: _config.colors,
      utils: _config.utils,
      xPos: _data.xPos,
      yPos: _data.yPos,
    };
    this.data = _data;

    this.initVis();
  }

  initVis() {
    const vis = this;

    const { colors } = vis.config;
    this.colorsList = new Array(colors.length);

    const { value } = vis.data;
    const numValues = Object.keys(value).length;
    vis.allCounts = new Array(numValues - 1);
    vis.platforms = new Array(numValues - 1);

    vis.radius = 0;

    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    const { config, data } = vis;
    const { width, height, colors } = config;

    vis.radius = Math.max(
      Math.min(width, height) / 2,
      50,
    );

    vis.platforms = Object.getOwnPropertyNames(data.value);
    vis.platforms.shift();
    const colorsProps = Object.getOwnPropertyNames(colors.platformColors);
    colorsProps.forEach((p, i) => {
      vis.colorsList[i] = colors.platformColors[p];
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
      platforms,
      colorsList,
      config,
      allCounts,
      radius,
    } = vis;
    const {
      width,
      height,
      parentElement,
      xPos,
      yPos,
    } = config;

    vis.colorScale = d3.scaleOrdinal()
      .domain(platforms)
      .range(colorsList);

    vis.svg = d3.select(parentElement)
      .attr('width', width)
      .attr('height', height);

    const pie = d3.pie();

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const chart = vis.svg.append('g')
      .attr('transform', `translate(${xPos}, ${yPos})`);

    const arcs = chart.selectAll('arc')
      .data(pie(allCounts))
      .enter()
      .append('g');

    arcs.append('path')
      .attr('fill', (_d, i) => colorsList[i])
      .attr('d', arc);
  }
}
