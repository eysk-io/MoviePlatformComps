class BarChart {
  constructor(_config, _data, _barCounts, _rawData) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 500,
      containerHeight: 300,
      margin: {
        top: 50, right: 10, bottom: 20, left: 60,
      },
    };
    this.data = _data;
    console.log('this.data:', this.data);
    
    this.barCounts = _barCounts;
    console.log('max bar height:',  _barCounts[0].count);

    this.rawData = _rawData;
    
    // this.setGenreCounts = setGenreCounts;

    this.initVis();
  }

  initVis() {
    const vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
    vis.maxBarCount = vis.barCounts[0].count + 30;

    vis.platforms = d3.map(vis.data, (d) => d.group);
    // console.log('platforms',vis.platforms);

    // the top set of colours have been improved for colour deficient
    // from https://medialab.github.io/iwanthue/
    vis.barColours = [ 
      '#5c252b',
      '#aacf22',
      '#3b44c7',
      '#ff9a3d',
      '#02a1f2',
      '#bf0073',
      '#93cdf7',
      '#fab888',
      '#ff92dd' 
      // '#8dd3c7',
      // '#ffffb3',
      // '#bebada',
      // '#fb8072',
      // '#80b1d3',
      // '#fdb462',
      // '#b3de69',
      // '#fccde5',
      // '#d9d9d9'
    ];

    vis.genres = vis.data.columns.slice(1);
    // console.log('genre',vis.genres);

    vis.yScale = d3.scaleLinear()
      .domain([0, vis.maxBarCount])
      .range([vis.height, 0]);

    vis.xScale = d3.scaleBand()
      .domain(vis.platforms)
      .range([0, vis.width])
      .padding([0.3]);    

    vis.xSubGroupScale = d3.scaleBand()
      .domain(vis.genres)
      .range([0, vis.xScale.bandwidth()])
      .padding([0.2]);

    vis.colour = d3.scaleOrdinal()
      .domain(vis.genres)
      .range(vis.barColours);

    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickSizeOuter(0)
      .tickSize(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(5)
      .tickSize(-vis.width)
      .tickSizeOuter(0);

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.svg
      .append('text')
      .attr('x', 60)
      .attr('y', 20)
      .style('font-family', 'arial')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .text('Number of Movies by Genre for Each Platform');

    vis.chart = vis.svg
      .append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.xAxisG = vis.chart
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chart
      .append('g')
      .attr('class', 'axis y-axis');
  }

  updateVis() {
    const vis = this;
    const platformToGenres = new Map();
    vis.setGenreCounts(platformToGenres, vis.rawData);
    console.log('platformToGenres:',  platformToGenres);
    let barGroups = [], temp = [];
   
    // let map = new Map().set('a', 1).set('b', 2),
    barGroups = Array.from(platformToGenres, ([group, genre]) => ({ group, genre }));
    console.log('barGroups:',  barGroups);
    temp = Array.from(barGroups[0].genre, ([name, value]) => ({ name, value }));
    console.log('barGroups[0].genre:',  barGroups[0].genre);
    console.log('temp:',  temp);
    let tempObj = temp.reduce(function ( total, current ) {
      total[ current.name ] = current.value;
      return total;
      }, {});
    console.log('tempObj:',  tempObj);  

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

  /*************HELPERs*******************/

  /* Purpose: Create and render bars */
  renderBars() {
    let vis = this;

    // Bind data to visual elements
    const bars = vis.svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(vis.data)
    .enter()
    .append("g")
      .attr("transform", d => {return "translate(" + vis.xScale(d.group) + ",0)" })
    .selectAll("rect")
    .data(d => { return vis.genres.map(function(key) { return {key: key, value: d[key]} }) })
    .enter().append("rect")
      .attr("x", d => { return vis.xSubGroupScale(d.key) + vis.config.margin.left })
      .attr("y", d => { return vis.yScale(d.value) + vis.config.margin.top })
      .attr("width", vis.xSubGroupScale.bandwidth())
      .attr("height", d => { return vis.height - vis.yScale(d.value); })
      .attr("fill", d => { return vis.colour(d.key); });

  }

  setGenreCounts(platformToGenres, rawData) {
    const allGenres = new Set();
    rawData.forEach((d) => allGenres.add(d.genre));
  
    let allCounts;
    rawData.forEach((d) => {
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
  }  

  setToArray(platformToGenres, barGroups) {
    
    platformToGenres.forEach((d) => allGenres.add(d.genre));
    barGroups = Array.from(platformToGenres, ([name, value]) => ({ name, value }));
    
  
    
  }

}


