// src/constants/sliderConfig.js

export const sliderConfigs = [
    { category: '死亡保障', iconClass: 'fas fa-user-shield', colorClass: 'border-blue-500', sliders: [
      { key: 'deathLumpsum', label: '一時金 (万円)', min: 0, max: 5000, step: 100 },
      { key: 'deathAnnuity', label: '年金 (月額, 万円)', min: 0, max: 20, step: 1 },
    ]},
    { category: '就業不能保障', iconClass: 'fas fa-user-injured', colorClass: 'border-purple-500', sliders: [
      { key: 'disabilityLumpsum', label: '一時金 (万円)', min: 0, max: 3000, step: 50 },
      { key: 'disabilityMonthly', label: '月額 (万円)', min: 0, max: 50, step: 1 },
    ]},
    { category: '医療保障', iconClass: 'fas fa-hospital', colorClass: 'border-red-500', sliders: [
      { key: 'medicalDaily', label: '入院日額 (円)', min: 0, max: 15000, step: 1000 },
      { key: 'medicalSurgery', label: '手術一時金 (万円)', min: 0, max: 50, step: 5 }, // このキーは現在App.jsの計算では使われていない可能性がある
    ]},
    { category: '重い病気保障', iconClass: 'fas fa-heartbeat', colorClass: 'border-orange-500', sliders: [
      { key: 'criticalCancer', label: 'がん一時金 (万円)', min: 0, max: 300, step: 50 },
      { key: 'criticalCirculatory', label: '循環器疾患等一時金 (万円)', min: 0, max: 300, step: 50 },
    ]},
    { category: '学資準備（貯蓄性）', iconClass: 'fas fa-piggy-bank', colorClass: 'border-green-500', sliders: [
      { key: 'savingsMonthly', label: '月額積立額 (円)', min: 0, max: 100000, step: 1000 },
    ]},
  ];