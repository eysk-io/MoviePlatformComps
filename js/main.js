/* eslint-disable func-names */
const utils = functions;
const ejjLib = ejj;

let dataObj;

let pieChart;
let barChart;
let gridChart;

const selected = {
  genres: [],
  mpaa: [],
  platforms: [],
  minYear: -1,
  maxYear: -1,
};

d3.csv('data/preprocessedMovies2.csv')
  .then((data) => {
    let rawData = utils.collapseCategories(data);
    rawData = utils.groupByPlatform(rawData);

    return rawData;
  })
  .then((rawData) => {
    const movieData = new MovieData(rawData);

    const allGenreSet = ejjLib.getAllGenres(rawData);
    const allMpaaSet = ejjLib.getAllMpaa(rawData);
    const allPlatformsSet = ejjLib.getAllPlatforms(rawData);

    selected.genres = Array.from(allGenreSet);
    selected.mpaa = Array.from(allMpaaSet);
    selected.platforms = Array.from(allPlatformsSet);
    selected.minYear = movieData.getYearMin();
    selected.maxYear = movieData.getYearMax();

    dataObj = {
      rawData,
      data: rawData,
      allGenres: allGenreSet,
      allMpaa: allMpaaSet,
      allPlatforms: allPlatformsSet,
    };

    ejjLib.generateMpaRatingWidgets(dataObj.rawData);
    renderCharts();

    new YearRangeSlider('range-input', movieData.getYearRange()).generateSlider();
  });

function renderCharts() {
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

function addListeners() {
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

function applyYearRanges() {
  const rangeValueElts = document.getElementsByClassName('rangeValues');
  rangeValueElts[0].dispatchEvent(new Event('change'));

  const rangeValueStr = rangeValueElts[0].innerHTML;

  const minYear = rangeValueStr.substring(15, 20);
  const maxYear = rangeValueStr.substring(22);

  const filtered = ejjLib.filterBySelected([minYear, maxYear], selected, dataObj);
  dataObj = { ...dataObj, data: filtered };

  pieChart.data = dataObj.data;
  pieChart.updateVis();

  barChart.data = dataObj.data;
  barChart.updateVis();

  gridChart.data = dataObj.data;
  gridChart.updateVis();
}

// adapted from https://codepen.io/rendykstan/pen/VLqZGO
// eslint-disable-next-line func-names
window.getVals = function () {
  // Get slider values
  const parent = this.parentNode;
  const slides = parent.getElementsByTagName('input');
  let slide1 = parseFloat(slides[0].value);
  let slide2 = parseFloat(slides[1].value);
  // Neither slider will clip the other, so make sure we determine which is larger
  if (slide1 > slide2) { const tmp = slide2; slide2 = slide1; slide1 = tmp; }

  const displayElement = parent.getElementsByClassName('rangeValues')[0];
  displayElement.innerHTML = `Year Released: ${slide1} - ${slide2}`;
};
