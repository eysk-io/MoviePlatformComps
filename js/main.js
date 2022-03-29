const utils = functions;

d3.csv('data/preprocessedMovies2.csv')
  .then((_data) => {
    let data = utils.collapseCategories(_data);
    data = utils.groupByPlatform(data);

    return { data };
  })
  .then(({ data }) => {
    const gridChart = new GridChart({
      parentElement: '#grid-chart',
      margin: {
        top: 90,
        bottom: 90,
        left: 90,
        right: 90,
      },
      width: 900,
      height: 900,
      colors: config.colors,
      functions,
    }, data);
    gridChart.updateVis();

    const pieChart = new PieChart({
      parentElement: '#pie-chart',
      colors: config.colors,
      functions,
    }, data);
    pieChart.updateVis();

    const barChart = new BarChart({
      parentElement: '#bar-chart',
      colors: config.colors,
      functions,
    }, data);
    // barChart.updateVis();
  });
