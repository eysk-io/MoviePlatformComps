/**
 * This class represents the "reset all" button.
 */
class ResetButton extends Widget {
  constructor(inputNode) {
    super();
    this._inputNode = inputNode;
    this._buttonElt = document.getElementById(inputNode);
  }

  // adapted from: https://stackoverflow.com/questions/11805251/add-html-elements-dynamically-with-javascript-inside-div-with-specific-id
  generate() {
    // create pie chart legend
    const resetButtonFrag = this._createFrag(
      '<button class="widget" style="height:35px; background-color:red;">Reset All</button>',
    );
    this._buttonElt.appendChild(resetButtonFrag);

    const buttonElt = document.querySelector(`#${this._inputNode}`);
    buttonElt.addEventListener('click', () => {
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    });
  }
}
