/**
 * This class is an extension of MovieData.js.
 * The structure is used to keep state for the dataset's filtered values for chart updates
 */
class FilteredData extends MovieData {
  constructor(data) {
    super(data);
    this._filteredData = this._processedData;
  }

  getFilteredData() {
    return [...this._filteredData];
  }

  setFilteredData(data) {
    this._filteredData = data;
  }
}
