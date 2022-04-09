class Widget {
  constructor() {
    this._tempElt = document.createElement('div');
  }

  // adapted from: https://stackoverflow.com/questions/11805251/add-html-elements-dynamically-with-javascript-inside-div-with-specific-id
  _createFrag(htmlStr) {
    const frag = document.createDocumentFragment();
    this._tempElt.innerHTML = htmlStr;

    while (this._tempElt.firstChild) {
      frag.appendChild(this._tempElt.firstChild);
    }

    return frag;
  }
}
