function collapseCategories(_data) {
  const data = _data;

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

function groupByPlatform(_data) {
  const data = _data;
  const groupByPlatformData = [];
  data.forEach((d) => {
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

function aggregateData(data, bands, platforms) {
  // group = x axis value
  // variable = y axis value

  const aggregatedData = new Array(9);
  const varsByGroup = [
    [{ total: 0 }, { total: 0 }, { total: 0 }],
    [{ total: 0 }, { total: 0 }, { total: 0 }],
    [{ total: 0 }, { total: 0 }, { total: 0 }],
  ];

  varsByGroup.forEach((v) => {
    v.forEach((g) => {
      platforms.forEach((p) => {
        g[p] = 0;
      });
    });
  });

  data.forEach((d) => {
    if (+d.budget !== 0 && +d.gross !== 0) {
      const currPerf = getPerfScore(d);

      let row;
      if (currPerf < bands[0].maxPerf) {
        row = 0;
      } else if (currPerf < bands[1].maxPerf) {
        row = 1;
      } else {
        row = 2;
      }

      let col;
      if (d['Rotten Tomato Score'] <= bands[0].maxScore) {
        col = 0;
      } else if (d['Rotten Tomato Score'] <= bands[1].maxScore) {
        col = 1;
      } else {
        col = 2;
      }

      varsByGroup[row][col].total += 1;
      varsByGroup[row][col][d.platform] += 1;
    }
  });

  let aggregatedDataIdx = 0;
  for (let varIdx = 0; varIdx < varsByGroup.length; varIdx += 1) {
    for (let groupIdx = 0; groupIdx < varsByGroup[0].length; groupIdx += 1) {
      aggregatedData[aggregatedDataIdx] = {
        variable: bands[varIdx].perfBand.toUpperCase(),
        group: bands[groupIdx].scoreBand.toUpperCase(),
        value: varsByGroup[varIdx][groupIdx],
      };
      aggregatedDataIdx += 1;
    }
  }
  return aggregatedData;
}

/**
   * [
   *  {xPos: 120, yPos: 600} (Low, Low) (Variable(x), Group(y))
   *  {xPos: 360, yPos: 600} (Low, Med)
   *  {xPos: 600, yPos: 600} (Low, High)
   *  {xPos: 120, yPos: 360} (Med, Low)
   *  {xPos: 360, yPos: 360} (Med, Med)
   *  {xPos: 600, yPos: 360} (Med, High)
   *  {xPos: 120, yPos: 120} (High, Low)
   *  {xPos: 360, yPos: 120} (High, Med)
   *  {xPos: 600, yPos: 120} (High, High)
   * ]
   */

function setGridPos(data, config) {
  const gridWidthStart = config.width / 6;
  const gridHeightStart = config.height / 6;
  for (let i = data.length - 1; i >= 0; i -= 1) {
    const pos = {
      xPos: gridWidthStart + gridWidthStart * 2 * ((data.length - 1 - i) % 3),
      yPos: gridHeightStart + gridHeightStart * 2 * Math.floor(i / 3),
    };

    const dataIdx = data.length - 1 - i;
    data[dataIdx] = { ...data[dataIdx], ...pos };
  }

  return data;
}

function getAllPlatforms(data) {
  const platforms = new Set();
  data.forEach((d) => {
    platforms.add(d.platform);
  });

  return [...platforms];
}

function setScoreBands() {
  const numGrids = 3;
  const result = new Array(numGrids);
  const minScore = 0;
  const maxScore = 100;

  for (let i = 0; i < numGrids; i += 1) {
    const currScore = (i + 1) * (maxScore / numGrids);
    let currMin;
    let currMax;
    let currBand;

    if (i === 0) {
      currMin = minScore;
      currMax = Math.round(currScore);
      currBand = 'low';
    } else if (i === 1) {
      currMin = result[i - 1].maxScore + 1;
      currMax = Math.round(currScore);
      currBand = 'med';
    } else {
      currMin = result[i - 1].maxScore + 1;
      currMax = maxScore;
      currBand = 'high';
    }

    result[i] = {
      minScore: currMin,
      maxScore: currMax,
      scoreBand: currBand,
    };
  }

  return result;
}

function setFinancialPerfBands(data, bands) {
  const numGrids = 3;
  const result = bands;
  let minPerf = Number.MAX_SAFE_INTEGER;
  let maxPerf = Number.MIN_SAFE_INTEGER;

  data.forEach((d) => {
    if (+d.budget !== 0 && +d.gross !== 0) {
      const currPerf = getPerfScore(d);
      maxPerf = Math.max(
        currPerf,
        maxPerf,
      );

      minPerf = Math.min(
        currPerf,
        minPerf,
      );
    }
  });

  const bandSize = parseFloat((maxPerf - minPerf).toFixed(3)) / numGrids;

  let prevPerf = minPerf;
  for (let i = 0; i < bands.length; i += 1) {
    const currPerf = prevPerf + bandSize;
    let currMin;
    let currMax;
    let currBand;

    if (i === 0) {
      currMin = prevPerf;
      currMax = currPerf;
      currBand = 'low';
    } else if (i === 1) {
      currMin = prevPerf;
      currMax = currPerf;
      currBand = 'med';
    } else {
      currMin = prevPerf;
      currMax = maxPerf;
      currBand = 'high';
    }

    budgetObj = {
      minPerf: currMin,
      maxPerf: currMax,
      perfBand: currBand,
    };

    prevPerf = currPerf;

    result[i] = { ...result[i], ...budgetObj };
  }

  return result;
}

function getPerfScore(d) {
  return Math.log(+d.gross / +d.budget);
}

/* returns the max genre x platform count for grouped bar chart: used to set bar chart height
 * @param: rawData: raw data object from main.js
 * returns: int: the max genre x platform count
 * */
function getMaxGenreCount(rawData) {
  const groupedPlatformGenre = d3.rollups(rawData, (v) => v.length, (d) => `${d.platform}-${d.genre}`);
  const dataPlatformGenre = Array.from(groupedPlatformGenre, ([key, count]) => ({ key, count }));
  dataPlatformGenre.sort((a, b) => b.count - a.count);

  return dataPlatformGenre[0].count;
}

/* Aggregates genre count based on platform.
 * The result is updated to map object passed in as parameter
 * @param: platformToGenres: an empty map
 *         rawData: expanded movies dataset
 * returns: nothing
 * */
function setGenreCounts(rawData, allGenres) {
  const platformToGenres = new Map();
  rawData.sort((a, b) => d3.ascending(a.genre, b.genre));

  let allCounts;
  rawData.forEach((d) => {
    if (platformToGenres.has(d.platform)) {
      allCounts = platformToGenres.get(d.platform);
    } else {
      allCounts = new Map();
      allGenres.forEach((g) => allCounts.set(g, 0));
    }
    const currCount = allCounts.get(d.genre);
    allCounts.set(d.genre, currCount + 1);
    platformToGenres.set(d.platform, allCounts);
  });
  return crosstabFormat(platformToGenres);
}

/* converts aggregated genre count map into a flat crosstab object array for grouped bar chart
 * @param: genreCounts: map object updated in vis.setGenreCounts()
 * returns: a flat crosstab object array
 * */
function crosstabFormat(genreCounts) {
  let barGroups = []; let
    keys = [];
  barGroups = Array.from(genreCounts, ([group, genre]) => ({ group, genre }));

  let i = 0; const
    barData = [];
  barGroups.forEach((d) => {
    let temp = [];
    temp = Array.from(barGroups[i].genre, ([name, value]) => ({ name, value }));
    const tempObj = temp.reduce((total, current) => {
      total[current.name] = current.value.toString();
      return total;
    }, { group: barGroups[i].group });
    barData.push(tempObj);
    i += 1;
  });
  keys = Object.keys(barData[0]);
  barData.columns = keys;

  return barData;
}

const functions = {
  collapseCategories,
  groupByPlatform,
  aggregateData,
  setGridPos,
  getAllPlatforms,
  setScoreBands,
  setFinancialPerfBands,
  getMaxGenreCount,
  setGenreCounts,
  crosstabFormat,
};
