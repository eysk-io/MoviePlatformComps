const utils = functions;
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
    const allGenreSet = getAllGenres(rawData);
    const allMpaaSet = getAllMpaa(rawData);
    const allPlatformsSet = getAllPlatforms(rawData);

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
  //   platforms: dataObj.allPlatforms,
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
  generateMpaRatingWidgets(dataObj.rawData);
  renderCharts(dataObj);

  const widgets = document.querySelectorAll('.widget');
  widgets.forEach((elt) => {
    elt.addEventListener('click', (e) => {
      const filterVal = e.target.innerHTML;
      if (dataObj.allGenres.has(filterVal)) {
        if (selected.genres.includes(filterVal)) {
          const idx = selected.genres.indexOf(filterVal);
          selected.genres.splice(idx, 1);
        } else {
          selected.genres.push(filterVal);
        }
      } else if (dataObj.allMpaa.has(filterVal)) {
        if (selected.mpaa.includes(filterVal)) {
          const idx = selected.mpaa.indexOf(filterVal);
          selected.mpaa.splice(idx, 1);
        } else {
          selected.mpaa.push(filterVal);
        }
      } else if (dataObj.allPlatforms.has(filterVal)) {
        if (selected.platforms.includes(filterVal)) {
          const idx = selected.platforms.indexOf(filterVal);
          selected.platforms.splice(idx, 1);
        } else {
          selected.platforms.push(filterVal);
        }
      }

      const filtered = dataObj.rawData.filter((d) => {
        let genreExists = false;
        selected.genres.forEach((s) => {
          if (Object.values(d).includes(s)) {
            genreExists = true;
          }
        });

        let mpaaExists = false;
        selected.mpaa.forEach((s) => {
          if (Object.values(d).includes(s)) {
            mpaaExists = true;
          }
        });

        let platformExists = false;
        selected.platforms.forEach((s) => {
          if (Object.values(d).includes(s)) {
            platformExists = true;
          }
        });

        return genreExists && mpaaExists && platformExists;
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

function getAllMpaa(data) {
  const allMpaa = new Set();

  data.forEach((d) => {
    allMpaa.add(d.rating);
  });

  return allMpaa;
}

function getAllPlatforms(data) {
  const allPlatforms = new Set();

  data.forEach((d) => {
    allPlatforms.add(d.platform);
  });

  return allPlatforms;
}
