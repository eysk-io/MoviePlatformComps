class MpaaButtons extends Widget {
  constructor(inputNode, ratings) {
    super();
    this._buttonsElts = document.getElementById(inputNode);
    this._ratings = ratings;
  }

  // adapted from: https://stackoverflow.com/questions/11805251/add-html-elements-dynamically-with-javascript-inside-div-with-specific-id
  generate() {
    this._ratings.forEach((r) => {
      const button = this._createFrag(`<button class="mpa-rating-button widget">${r}</button>`);
      this._buttonsElts.appendChild(button);
    });
  }
}
