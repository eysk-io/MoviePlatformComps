class Config {
  constructor({ platformColors, barColors, financialPerfBands }) {
    this._platformColors = platformColors;
    this._barColors = barColors;
    this._financialPerfBands = financialPerfBands;
  }

  getFinancialPerfBands() {
    const logScaleBands = [];

    this._financialPerfBands.forEach((f) => {
      const eachBand = [
        f[0],
        Math.log(f[1]),
      ];
      logScaleBands.push(eachBand);
    });

    return logScaleBands;
  }

  getPlatformColors() {
    return { ...this._platformColors };
  }

  getBarColors() {
    return [...this._barColors];
  }
}
