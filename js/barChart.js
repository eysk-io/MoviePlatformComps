class BarChart {

  constructor(_config, _data) {
     this.config = {
      parentElement: _config.parentElement,
      containerWidth: 400,
      containerHeight: 250,
      margin: {top: 20, right: 10, bottom: 20, left: 60},
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