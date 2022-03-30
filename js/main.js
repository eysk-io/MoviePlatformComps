const utils = functions;

d3.csv('data/preprocessedMovies2.csv')
  .then((_data) => {
    let data = utils.collapseCategories(_data);
    data = utils.groupByPlatform(data);

    return { data };
  })
  .then(({ data }) => {
    generateMpaRatingWidgets(data);

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
