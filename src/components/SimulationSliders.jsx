import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSlidersH, faUserShield, faUserInjured, faHospital, faHeartbeat, faPiggyBank } from '@fortawesome/free-solid-svg-icons';

// Slider configuration data
// スライダー設定データ
const sliderConfigs = [
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
    { key: 'medicalSurgery', label: '手術一時金 (万円)', min: 0, max: 50, step: 5 },
  ]},
  { category: '重い病気保障', iconClass: 'fas fa-heartbeat', colorClass: 'border-orange-500', sliders: [
    { key: 'criticalCancer', label: 'がん一時金 (万円)', min: 0, max: 300, step: 50 },
    { key: 'criticalCirculatory', label: '循環器疾患等一時金 (万円)', min: 0, max: 300, step: 50 },
  ]},
  { category: '学資準備（貯蓄性）', iconClass: 'fas fa-piggy-bank', colorClass: 'border-green-500', sliders: [
    { key: 'savingsMonthly', label: '月額積立額 (円)', min: 0, max: 100000, step: 1000 },
  ]},
];

// Single Slider Component
// 個々のスライダーコンポーネント
function SliderInput({ config, value, onChange }) {
  const handleChange = (event) => {
    onChange(config.key, Number(event.target.value));
  };

  return (
    <div className="slider-group mb-3">
      <label htmlFor={`${config.key}-slider`} className="block mb-1 text-sm text-gray-600">
        {config.label}: <span id={`${config.key}-value`} className="font-bold text-indigo-700">{Number(value).toLocaleString()}</span>
      </label>
      <input
        type="range"
        id={`${config.key}-slider`}
        name={config.key}
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={handleChange} // Use onChange for React controlled component
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" // Tailwind styling for range input
      />
    </div>
  );
}

// SimulationSliders Component: Renders all simulation sliders grouped by category
// SimulationSliders コンポーネント: カテゴリ別にグループ化されたすべてのシミュレーションスライダーを描画します
function SimulationSliders({ simulatedData, onSliderChange }) {
  return (
    <section className="simulation-controls module bg-white border border-gray-200 rounded-md p-4 shadow-sm">
      <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-800 pb-1 mb-3 flex items-center">
        {/* <FontAwesomeIcon icon={faSlidersH} className="mr-2" /> */}
        <i className="fas fa-sliders-h mr-2"></i> {/* 代替 */}
        保障シミュレーション
      </h2>
      <p className="simulation-note text-xs text-gray-500 mb-4 mt-[-5px]">
        スライダーで希望の保障内容を調整してください。
      </p>
      <div className="simulation-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        {sliderConfigs.map((category) => (
          <div key={category.category} className={`simulation-category border-l-4 ${category.colorClass} pl-3`}>
            <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
              {/* <FontAwesomeIcon icon={category.icon} className="mr-1.5 text-gray-600" /> */}
              <i className={`${category.iconClass} mr-1.5 text-gray-600`}></i> {/* 代替 */}
              {category.category}
            </h3>
            {category.sliders.map((sliderConfig) => (
              <SliderInput
                key={sliderConfig.key}
                config={sliderConfig}
                value={simulatedData[sliderConfig.key] || 0} // Get value from simulatedData prop
                onChange={onSliderChange} // Pass the handler function down
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default SimulationSliders;
