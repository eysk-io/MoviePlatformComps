let data;
let barData;
let innovationChart;
let barChart;
let pieChart;

d3.csv('data/groupedPlatformGenre.csv')
      .then((_barData) => {
      barData = _barData;

      // console.log(barData);
});


d3.csv('data/groupByPlatform.csv')
  .then((_data) => {
    data = _data;

    // collapse small genre categories to 'Other'
    data.forEach(d => {
      Object.keys(d).forEach(attr => {
        if (attr == 'genre') {
          // d[attr] = (d[attr] == 'NA') ? null : +d[attr];
          switch (d[attr]) {
            case 'Fantasy': 
              d[attr] = 'Other';
            case 'Mystery': 
              d[attr] = 'Other';
              case 'Family': 
              d[attr] = 'Other';
            case 'Thriller': 
              d[attr] = 'Other';
            case 'Sport': 
              d[attr] = 'Other';
            case 'Sci-Fi': 
              d[attr] = 'Other';  
          }
        } 
      });
    });

    let groupedPlatformGenre = d3.rollups(data, v => v.length, d => d.platform + '-' + d.genre);
    let dataPlatformGenre = Array.from(groupedPlatformGenre, ([key, count]) => ({ key, count }));
  
    dataPlatformGenre.sort((a, b) => b.count - a.count);
    // console.log(dataPlatformGenre);

    innovationChart = new InnovationChart({
      parentElement: '#innovation-chart',
    }, data);
    innovationChart.updateVis();

    pieChart = new PieChart({
      parentElement: '#pie-chart',
    }, data);
    pieChart.updateVis();

    barChart = new BarChart({
      parentElement: '#bar-chart',
    }, barData, dataPlatformGenre);
    barChart.updateVis();

  });
