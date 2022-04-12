class GenreLegend extends Widget {
  constructor(inputNode, genres, barColors) {
    super();
    this._legendElts = document.getElementById(inputNode);
    this._genres = genres;
    this._barColors = barColors;
  }

  // adapted from: https://stackoverflow.com/questions/11805251/add-html-elements-dynamically-with-javascript-inside-div-with-specific-id
  generate() {
    // create pie chart legend
    this._genres.forEach((p, i) => {
      const dataColor = this._barColors[i];

      const legendButton = this._createFrag(
        `<button class="bar-chart-category widget active" data-value="${p}" data-color="${dataColor}" style="background-color: ${dataColor}">${p}</button>`,
      );
      this._legendElts.appendChild(legendButton);
    });
  }
}
