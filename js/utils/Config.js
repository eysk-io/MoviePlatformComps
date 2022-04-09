class Config {
  constructor({ platformColors, barColors }) {
    this._platformColors = platformColors;
    this._barColors = barColors;
  }

  getPlatformColors() {
    return { ...this._platformColors };
  }

  getBarColors() {
    return [...this._barColors];
  }
}
