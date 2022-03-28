class BarChart {
  constructor(_config, _rawData) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 550,
      containerHeight: 300,
      margin: {
        top: 90, right: 10, bottom: 20, left: 60,
      },
    };
    this.rawData = _rawData;

    const platformToGenres = new Map();
    this.setGenreCounts(platformToGenres, this.rawData);

    this.barData = [];
    this.barData = this.crosstabFormat(platformToGenres);    

    /* chosen colours: selected for colour deficient */
    this.barColours = [ 
      '#5c252b',
      '#aacf22',
      '#ff92dd',
      '#3b44c7',
      '#02a1f2',
      '#bf0073',
      '#fab888',
      '#93cdf7',      
      '#ff9a3d'            
    ];

    this.initVis();
  }

  initVis() {
    const vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0]);

    vis.xScale = d3.scaleBand()
      .range([0, vis.width])
      .padding([0.3]);    

    vis.xSubGroupScale = d3.scaleBand()
      .range([0, vis.xScale.bandwidth()])
      .padding([0.2]);

    vis.colourScale = d3.scaleOrdinal()
      .range(vis.barColours);
    
    // vis.updateScales();
    
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
      .attr('x', vis.config.margin.left)
      .attr('y', vis.config.margin.bottom)
      .style('font-family', 'arial')
      .style('font-size', '18px')
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
    
    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    vis.updateScales();
    vis.renderVis();
  }  

  renderVis() {
    const vis = this;

    vis.renderBars();
    vis.renderLegend();

    vis.xAxisG
      .call(vis.xAxis)
      .call((g) => g.select('.domain').remove());

    vis.yAxisG
      .call(vis.yAxis)
      .call((g) => g.select('.domain').remove())
      .selectAll('.tick line').attr('opacity', 0.25);
  }

  /* Purpose: Update barChart view based on current selected filters
   * @param {Array} _data = array of data objects: movies
   * @param {string} _selectedGenres = string representing genres selected in barChart view; null if none selected
   */
  update(_data, _selectedGenres) {
    let vis = this;
    
    // Update view with given data array
    vis.rawData = _data;
    console.log('vis.rawData', vis.rawData);
    vis.initVis();
  }

  /*************HELPERs*******************/

  /* Purpose: update domain of scales */
  updateScales() {
    let vis = this;

    vis.maxBarCount = vis.getMaxGenreCount(vis.rawData) + 20;
    //  console.log('vis.maxBarCount:', vis.maxBarCount);

    vis.platforms = d3.map(vis.barData, (d) => d.group);    

    vis.genres = vis.barData.columns.slice(1);    

    vis.yScale
      .domain([0, vis.maxBarCount]);

    vis.xScale
      .domain(vis.platforms);    

    vis.xSubGroupScale
      .domain(vis.genres)
      .range([0, vis.xScale.bandwidth()]);

    vis.colourScale
      .domain(vis.genres);  
  }

  /* Purpose: Create and render a grouped bar chart */
  renderBars() {
    let vis = this;

    // Bind data to visual elements using .join() for genre & platform
    const groupedBars = vis.svg.append("g")
    .selectAll("g")
    // join data: loop group per group
    .data(vis.barData)
      .join("g")
      .attr('class', 'group platform-barchart')
      .attr("transform", d => {return "translate(" + vis.xScale(d.group) + ",0)" })      
    .selectAll("rect")
    .data(d => { return vis.genres.map(key => { return {key: key, value: d[key]} }) })
      .join("rect")
      .attr('class', 'subgroup genre-barchart')
      .attr("x", d => { return vis.xSubGroupScale(d.key) + vis.config.margin.left })
      .attr("y", d => { return vis.yScale(d.value) + vis.config.margin.top })      
      .attr("width", vis.xSubGroupScale.bandwidth())
      .attr("height", d => { return vis.height - vis.yScale(d.value) })
      .attr("fill", d => { return vis.colourScale(d.key) });
  }

  /* Purpose: Create and render a legend (checkbox & label) */
  renderLegend() {
    let vis = this;
    // Add one checkbox in the legend for each label
    let size = 15
    vis.svg.selectAll("boxes")
      .data(vis.genres)
      .join("rect")
      .attr('class', 'checkbox-barchart')  
      .attr("x", (d, i) => vis.config.margin.left + i * (size + 41))
        .attr("y", vis.config.margin.bottom + 20 ) 
        .attr("width", size)
        .attr("height", size)        
        .style("fill", d => { return vis.colourScale(d)});

    // Add legend label
    vis.svg.selectAll("labels")
      .data(vis.genres)
      .join("text")
        .attr('class', 'label-barchart') 
        .attr("x", (d, i) => vis.config.margin.left + i * (size + 42) )
        .attr("y", vis.config.margin.bottom + 20  + size*1.8) 
        .text(d => { return d})
        .attr("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style('font-size', '11.5px');
  }

  /* aggregates genre count based on platform, result is updated to map object passed in as parameter
   * @param: platformToGenres: an empty map 
   *         rawData: expanded movies dataset
   * returns: nothing
   * */
  setGenreCounts(platformToGenres, rawData) {
    rawData.sort((a, b) => {return d3.ascending(a.genre, b.genre)});
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

  /* converts aggregated genre count map into a flat crosstab object array for grouped bar chart 
   * @param: genreCounts: map object updated in vis.setGenreCounts() 
   * returns: a flat crosstab object array
   * */
  crosstabFormat(genreCounts){    
    let barGroups = [], keys = [];
    barGroups = Array.from(genreCounts, ([group, genre]) => ({ group, genre }));

    let i = 0, barData = [];
    barGroups.forEach((d) => {
      let temp = [];
      temp = Array.from(barGroups[i].genre, ([name, value]) => ({ name, value }));
      let tempObj = temp.reduce(function ( total, current ) {
        total[ current.name ] = current.value.toString();
        return total;
        }, {group: barGroups[i].group});
      barData.push(tempObj);
      i++;
    });
    keys = Object.keys(barData[0]);
    let pair = {columns: keys};

    barData['columns'] = keys;

    return barData;
  }

  /* returns the max genre x platform count for grouped bar chart: used to set bar chart height
   * @param: rawData: raw data object from main.js
   * returns: int: the max genre x platform count
   * */
  getMaxGenreCount(rawData) {
    let groupedPlatformGenre = d3.rollups(rawData, v => v.length, d => d.platform + '-' + d.genre);
    let dataPlatformGenre = Array.from(groupedPlatformGenre, ([key, count]) => ({ key, count }));  
    dataPlatformGenre.sort((a, b) => b.count - a.count);

    return dataPlatformGenre[0].count;
  }  

}


