/**
 * This class represents the processed data used for the application's charts
 */
class MovieData {
  constructor(data) {
    this._rawData = data;
    this._processedData = this._createProcessedData();
    this._allGenres = this._createAllGenres();
    this._allMpa = this._createAllMpa();
    this._allPlatforms = this._createAllPlatforms();
    this._yearMin = this._createYearMin();
    this._yearMax = this._createYearMax();
  }

  getRawData() {
    return [...this._rawData];
  }

  getProcessedData() {
    return [...this._processedData];
  }

  getAllGenres() {
    return [...this._allGenres];
  }

  getAllGenresSet() {
    return new Set(this._allGenres);
  }

  getAllMpa() {
    return [...this._allMpa];
  }

  getAllMpaSet() {
    return new Set(this._allMpa);
  }

  getAllPlatforms() {
    return [...this._allPlatforms];
  }

  getAllPlatformsSet() {
    return new Set(this._allPlatforms);
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

  _createProcessedData() {
    this._processedData = this._collapseCategories();
    return this._groupByPlatform();
  }

  _createAllGenres() {
    const allGenresSet = new Set();

    this._processedData.forEach((d) => {
      allGenresSet.add(d.genre);
    });

    return [...allGenresSet];
  }

  _createAllMpa() {
    const allMpaSet = new Set();

    this._processedData.forEach((d) => {
      allMpaSet.add(d.rating);
    });

    return [...allMpaSet];
  }

  _createAllPlatforms() {
    const allPlatformsSet = new Set();

    this._processedData.forEach((d) => {
      allPlatformsSet.add(d.platform);
    });

    return [...allPlatformsSet];
  }

  _createYearMin() {
    let min = Number.MAX_SAFE_INTEGER;

    this._processedData.forEach((m) => {
      min = Math.min(min, +m.Year);
    });

    return min;
  }

  _createYearMax() {
    let max = Number.MIN_SAFE_INTEGER;

    this._processedData.forEach((m) => {
      max = Math.max(max, +m.Year);
    });

    return max;
  }

  _collapseCategories() {
    const data = this._rawData;

    data.forEach((d) => {
      Object.keys(d).forEach((attr) => {
        if (attr === 'genre') {
          switch (d[attr]) {
            case 'Fantasy':
            case 'Mystery':
            case 'Family':
            case 'Thriller':
            case 'Sport':
            case 'Sci-Fi':
              d[attr] = 'Other';
              break;
            default:
          }
        }
      });
    });

    return data;
  }

  _groupByPlatform() {
    const data = this._processedData;
    const groupByPlatformData = [];

    data.forEach((d) => {
      let dClone;
      if (d.Netflix === '1') {
        dClone = { ...d };
        dClone.platform = 'Netflix';
        groupByPlatformData.push(dClone);
      }
      if (d.Hulu === '1') {
        dClone = { ...d };
        dClone.platform = 'Hulu';
        groupByPlatformData.push(dClone);
      }
      if (d['Prime Video'] === '1') {
        dClone = { ...d };
        dClone.platform = 'Prime Video';
        groupByPlatformData.push(dClone);
      }
      if (d['Disney+'] === '1') {
        dClone = { ...d };
        dClone.platform = 'Disney+';
        groupByPlatformData.push(dClone);
      }
    });

    return groupByPlatformData;
  }
}
