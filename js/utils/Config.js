/**
 * This class represents the application's configurations.
 * These values are initialized upon the project's initialization.
 * The values should NOT be changed.
 */
class Config {
  constructor({
    platformColors,
    barColors,
    mpaRatingsColor,
    mpaRatingsOrdered,
    financialPerfBands,
  }) {
    this._platformColors = platformColors;
    this._barColors = barColors;
    this._mpaRatingsColor = mpaRatingsColor;
    this._mpaRatingsOrdered = mpaRatingsOrdered;
    this._financialPerfBands = financialPerfBands;
  }

  getFinancialPerfBands() {
    return [...this._financialPerfBands];
  }

  getMpaRatingsColor() {
    return this._mpaRatingsColor;
  }

  getMpaRatingsOrdered() {
    return [...this._mpaRatingsOrdered];
  }

  getPlatformColors() {
    return { ...this._platformColors };
  }

  getBarColors() {
    return [...this._barColors];
  }
}
