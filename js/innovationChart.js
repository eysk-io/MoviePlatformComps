class InnovationChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 500,
      containerHeight: 500,
      margin: {
        top: 15, right: 15, bottom: 20, left: 25,
      },
    };
    this.data = _data;
    this.initVis();
  }

  initVis() {
    const vis = this;

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chartArea = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.chart = vis.chartArea
      .append('g');

    vis.width = vis.config
      .containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config
      .containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  }

  updateVis() {
    const vis = this;
    vis.renderVis();
  }

  renderVis() {
    const vis = this;
  }
}
