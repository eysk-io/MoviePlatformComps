let barData;

d3.csv('data/preprocessedMovies2.csv')
  .then((_barData) => {
    console.log(_barData);
    xData = groupByPlatform(_barData);
    console.log(xData);
  });

d3.csv('data/preprocessedMovies2.csv')
  .then((_data) => {
    let data = collapseCategories(_data);
    data = groupByPlatform(data);
    let groupedPlatformGenre = d3.rollups(data, v => v.length, d => d.platform + '-' + d.genre);
    let dataPlatformGenre = Array.from(groupedPlatformGenre, ([key, count]) => ({ key, count }));

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
    }, barData, dataPlatformGenre);
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

function groupByPlatform(_data) {
  const data = _data;
  let groupByPlatformData = []

  data.forEach((d) => {
    Object.keys(d).forEach((attr) => {
      if (attr === 'Netflix' && d[attr] == '1') {
        d['platform'] = 'Netflix'
        groupByPlatformData.push(d)
      }
      if (attr === 'Hulu' && d[attr] == '1') {
        d['platform'] = 'Hulu'
        groupByPlatformData.push(d)
      }
      if (attr === 'Prime Video' && d[attr] == '1') {
        d['platform'] = 'Prime Video'
        groupByPlatformData.push(d)
      }
      if (attr === 'Disney+' && d[attr] == '1') {
        d['platform'] = 'Disney+'
        groupByPlatformData.push(d)
      }
    });
  });
  return groupByPlatformData;
}
