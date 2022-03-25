let data;
let barData;
let innovationChart;
let barChart;
let pieChart;

d3.csv('data/groupedPlatformGenre.csv')
      .then((_barData) => {
      barData = _barData;

      console.log('barData', barData);
});

d3.csv('data/groupByPlatform.csv')
  .then((_data) => {
    const data = collapseCategories(_data);
    // console.log(_data);

    let groupedPlatformGenre = d3.rollups(data, v => v.length, d => d.platform + '-' + d.genre);
    let dataPlatformGenre = Array.from(groupedPlatformGenre, ([key, count]) => ({ key, count }));
  
    dataPlatformGenre.sort((a, b) => b.count - a.count);
    console.log('dataPlatformGenre', dataPlatformGenre);

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
    }, barData, dataPlatformGenre, data);
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
          // default:
            d[attr] = 'Other';
        }
      }
    });
  });

  return data;
}



