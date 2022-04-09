class FilterHandler {
  constructor(movieData, filterVal, filter) {
    this._movieData = movieData;
    this._filterVal = filterVal;
    this._filter = filter || {
      genres: movieData.getAllGenres(),
      mpaa: movieData.getAllMpaa(),
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
    const allMpaa = this._movieData.getAllMpaa();
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
    } else if (allMpaa.includes(filterVal)) {
      if (selected.mpaa.includes(filterVal)) {
        const idx = selected.mpaa.indexOf(filterVal);
        selected.mpaa.splice(idx, 1);
      } else {
        selected.mpaa.push(filterVal);
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

    const filtered = data.filter((d) => {
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
}
