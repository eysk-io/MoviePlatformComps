/* eslint-disable func-names */
const utils = functions;
const ejjLib = ejj;

let pieChart;

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

  pieChart = new PieChart({
    parentElement: '#pie-chart',
    colors: config.colors,
    platforms: dataObj.allPlatforms,
    functions,
  }, dataObj.data);

  const barChart = new BarChart({
    parentElement: '#bar-chart',
    colors: config.colors,
    genres: dataObj.allGenres,
    functions,
  }, dataObj.data);
  // barChart.updateVis();

  addListeners(dataObj);
}

function addListeners(dataObj) {
  const widgets = document.querySelectorAll('.widget');
  widgets.forEach((elt) => {
    elt.addEventListener('click', (e) => {
      const filterVal = e.target.innerHTML;
      const filtered = ejjLib.filterBySelected(filterVal, selected, dataObj);

      dataObj = { ...dataObj, data: filtered };

      const allElts = [
        document.getElementById('grid-chart'),
        document.getElementById('pie-chart'),
        document.getElementById('bar-chart'),
        document.getElementById('mpa-rating-button-container'),
      ];

      ejjLib.removeChildren(allElts);

      pieChart.data = dataObj.data;
      pieChart.updateVis();

      // renderAll(dataObj);
    });
  });
}

// d3.selectAll('.pie-legend-btn').on('click', function () {
//   d3.select(this).classed('active', !d3.select(this).classed('active'));
//   const activePlatforms = [];
//   d3.selectAll('.pie-legend-btn.active').each(function () {
//     activePlatforms.push(d3.select(this).attr('data-platform'));
//   });
//   let updatedData = data.filter((d) => activePlatforms.includes(d.platform));
//   if (updatedData.length === 0) {
//     updatedData = data;
//     d3.selectAll('.pie-legend-btn').classed('active', true);
//   }
//   pieChart.data = updatedData;
//   pieChart.updateVis();
// });
