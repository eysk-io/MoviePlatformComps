/**
 * This class represents the mpa rating filter widgets.
 */
class MpaButtons extends Widget {
  constructor(inputNode, ratings, color) {
    super();
    this._buttonsElts = document.getElementById(inputNode);
    this._ratings = ratings;
    this._color = color;
  }

  // adapted from: https://stackoverflow.com/questions/11805251/add-html-elements-dynamically-with-javascript-inside-div-with-specific-id
  generate() {
    this._ratings.forEach((r) => {
      const button = this._createFrag(`<button class="mpa-rating-button widget active" data-value="${r}" data-color="${this._color}" style="background-color: ${this._color}">${r}</button>`);
      this._buttonsElts.appendChild(button);
    });
  }
}
