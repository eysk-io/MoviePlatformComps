class PlatformLegend extends Widget {
  constructor(inputNode, platforms, platformColors) {
    super();
    this._legendElts = document.getElementById(inputNode);
    this._platforms = platforms;
    this._platformColors = platformColors;
  }

  // adapted from: https://stackoverflow.com/questions/11805251/add-html-elements-dynamically-with-javascript-inside-div-with-specific-id
  generate() {
    // create pie chart legend
    this._platforms.forEach((p) => {
      const colorIdx = p.split(' ')[0].split('+')[0];
      const dataColor = this._platformColors[colorIdx];
      const legendButton = this._createFrag(
        `<button class="widget active" data-value="${p}" data-color="${dataColor}" style="background-color: ${dataColor}">${p}</button>`,
      );
      this._legendElts.appendChild(legendButton);
    });
  }
}
