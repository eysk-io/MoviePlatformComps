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
