class BarChart {

  constructor(_config, _data) {
     this.config = {
      parentElement: _config.parentElement,
      containerWidth: 800,
      containerHeight: 500,
      margin: {top: 50, right: 10, bottom: 20, left: 60},
    }
    this.data = _data;
    this.initVis();
  }
  
  initVis() {
    let vis = this;
      
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    vis.yScale = d3.scaleLinear()
                   .range([vis.height, 0]);

vis.platforms = [
                  "Netflix",
                  "Hulu",
                  "Prime Video",
                  "Disney+",
                ] 
vis.colors = [
              '#8dd3c7',
              '#ffffb3',
              '#bebada',
              '#fb8072',
              '#80b1d3',
              '#fdb462',
              '#b3de69',
              '#fccde5',
              '#d9d9d9',
              '#bc80bd',
              '#ccebc5',
              '#ffed6f',
              ]
    
vis.genres = [
              'Biography',
              'Action',
              'Drama',
              'Crime',
              'Mystery',
              'Comedy',
              'Adventure',
              'Horror',
              'Animation',
              'Thriller',
              'Sport',
              'Fantasy',
              ]

    vis.xScale = d3.scaleBand()
                   .domain(vis.platforms)
                   .range([0, vis.width])
                   .padding([0.2])

    vis.yScale = d3.scaleLinear()
                   .domain([0, 1000])
                   .range([vis.height, 0]);
    
    vis.xSubGroup = d3.scaleBand()
                      .domain(vis.genres)
                      .range([0, vis.xScale.bandwidth()])
                      .padding([0.05])
    
    vis.color = d3.scaleOrdinal()
                  .domain(vis.genres)
                  .range(vis.colors)
    
    vis.xAxis = d3.axisBottom(vis.xScale)
                  .tickSizeOuter(0)
                  .tickSize(0);
    
    vis.yAxis = d3.axisLeft(vis.yScale)
                  .ticks(5)
                  .tickSize(-vis.width)
                  .tickSizeOuter(0);
    
    vis.svg = d3.select(vis.config.parentElement)
                .attr('width', vis.config.containerWidth)
                .attr('height', vis.config.containerHeight)
      
    vis.svg
       .append('text')
       .attr("x", 60)   
       .attr("y", 20)
       .style('font-family', 'arial')
       .style("font-size", "15px")
       .style("font-weight", "bold")
       .text('Number of Movies by Genre for Each Platform');
      
      
    vis.chart = vis.svg
                   .append('g')
                   .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
      
    vis.xAxisG = vis.chart
                    .append('g')
                    .attr('class', 'axis x-axis')
                    .attr('transform', `translate(0,${vis.height})`)
      
    vis.yAxisG = vis.chart
                    .append('g')
                    .attr('class', 'axis y-axis')

    
  }

  updateVis() {
    let vis = this;

    vis.groupByPlatform = d3.groups(vis.data, d => d.platform);
    console.log(this.groupByPlatform)
    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    let bars = vis.chart.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(vis.groupByPlatform)
            .enter()
            .append("g")
              .attr("transform", function(d) { return "translate(" + vis.xScale(vis.platforms) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return genres.map(function(key) { return {key: key, value: 5}; }); })
            .enter().append("rect")
              .attr("x", function(d) { return xSubgroup(d.key); })
              .attr("y", function(d) { return vis.yScale(5); })
              .attr("width", xSubgroup.bandwidth())
              .attr("height", function(d) { return height - vis.yScale(5); })
              .attr("fill", function(d) { return color(d.key); });

    vis.xAxisG
    .call(vis.xAxis)
    .call(g => g.select(".domain").remove());


    vis.yAxisG
        .call(vis.yAxis)
        .call(g => g.select(".domain").remove())
        .selectAll('.tick line').attr('opacity', 0.25);
      }
}