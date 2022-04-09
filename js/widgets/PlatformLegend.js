class PlatformLegend extends Widget {
  constructor(inputNode, platforms) {
    super();
    this._legendElts = document.getElementById(inputNode);
    this._platforms = platforms;
  }

  // adapted from: https://stackoverflow.com/questions/11805251/add-html-elements-dynamically-with-javascript-inside-div-with-specific-id
  generate() {
    this._platforms.forEach((p) => {
      const legendButton = this._createFrag(
        `<div class="pie-legend-btn widget active" id="${p.split(' ')[0].split('+')[0]}">${p}</div>`,
      );
      this._legendElts.appendChild(legendButton);
    });
  }
}
