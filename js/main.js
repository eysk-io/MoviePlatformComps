let barData;

d3.csv('data/groupedPlatformGenre.csv')
  .then((_barData) => {
    barData = _barData
  });

d3.csv('data/preprocessedMovies2.csv')
  .then((_data) => {
    let data = collapseCategories(_data);
    data = groupByPlatform(data);
    let groupedPlatformGenre = d3.rollups(data, v => v.length, d => d.platform + '-' + d.genre);
    let dataPlatformGenre = Array.from(groupedPlatformGenre, ([key, count]) => ({ key, count }));

    return { data, dataPlatformGenre };
  })
  .then(({ data, dataPlatformGenre }) => {
    generateMpaRatingWidgets(data);

    const innovationChart = new InnovationChart({
      parentElement: '#innovation-chart',
      margin: {
        top: 90,
        bottom: 90,
        left: 90,
        right: 90,
      },
      width: 600,
      height: 600,
    }, data);
    innovationChart.updateVis();

    const pieChart = new PieChart({
      parentElement: '#pie-chart',
    }, data);
    pieChart.updateVis();

    const barChart = new BarChart({
      parentElement: '#bar-chart',
    }, barData, dataPlatformGenre);
    barChart.updateVis();
  });

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

function generateMpaRatingWidgets(_data) {
  const data = _data;
  let widgets = new Set();

  data.forEach((d) => widgets.add(d.rating));
  widgets = Array.from(widgets);
  widgets.sort();

  widgets.forEach((w) => {
    const button = createFrag(`<button class="mpa-rating-button">${w}</button>`);
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

function groupByPlatform(_data) {
  const data = _data;
  let groupByPlatformData = []

  data.forEach((d) => {
    Object.keys(d).forEach((attr) => {
      if (attr === 'Netflix' && d[attr] == '1') {
        d['platform'] = 'Netflix'
        groupByPlatformData.push(d)
      }
      if (attr === 'Hulu' && d[attr] == '1') {
        d['platform'] = 'Hulu'
        groupByPlatformData.push(d)
      }
      if (attr === 'Prime Video' && d[attr] == '1') {
        d['platform'] = 'Prime Video'
        groupByPlatformData.push(d)
      }
      if (attr === 'Disney+' && d[attr] == '1') {
        d['platform'] = 'Disney+'
        groupByPlatformData.push(d)
      }
    });
  });
  return groupByPlatformData;
}
