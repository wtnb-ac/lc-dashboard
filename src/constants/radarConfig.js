// src/constants/radarConfig.js

export const indicatorsConfig = [
    { name: '死亡保障', key: 'death', unit: '%' },
    { name: '就業不能', key: 'disability', unit: '%' },
    { name: '医療保障', key: 'medical', unit: '%' },
    { name: '重い病気', key: 'critical', unit: '%' },
    { name: '資産準備', key: 'savings', unit: '%' }
  ];
  
  // Note: requiredCoverage represents target amounts for 100% benchmark in some calculations,
  // but actual required levels for the grey line are calculated in App.js useMemo.
  // Keep this data structure for potential use in calculation functions.
  export const requiredCoverageBenchmark = {
    deathLumpsum: 1000, deathAnnuity: 10, disabilityLumpsum: 2000, disabilityMonthly: 20,
    medicalDaily: 5000, medicalSurgery: 0, criticalCancer: 100, criticalCirculatory: 100,
    savingsMonthly: 40000 // Example benchmark, actual target for 100% might differ (e.g., 60k in calc)
  };