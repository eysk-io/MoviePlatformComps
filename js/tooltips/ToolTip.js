/**
 * This class represents a general tooltip.
 */
class ToolTip {
  constructor(id, data, elts) {
    this._id = id;
    this._data = data;
    this._elts = elts;
    this._htmlStr = `<div class="tooltip" id=${id}></div>`;

    document.getElementById('tooltip-container').appendChild(this._createFrag());
  }

  // adapted from: https://stackoverflow.com/questions/11805251/add-html-elements-dynamically-with-javascript-inside-div-with-specific-id
  _createFrag() {
    const tempElt = document.createElement('div');
    const frag = document.createDocumentFragment();
    tempElt.innerHTML = this._htmlStr;

    if (!document.getElementById(this._id)) {
      while (tempElt.firstChild) {
        frag.appendChild(tempElt.firstChild);
      }
    }

    return frag;
  }
}
