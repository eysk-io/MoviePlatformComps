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
      allGenres.forEach((d) => selected.genres.push(d));
    }
    if (selected.mpaa.length === 0) {
      allMpaa.forEach((d) => selected.mpaa.push(d));
    }
    if (selected.platforms.length === 0) {
      allPlatforms.forEach((d) => selected.platforms.push(d));
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
