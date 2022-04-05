const utils = functions;

d3.csv('data/preprocessedMovies2.csv')
  .then((_data) => {
    const data = utils.collapseCategories(_data);
    return utils.groupByPlatform(data);
  })
  .then((data) => {
    renderAll(data);
    return data;
  });

function renderCharts(data) {
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
  // gridChart.updateVis();

  const pieChart = new PieChart({
    parentElement: '#pie-chart',
    colors: config.colors,
    functions,
  }, data);
  // pieChart.updateVis();

  const barChart = new BarChart({
    parentElement: '#bar-chart',
    colors: config.colors,
    functions,
  }, data);
  // barChart.updateVis();
}
function renderAll(data) {
  generateMpaRatingWidgets(data);
  renderCharts(data);

  const widgets = document.querySelectorAll('.widget');
  widgets.forEach((elt) => {
    elt.addEventListener('click', (e) => {
      // eslint-disable-next-line no-console
      console.log(e.target.innerHTML);

      const allElts = [
        document.getElementById('grid-chart'),
        document.getElementById('pie-chart'),
        document.getElementById('bar-chart'),
        document.getElementById('mpa-rating-button-container'),
      ];

      removeChildren(allElts);

      renderAll(data);
    });
  });
}

function removeChildren(elts) {
  elts.forEach((elt) => {
    while (elt.firstChild) {
      elt.removeChild(elt.firstChild);
    }
  });
}

function generateMpaRatingWidgets(_data) {
  const data = _data;
  let widgets = new Set();

  data.forEach((d) => widgets.add(d.rating));
  widgets = Array.from(widgets);
  widgets.sort();

  widgets.forEach((w) => {
    const button = createFrag(`<button class="mpa-rating-button widget">${w}</button>`);
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
