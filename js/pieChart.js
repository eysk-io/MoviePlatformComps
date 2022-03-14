class PieChart {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 400,
      containerHeight: _config.containerHeight || 250,
      margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 60}
    }
    this.data = _data;
    this.initVis();
  }
  
  initVis() {
    let vis = this;
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  }

  updateVis() {
    let vis = this;
    vis.renderVis();
  }

  renderVis() {
    let vis = this;
  }
}