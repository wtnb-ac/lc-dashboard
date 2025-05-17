import React from 'react';
// Font Awesome アイコンを使用する場合 (プロジェクト設定が必要)
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBuilding, faUniversity, faFileContract } from '@fortawesome/free-solid-svg-icons';

// Helper function to get icon class based on label
const getIconForLabel = (label) => {
  if (label.includes('死亡')) return 'fas fa-umbrella text-gray-500';
  if (label.includes('就業不能')) return 'fas fa-user-injured text-red-500';
  if (label.includes('入院') || label.includes('医療')) return 'fas fa-hospital text-blue-500';
  if (label.includes('手術')) return 'fas fa-stethoscope text-blue-500';
  if (label.includes('がん') || label.includes('重病') || label.includes('循環器')) return 'fas fa-heartbeat text-pink-500';
  if (label.includes('積立') || label.includes('貯蓄')) return 'fas fa-piggy-bank text-yellow-600';
  return 'fas fa-file-contract text-gray-400'; // Default icon
};

// 値が正の場合にリスト項目をレンダリングするヘルパー関数 (アイコン付き)
const renderListItem = (item, onConditionWarningClick) => {
  const { key, label, value, unit = '', condition = '', tag = '' } = item;
  const iconClass = getIconForLabel(label);
  return (
    <li key={key} className="flex items-center justify-between mb-1.5 pl-1 hover:bg-gray-50 rounded transition-colors duration-150 py-0.5 px-1">
      <div className="flex items-center">
        <i className={`${iconClass} w-5 text-center mr-2 text-sm opacity-80`}></i>
        <span className="text-sm">
          {tag && <span className={`text-xs text-gray-500 mr-1.5`}>{tag}</span>}
          <strong>{label}：</strong>
          {condition && (
            <span className="text-xs text-red-600 ml-1">
              要確認
              {condition === '(入院5日以上)' && (
                <i
                  className="fas fa-exclamation-triangle text-yellow-500 ml-1.5 cursor-pointer hover:text-yellow-600 transition-colors"
                  onClick={(e) => {
                     e.stopPropagation(); // Prevent triggering li click if any
                     onConditionWarningClick && onConditionWarningClick({ label, condition });
                  }}
                  title="この条件に関する注意点を見る"
                ></i>
              )}
            </span>
          )}
        </span>
      </div>
      <span className="text-sm font-medium text-gray-700 ml-2 whitespace-nowrap">
        {value.toLocaleString()}{unit}
      </span>
    </li>
  );
};

// 「契約なし」または「登録促進」の項目をレンダリングするヘルパー関数
const renderEmptyItem = (text, iconClass = 'fas fa-plus-circle text-green-500', onClick) => (
  <li
    className={`flex items-center text-sm text-gray-500 italic mb-1.5 pl-1 cursor-pointer hover:bg-green-50 rounded transition-colors duration-150 py-0.5 px-1 ${onClick ? '' : 'opacity-60'}`}
    onClick={onClick}
    title={onClick ? '詳細を登録する' : ''}
  >
    <i className={`${iconClass} w-5 text-center mr-2 text-sm opacity-80`}></i>
    {text}
  </li>
);

