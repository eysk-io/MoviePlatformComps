/**
 * This class handles the application's filtering upon widget interactions.
 */
class FilterHandler {
  constructor(movieData, filterVal, filter) {
    this._movieData = movieData;
    this._filterVal = filterVal;
    this._filter = filter || {
      genres: movieData.getAllGenres(),
      mpa: movieData.getAllMpa(),
      platforms: movieData.getAllPlatforms(),
      minYear: movieData.getYearMin(),
      maxYear: movieData.getYearMax(),
    };
  }

  getMovieData() {
    return { ...this._movieData };
  }

  getFilterVal() {
    return this._filterVal;
  }

  getFilter() {
    return { ...this._filter };
  }

  setMovieData(movieData) {
    this._movieData = movieData;
  }

  setFilterVal(filterVal) {
    this._filterVal = filterVal;
  }

  setFilter(filter) {
    this._filter = filter;
  }

  /**
   * Filter the movie's selected data by the current filters applied
   * @returns filtered data
   */
  filterBySelected() {
    const allGenres = this._movieData.getAllGenres();
    const allMpa = this._movieData.getAllMpa();
    const allPlatforms = this._movieData.getAllPlatforms();
    const data = this._movieData.getProcessedData();
    const selected = this._filter;

    const filterVal = this._filterVal;

    if (allGenres.includes(filterVal)) {
      if (selected.genres.includes(filterVal)) {
        const idx = selected.genres.indexOf(filterVal);
        selected.genres.splice(idx, 1);
      } else {
        selected.genres.push(filterVal);
      }
    } else if (allMpa.includes(filterVal)) {
      if (selected.mpa.includes(filterVal)) {
        const idx = selected.mpa.indexOf(filterVal);
        selected.mpa.splice(idx, 1);
      } else {
        selected.mpa.push(filterVal);
      }
    } else if (allPlatforms.includes(filterVal)) {
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

    // Select all if widget compeletely deselected
    if (selected.genres.length === 0) {
      allGenres.forEach((d) => {
        selected.genres.push(d);
        swapColor(d);
      });
    }
    if (selected.mpa.length === 0) {
      allMpa.forEach((d) => {
        selected.mpa.push(d);
        swapColor(d);
      });
    }
    if (selected.platforms.length === 0) {
      allPlatforms.forEach((d) => {
        selected.platforms.push(d);
        swapColor(d);
      });
    }

    const filtered = data.filter((d) => {
      let genreExists = false;
      selected.genres.forEach((s) => {
        if (Object.values(d).includes(s)) {
          genreExists = true;
        }
      });

      let mpaExists = false;
      selected.mpa.forEach((s) => {
        if (Object.values(d).includes(s)) {
          mpaExists = true;
        }
      });

      let platformExists = false;
      selected.platforms.forEach((s) => {
        if (Object.values(d).includes(s)) {
          platformExists = true;
        }
      });

      const isInRange = +d.Year >= selected.minYear && +d.Year <= selected.maxYear;

      return genreExists && mpaExists && platformExists && isInRange;
    });

    return filtered;
  }
}

/**
 * Swap the color of the element with data-value === filterVal to a default colour and back
 * @param {*} filterVal
 */
function swapColor(filterVal) {
  const currButton = document.querySelector(`[data-value="${filterVal}"]`);
  const currButtonColor = currButton.style.cssText;

  // Must use rgb as currButton.style.cssText will always output rgb
  currButton.style.cssText = currButtonColor === 'background-color: rgb(234, 221, 208);'
    ? `background-color: ${currButton.getAttribute('data-color')}`
    : 'background-color: rgb(234, 221, 208);';
}
