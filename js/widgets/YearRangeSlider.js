// adapted from https://codepen.io/rendykstan/pen/VLqZGO
class YearRangeSlider {
  constructor(inputNode, yearRange) {
    this._sliderElts = document.getElementsByClassName(inputNode);
    this._yearRange = yearRange;
    this._getVals = window.getVals;
  }

  generateSlider() {
    const { min, max } = this._yearRange;

    const minRangeHtml = `<input class="range-input" value=${min} min=${min} max=${max} step="1" type="range">`;
    const maxRangeHtml = `<input class="range-input" value=${max} min=${min} max=${max} step="1" type="range">`;

    const sliderSections = document.getElementsByClassName('range-slider');
    const frags = [createFrag(minRangeHtml), createFrag(maxRangeHtml)];
    frags.forEach((f) => {
      sliderSections[0].appendChild(f);
    });

    // Initialize Sliders
    for (let x = 0; x < sliderSections.length; x += 1) {
      const sliders = sliderSections[x].getElementsByTagName('input');
      for (let y = 0; y < sliders.length; y += 1) {
        if (sliders[y].type === 'range') {
          sliders[y].oninput = this._getVals;
          // Manually trigger event first time to display values
          sliders[y].oninput(this._sliderElts);
        }
      }
    }
  }
}
