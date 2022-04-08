class MovieData {
  constructor(data) {
    this._rawData = data;
    this._allGenres = this._setAllGenres(data);
    this._yearMin = this._setYearMin(data);
    this._yearMax = this._setYearMax(data);
  }

  getRawData() {
    return this._rawData;
  }

  getAllGenres() {
    return this._allGenres;
  }

  getAllGenresSet() {
    return new Set(this._allGenres);
  }

  getYearMin() {
    return this._yearMin;
  }

  getYearMax() {
    return this._yearMax;
  }

  getYearRange() {
    return {
      min: this._yearMin,
      max: this._yearMax,
    };
  }

  _setAllGenres() {
    const allGenresSet = new Set();

    this._rawData.forEach((d) => {
      allGenresSet.add(d.genre);
    });

    return [...allGenresSet];
  }

  _setYearMin() {
    let min = Number.MAX_SAFE_INTEGER;

    this._rawData.forEach((m) => {
      min = Math.min(min, +m.Year);
    });

    return min;
  }

  _setYearMax() {
    let max = Number.MIN_SAFE_INTEGER;

    this._rawData.forEach((m) => {
      max = Math.max(max, +m.Year);
    });

    return max;
  }
}