// CurrentContracts コンポーネント: 現在の保険契約（自社および他社）を表示
function CurrentContracts({
  currentCoverageSelf,
  currentCoverageOther,
  onRegisterContract,
  onContractClick,
  onConditionWarningClick
}) {
  const self = currentCoverageSelf || {};
  const other = currentCoverageOther || {};
  const selfPremium = self.premium || 0;
  const otherPremium = other.premium || 0;
  const totalPremium = selfPremium + otherPremium;

  // Define coverage items with unique keys
  const selfCoverageItems = [
    { key: 'self-deathLumpsum', label: '死亡保険', value: self.deathLumpsum || 0, unit: '万円(一時金)' },
    { key: 'self-deathAnnuity', label: '死亡年金', value: self.deathAnnuity || 0, unit: '万円/月' },
    { key: 'self-disabilityLumpsum', label: '就業不能一時金', value: self.disabilityLumpsum || 0, unit: '万円' },
    { key: 'self-disabilityMonthly', label: '就業不能月額', value: self.disabilityMonthly || 0, unit: '万円/月' },
    { key: 'self-medicalDaily', label: '入院日額', value: self.medicalDaily || 0, unit: '円' },
    { key: 'self-medicalSurgery', label: '手術一時金', value: self.medicalSurgery || 0, unit: '万円' },
    { key: 'self-criticalCancer', label: 'がん一時金', value: self.criticalCancer || 0, unit: '万円' }, // Combined 'がん' and '循環器' for simplicity here
    { key: 'self-savingsMonthly', label: 'じぶんの積立', value: self.savingsMonthly || 0, unit: '円/月' },
  ];

  const otherCoverageItems = [
    { key: 'other-deathLumpsum', label: '死亡一時金', value: other.deathLumpsum || 0, unit: '万円', tag: 'A社' },
    { key: 'other-criticalCancer', label: 'がん一時金', value: other.criticalCancer || 0, unit: '万円', tag: 'B社' },
    { key: 'other-medicalDaily', label: '入院日額', value: other.medicalDaily || 0, unit: '円', condition: '(入院5日以上)', tag: 'B社' },
    // Add placeholders for potentially unlisted items
    { key: 'other-disabilityMonthly', label: '他社の就業不能', value: other.disabilityMonthly || 0, unit: '万円/月' },
    { key: 'other-savingsMonthly', label: '他社の積立', value: other.savingsMonthly || 0, unit: '円/月' },

  ];

  // Filter and map items, handling empty cases
  const selfItemsElements = selfCoverageItems
    .filter(item => item.value > 0)
    .map(item => renderListItem(item, onConditionWarningClick));
  if (selfItemsElements.length === 0) {
    selfItemsElements.push(renderEmptyItem('登録されている契約はありません', 'fas fa-folder-open text-gray-400'));
  }

  const otherItemsElements = otherCoverageItems
    .filter(item => item.value > 0)
    .map(item => renderListItem(item, onConditionWarningClick));
  // Add clickable prompts for missing items
  if (!otherCoverageItems.some(item => item.key === 'other-deathLumpsum' && item.value > 0)) {
      otherItemsElements.push(renderEmptyItem('死亡保障を登録しませんか？', 'fas fa-plus-circle text-green-500', onRegisterContract));
  }
  if (otherItemsElements.length === 0) { // Fallback if still empty
    otherItemsElements.push(renderEmptyItem('他社の契約を登録しませんか？', 'fas fa-plus-circle text-green-500', onRegisterContract));
  }

  // 契約セクションクリック時の処理
  const handleSectionClick = (type) => {
    if (onContractClick) {
      onContractClick(type); // 'self' または 'other' を渡す
    }
  };

  return (
    <section className="current-status flex flex-col flex-grow bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* --- Component Title --- */}
      <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-800 pb-2 mb-4 flex items-center justify-between gap-2">
        <span className="flex items-center">
          <i className="fas fa-file-signature mr-2 text-green-600"></i>
          現在の加入状況
        </span>
        {/* Register button removed from here, integrated into 'Other Companies' section */}
      </h2>

      <div id="current-contracts-list" className="flex-grow text-sm space-y-4">
        {/* --- Meiji Yasuda Contracts --- */}
        <div className="contract-section border border-green-200 rounded-lg overflow-hidden shadow-sm bg-green-50/50">
          <h4
            className="text-base font-semibold text-green-900 bg-green-100 p-2 px-3 flex items-center justify-between border-b border-green-200"
            title="明治安田でのご契約"
          >
            <span className="flex items-center">
              <i className="fas fa-house-user mr-2 text-green-700"></i> {/* House icon */}
              明治安田生命
            </span>
            {selfPremium > 0 && (
              <span className="text-xs font-normal text-green-800 bg-white/70 px-2 py-0.5 rounded-full shadow-sm">
                月払: {selfPremium.toLocaleString()}円
              </span>
            )}
          </h4>
          <ul className="list-none p-3 m-0 text-sm space-y-1">
            {selfItemsElements}
          </ul>
        </div>

        {/* --- Other Companies Contracts --- */}
        <div className="contract-section border border-blue-200 rounded-lg overflow-hidden shadow-sm bg-blue-50/50">
          <h4
            className="text-base font-semibold text-blue-900 bg-blue-100 p-2 px-3 flex items-center justify-between border-b border-blue-200"
            title="他社でのご契約"
          >
             <span className="flex items-center">
               <i className="fas fa-building mr-2 text-blue-700"></i> {/* Building icon */}
               他社
            </span>
            {otherPremium > 0 && (
              <span className="text-xs font-normal text-blue-800 bg-white/70 px-2 py-0.5 rounded-full shadow-sm">
                月払: {otherPremium.toLocaleString()}円
              </span>
            )}
          </h4>
          <ul className="list-none p-3 m-0 text-sm space-y-1">
            {otherItemsElements}
            {/* Moved Register button here as a primary action for this section */}
            <li className="mt-3 pt-3 border-t border-blue-200">
                <button
                    id="register-existing-contract"
                    onClick={onRegisterContract}
                    className="w-full register-button text-sm py-1.5 px-4 border border-yellow-600 bg-yellow-50 hover:bg-yellow-500 text-yellow-700 hover:text-white rounded-lg transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2"
                >
                   <i className="fas fa-edit"></i> 他社の契約を追加/編集
                </button>
            </li>
          </ul>
        </div>
      </div>

      {/* --- Total Premium --- */}
      <div id="current-total-premium-display" className="mt-5 pt-3 border-t-2 border-dashed border-gray-300 text-right">
        <span className="text-sm text-gray-600 mr-2">合計保険料:</span>
        <span className="text-xl font-bold text-green-800">{totalPremium.toLocaleString()}</span>
        <span className="text-sm font-medium text-gray-700 ml-1">円/月</span>
      </div>
    </section>
  );
}

export default CurrentContracts;

