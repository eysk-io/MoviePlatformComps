const utils = functions;
let data;
let gridChart;
let pieChart;
let barChart;

d3.csv('data/preprocessedMovies2.csv')
  .then((_data) => {
    data = utils.collapseCategories(_data);
    data = utils.groupByPlatform(data);

    return { data };
  })
  .then(({ data }) => {
    generateMpaRatingWidgets(data);

    gridChart = new GridChart({
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

    pieChart = new PieChart({
      parentElement: '#pie-chart',
      colors: config.colors,
      functions,
    }, data);
    pieChart.updateVis();

    barChart = new BarChart({
      parentElement: '#bar-chart',
      colors: config.colors,
      functions,
    }, data);    
  });

function generateMpaRatingWidgets(_data) {
  const data = _data;
  let widgets = new Set();

  data.forEach((d) => widgets.add(d.rating));
  widgets = Array.from(widgets);
  widgets.sort();

  widgets.forEach((w) => {
    const button = createFrag(`<button class="mpa-rating-button">${w}</button>`);
    document.getElementById('mpa-rating-button-container').appendChild(button);
  });
}

// https://stackoverflow.com/questions/11805251/add-html-elements-dynamically-with-javascript-inside-div-with-specific-id
function createFrag(htmlStr) {
  const frag = document.createDocumentFragment();
  const temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

d3.selectAll('.pie-legend-btn').on('click', function() {
  d3.select(this).classed('active', !d3.select(this).classed('active'));
  let activePlatforms = [];
  d3.selectAll('.pie-legend-btn.active').each(function() {
     activePlatforms.push(d3.select(this).attr('data-platform')); 
  });
  let updatedData = data.filter(d => activePlatforms.includes(d.platform));
  if (updatedData.length == 0) {
    updatedData = data;
  }
  gridChart.data = updatedData;
  gridChart.updateVis();
  pieChart.data = updatedData;
  pieChart.updateVis();
  barChart.rawData = updatedData;
  barChart.updateVis();
})



