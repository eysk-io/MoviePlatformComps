/* eslint-disable func-names */
const utils = functions;
const ejjLib = ejj;

let pieChart;
let barChart;
let gridChart;

const selected = {
  genres: [],
  mpaa: [],
  platforms: [],
};

d3.csv('data/preprocessedMovies2.csv')
  .then((data) => {
    let rawData = utils.collapseCategories(data);
    rawData = utils.groupByPlatform(rawData);

    return rawData;
  })
  .then((rawData) => {
    const allGenreSet = ejjLib.getAllGenres(rawData);
    const allMpaaSet = ejjLib.getAllMpaa(rawData);
    const allPlatformsSet = ejjLib.getAllPlatforms(rawData);

    selected.genres = Array.from(allGenreSet);
    selected.mpaa = Array.from(allMpaaSet);
    selected.platforms = Array.from(allPlatformsSet);

    const dataObj = {
      rawData,
      data: rawData,
      allGenres: allGenreSet,
      allMpaa: allMpaaSet,
      allPlatforms: allPlatformsSet,
    };

    ejjLib.generateMpaRatingWidgets(dataObj.rawData);
    renderCharts(dataObj);
  });

function renderCharts(dataObj) {
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
  }, dataObj.data);

  pieChart = new PieChart({
    parentElement: '#pie-chart',
    colors: config.colors,
    platforms: dataObj.allPlatforms,
    functions,
  }, dataObj.data);

  barChart = new BarChart({
    parentElement: '#bar-chart',
    colors: config.colors,
    genres: config.colors.allGenres,
    platforms: config.colors.allPlatforms,
    functions,
  }, dataObj.data);

  addListeners(dataObj);
}

function addListeners(dataObj) {
  const widgets = document.querySelectorAll('.widget');
  widgets.forEach((elt) => {
    elt.addEventListener('click', (e) => {
      const filterVal = e.target.innerHTML;
      const filtered = ejjLib.filterBySelected(filterVal, selected, dataObj);

      elt.classList.toggle('active');

      dataObj = { ...dataObj, data: filtered };

      pieChart.data = dataObj.data;
      pieChart.updateVis();

      barChart.data = dataObj.data;
      barChart.updateVis();

      gridChart.data = dataObj.data;
      gridChart.updateVis();
    });
  });
}
