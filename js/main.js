const utils = functions;
const selected = [];

d3.csv('data/preprocessedMovies2.csv')
  .then((_data) => {
    const data = utils.collapseCategories(_data);
    return utils.groupByPlatform(data);
  })
  .then((rawData) => {
    const dataObj = {
      rawData,
      data: rawData,
      allGenres: getAllGenres(rawData),
    };
    renderAll(dataObj);
  });

function renderCharts(dataObj) {
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
  }, dataObj.data);
  // gridChart.updateVis();

  // const pieChart = new PieChart({
  //   parentElement: '#pie-chart',
  //   colors: config.colors,
  //   functions,
  // }, dataObj.data);
  // pieChart.updateVis();

  const barChart = new BarChart({
    parentElement: '#bar-chart',
    colors: config.colors,
    genres: dataObj.allGenres,
    functions,
  }, dataObj.data);
  // barChart.updateVis();
}
function renderAll(dataObj) {
  // generateMpaRatingWidgets(dataObj.data);
  renderCharts(dataObj);

  const widgets = document.querySelectorAll('.widget');
  widgets.forEach((elt) => {
    elt.addEventListener('click', (e) => {
      selected.push(e.target.innerHTML);

      const filtered = dataObj.rawData.filter((d) => {
        let exists = false;
        selected.forEach((s) => {
          if (Object.values(d).includes(s)) {
            exists = true;
          }
        });
        return exists;
      });

      dataObj = { ...dataObj, data: filtered };

      const allElts = [
        document.getElementById('grid-chart'),
        document.getElementById('pie-chart'),
        document.getElementById('bar-chart'),
        document.getElementById('mpa-rating-button-container'),
      ];

      removeChildren(allElts);

      renderAll(dataObj);
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

function getAllGenres(data) {
  const allGenres = new Set();

  data.forEach((d) => {
    allGenres.add(d.genre);
  });

  return allGenres;
}
