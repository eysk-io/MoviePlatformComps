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

function removeChildren(elts) {
  elts.forEach((elt) => {
    while (elt.firstChild) {
      elt.removeChild(elt.firstChild);
    }
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

function filterBySelected(filterVal, selected, dataObj) {
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
  } else if (typeof filterVal === 'object' && filterVal.length === 2) {
    selected.minYear = +filterVal[0];
    selected.maxYear = +filterVal[1];
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

    const isInRange = +d.Year >= selected.minYear && +d.Year <= selected.maxYear;

    return genreExists && mpaaExists && platformExists && isInRange;
  });

  return filtered;
}

const ejj = {
  getAllGenres,
  getAllMpaa,
  getAllPlatforms,
  removeChildren,
  generateMpaRatingWidgets,
  filterBySelected,
};
