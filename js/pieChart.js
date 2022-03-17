class PieChart {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 500,
      margin: _config.margin || {top: 20, right: 20, bottom: 20, left: 60}
    }
    this.data = _data;
    this.initVis();
  }
  
  initVis() {
    let vis = this;
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.radius = Math.min(vis.width, vis.height) / (2 - vis.config.margin.top)

    vis.platforms = [
      "Netflix",
      "Hulu",
      "Prime Video",
      "Disney+",
    ] 

    vis.colors = [
      '#1f77b4',
      '#ff7f0e',
      '#2ca02c',
      '#d62728',
      ]

    vis.colorScale = d3.scaleOrdinal()
                       .domain(vis.platforms)
                       .range(vis.colors)

    vis.svg = d3.select(vis.config.parentElement)
    .attr('width', vis.config.containerWidth)
    .attr('height', vis.config.containerHeight)
        
    vis.svg
      .append('g')
        .append('text')
        .attr("x",  vis.config.margin.left)   
        .attr("y", vis.config.margin.top)
        .style('font-family', 'arial')
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .text('Number of Movies by Platform');

    vis.chart = vis.svg
    .append('g')
    .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

  }



  updateVis() {
    let vis = this;

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    vis.platformMovieCount = d3.rollups(this.data, v => v.length, d => d.platform);
    console.log(vis.platformMovieCount)
    var data = [
                  vis.platformMovieCount[0][1],
                  vis.platformMovieCount[1][1],
                  vis.platformMovieCount[2][1],
                  vis.platformMovieCount[3][1],
                ];
  
    var svg = d3.select("svg");

    let g = svg.append("g")
               .attr('transform', `translate(${vis.config.margin.left + 100},${vis.config.margin.top + 200})`);
      
    var pie = d3.pie();

    var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(150);

    var arcs = g.selectAll("arc")
                .data(pie(data))
                .enter()
                .append("g");

    arcs.append("path")
        .attr("fill", (d, i)=>{
            let value = d.data;
            return vis.colors[i];
        })
        .attr("d", arc)

    arcs.append('text')
        .text(d => {
          return d.data})
        .attr("transform", d => {
          return "translate(" + arc.centroid(d) + ")";  
        })
        .style('text-anchor', 'middle')
        .style('font-size', 14)
    

    arcs.append('text')
    .text(d => {
      return d.data})
    .attr("transform", d => {
      return "translate(" + arc.centroid(d) + ")";  
    })
    .style('text-anchor', 'middle')
    .style('font-size', 14)
  }
}