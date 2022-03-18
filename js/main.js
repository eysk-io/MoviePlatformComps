let data;
let innovationChart;
let barChart;
let pieChart;

d3.csv('data/groupByPlatform.csv')
  .then((_data) => {
    data = _data;

    data.sort((a, b) => a.label - b.label);

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
    }, data);
    barChart.updateVis();
  });
