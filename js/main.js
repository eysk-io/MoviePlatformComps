let barData;

// crosstab csv for grouped bar chart data - use this to check that the new
//  groupByPlatform produced by JS from preprocessedMovies.csv has the same genre counts
d3.csv('data/groupedPlatformGenre.csv')
  .then((_barData) => {
    barData = _barData
    console.log('barData:', barData);
  });

d3.csv('data/groupByPlatform.csv')
  .then((_data) => {
    const data = collapseCategories(_data);
    
    const innovationChart = new InnovationChart({
      parentElement: '#innovation-chart',
    }, data);
    innovationChart.updateVis();

    const pieChart = new PieChart({
      parentElement: '#pie-chart',
    }, data);
    pieChart.updateVis();

    const barChart = new BarChart({
      parentElement: '#bar-chart',
    }, data);
    barChart.updateVis();
  });

function collapseCategories(_data) {
  const data = _data;

  data.forEach((d) => {
    Object.keys(d).forEach((attr) => {
      if (attr === 'genre') {
        switch (d[attr]) {
          case 'Fantasy':
          case 'Mystery':
          case 'Family':
          case 'Thriller':
          case 'Sport':
          case 'Sci-Fi':
            d[attr] = 'Other';
            break;
          default:
        }
      }
    });
  });

  return data;
}



