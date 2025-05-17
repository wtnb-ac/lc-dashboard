import React, { useState, useCallback } from 'react';
// Font Awesome アイコンを使用する場合 (プロジェクト設定が必要)
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileInvoiceDollar, faShieldAlt, faUserShield, faHospital, faGraduationCap, faLightbulb, faChild, faBaby, faPiggyBank, faCross, faUserInjured, faStethoscope, faHeartPulse } from '@fortawesome/free-solid-svg-icons';

// Helper function to render clickable benefit items (Accordion Style)
const RenderBenefitCategory = ({ category, iconClass, items, onBenefitClick, planData }) => {
  const [isOpen, setIsOpen] = useState(true); // Default to OPEN again
  const validItems = items.filter(item => item.value > 0 || item.key === 'comprehensiveMedical'); // Include comprehensiveMedical even if value is 0

  const handleToggle = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    if (onBenefitClick) {
      // Ensure category name matches the updated name if needed elsewhere
      const currentCategoryName = category === '病気・ケガの保障' ? '医療・重い病気の保障' : category;
      onBenefitClick({ ...item, category: currentCategoryName });
    }
  };

  // Use updated category name for display
  const displayCategoryName = category === '病気・ケガの保障' ? '医療・重い病気の保障' : category;
  const displayIconClass = category === '病気・ケガの保障' ? 'fas fa-stethoscope' : iconClass; // Change icon for medical

  return (
    <div className="benefit-category border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white mb-3">
      <h3
        className={`product-category-title text-base font-semibold p-2.5 px-4 flex items-center justify-between cursor-pointer transition-colors duration-200 ${isOpen ? 'bg-green-100 text-green-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        onClick={handleToggle}
      >
        <span className="flex items-center">
          <i className={`${displayIconClass} mr-2 w-5 text-center text-lg ${isOpen ? 'text-green-700' : 'text-gray-500'}`}></i>
          {displayCategoryName}
        </span>
        <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-sm ${isOpen ? 'text-green-600' : 'text-gray-500'} transition-transform duration-200`}></i>
      </h3>
      {isOpen && (
        <div className="product-category-content p-3 space-y-1.5 text-sm">
          {/* --- Rendering for 万一・就業不能の保障 (2-column grid) --- */}
          {category === '万一・就業不能の保障' && (
            (() => {
              // Get individual benefit items
              const deathLump = items.find(i => i.key === 'deathLumpsum');
              const deathAnn = items.find(i => i.key === 'deathAnnuity');
              const disLump = items.find(i => i.key === 'disabilityLumpsum');
              const disMonth = items.find(i => i.key === 'disabilityMonthly');

              // Filter out items with zero value
              const validDeathItems = [deathLump, deathAnn].filter(i => i?.value > 0);
              const validDisabilityItems = [disLump, disMonth].filter(i => i?.value > 0);

              if (validDeathItems.length === 0 && validDisabilityItems.length === 0) {
                  return <p className="text-gray-500 italic px-1 py-1">該当する保障はありません。</p>;
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1"> {/* Use grid for 2 columns */}
                  {/* Left Column (Death) */}
                  <div className="space-y-1">
                    {validDeathItems.map(item => (
                      <div
                        key={item.key}
                        className="benefit-item flex items-center justify-between p-1 hover:bg-green-50 rounded cursor-pointer"
                        onClick={() => handleItemClick(item)}
                        title={`${item.label} の詳細を見る`}
                      >
                        <span className="flex items-center text-gray-800 text-xs">
                           <i className={`fas ${item.key === 'deathLumpsum' ? 'fa-house-damage text-gray-500' : 'fa-chart-line text-sky-500'} w-4 text-center mr-1.5`}></i>
                           {item.label}:
                        </span>
                        <span className="font-medium text-green-800 ml-2 text-right text-xs">
                          {item.value.toLocaleString()}{item.unit}
                        </span>
                      </div>
                    ))}
                    {validDeathItems.length === 0 && <div className="p-1 text-gray-400 italic text-xs">(死亡保障なし)</div>}
                  </div>
                  {/* Right Column (Disability) */}
                  <div className="space-y-1">
                    {validDisabilityItems.map(item => (
                       <div
                        key={item.key}
                        className="benefit-item flex items-center justify-between p-1 hover:bg-green-50 rounded cursor-pointer"
                        onClick={() => handleItemClick(item)}
                        title={`${item.label} の詳細を見る`}
                       >
                        <span className="flex items-center text-gray-800 text-xs">
                          <i className={`fas ${item.key === 'disabilityLumpsum' ? 'fa-hospital-user text-orange-500' : 'fa-hand-holding-medical text-rose-500'} w-4 text-center mr-1.5`}></i>
                          {item.label}:
                        </span>
                        <span className="font-medium text-green-800 ml-2 text-right text-xs">
                          {item.value.toLocaleString()}{item.unit}
                        </span>
                      </div>
                    ))}
                    {validDisabilityItems.length === 0 && <div className="p-1 text-gray-400 italic text-xs">(就業不能保障なし)</div>}
                  </div>
                </div>
              );
            })()
          )}
          {/* --- Rendering for 医療・重い病気の保障 (2-column grid) --- */}
          {category === '病気・ケガの保障' && (
              (() => {
                  // Medical Benefits (from previous logic)
                  const medicalBenefitMap = {
                      daily: { label: '入院日額', icon: 'fa-bed-pulse text-cyan-500', getValue: (d) => d.medicalDaily, unit: '円/日' },
                      lumpSum: { label: '入院一時金', icon: 'fa-suitcase-medical text-teal-500', getValue: () => 10, unit: '万円' },
                      treatment: { label: '入院治療費補填', icon: 'fa-receipt text-indigo-500', getValue: () => '実費補填', unit: '' },
                      postDischarge: { label: '退院後通院補填', icon: 'fa-person-walking-arrow-right text-purple-500', getValue: () => '実費補填', unit: '' },
                      advanced: { label: '先進医療保障', icon: 'fa-star-of-life text-amber-500', getValue: () => 'あり', unit: '' },
                  };
                  const includedMedicalKeys = planData?.medicalBenefitsIncluded || [];
                  let medicalElements = [];
                  Object.keys(medicalBenefitMap).forEach(key => {
                      if (includedMedicalKeys.includes(key)) {
                          const config = medicalBenefitMap[key];
                          const value = config.getValue(planData || {});
                          const unit = config.unit || '';
                          const displayValue = (typeof value === 'number' && value > 0) ? `${value.toLocaleString()}${unit}` : (value || '-');
                          const itemForClick = {
                              key: key,
                              label: config.label,
                              value: (typeof value === 'number' ? value : undefined),
                              unit: unit,
                              description: (typeof value !== 'number' ? value : undefined)
                          };
                          medicalElements.push(
                              <div key={key} className="benefit-item flex items-center justify-between p-1 hover:bg-green-50 rounded cursor-pointer" onClick={() => handleItemClick(itemForClick)} title={`${config.label} の詳細を見る`}>
                                  <span className="flex items-center text-gray-800 text-xs">
                                    <i className={`fas ${config.icon || 'fa-shield-alt text-gray-400'} w-4 text-center mr-1.5`}></i>{config.label}:
                                  </span>
                                  <span className="font-medium text-green-800 ml-2 text-right text-xs">
                                    {displayValue}
                                  </span>
                              </div>
                          );
                      }
                  });

                  // Critical Illness Benefits (items passed as prop)
                  const validCriticalItems = items.filter(i => i?.value > 0);
                  let criticalElements = [];
                  validCriticalItems.map(item => {
                      // Determine icon and color based on key
                      let iconClass = 'fa-heart-pulse text-gray-400'; // Default
                      if (item.key === 'criticalCancer') {
                          iconClass = 'fa-disease text-pink-600'; // Cancer icon and color
                      } else if (item.key === 'criticalCirculatory') {
                          iconClass = 'fa-brain text-violet-600'; // Circulatory icon (brain) and color
                      }
                      criticalElements.push(
                          <div key={item.key} className="benefit-item flex items-center justify-between p-1 hover:bg-green-50 rounded cursor-pointer" onClick={() => handleItemClick(item)} title={`${item.label} の詳細を見る`}>
                                <span className="flex items-center text-gray-800 text-xs">
                                  <i className={`fas ${iconClass} w-4 text-center mr-1.5`}></i>{/* Updated Icon & Color */}
                                  {item.label}:
                                </span>
                                <span className="font-medium text-green-800 ml-2 text-right text-xs">
                                  {item.value.toLocaleString()}{item.unit}
                                </span>
                          </div>
                      );
                  });

                  if (medicalElements.length === 0 && criticalElements.length === 0) {
                      return <p className="text-gray-500 italic px-1 py-1">該当する保障はありません。</p>;
                  }

                  return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1"> {/* Use grid for 2 columns */}
                          {/* Left Column (Medical Benefits) */}
                          <div className="space-y-1">
                              {medicalElements.length > 0 ? medicalElements : <div className="p-1 text-gray-400 italic text-xs">(医療保障なし)</div>}
                          </div>
                           {/* Right Column (Critical Illness) */}
                          <div className="space-y-1">
                              {criticalElements.length > 0 ? criticalElements : <div className="p-1 text-gray-400 italic text-xs">(重い病気保障なし)</div>}
                          </div>
                      </div>
                  );
              })()
          )}
          {/* --- Rendering for 将来への準備（貯蓄） (remains single column) --- */}
          {category === '将来への準備（貯蓄）' && (
              validItems.map((item) => (
                <div key={item.key} className="benefit-item flex items-center justify-between p-1 hover:bg-green-50 rounded cursor-pointer" onClick={() => handleItemClick(item)} title={`${item.label} の詳細を見る`}>
                    <span className="flex items-center">
                        <i className="fas fa-piggy-bank w-4 text-center mr-1.5 text-pink-400"></i><span className="text-gray-800">{item.label}:</span>
                    </span>
                    <span className="font-medium text-green-800 ml-2">
                        {item.value.toLocaleString()}{item.unit || ''}
                        {/* Hardcoded breakdown for specific value */}
                        {item.key === 'savingsMonthly' && item.value === 35000 &&
                          <span className="text-xs text-gray-500 ml-1.5">(子1 15,000円 + 子2 20,000円)</span>
                        }
                    </span>
                </div>
              ))
          )}
           {/* Add prompt to add coverage if needed, similar to CurrentContracts */}
           {/* <p className="text-sm text-blue-600 cursor-pointer hover:underline mt-2">+ このカテゴリの保障を追加する</p> */}
        </div>
      )}
    </div>
  );
};

// Helper function to generate benefit story (Removed from here)
/*
function getBenefitStory(planData, userTags = []) {
    // ... (implementation removed)
}
*/

// Helper function to generate benefit tags (Removed #学資・貯蓄)
function getBenefitTags(keywords = [], userTags = []) {
  let tags = [];
  if (keywords.includes("family_protection") || keywords.includes("income_protection") || keywords.includes("core_protection") || keywords.includes("focused_death_disability")) tags.push("#生活保障重視");
  if (keywords.includes("child_medical")) tags.push("#子供の安心");
  if (keywords.includes("cost_saving") || keywords.includes("cost_conscious")) tags.push("#保険料考慮");
  if (keywords.includes("strong_protection") || keywords.includes("premium_care")) tags.push("#手厚い保障");
  if (keywords.includes("strong_medical") || keywords.includes("focused_medical_critical")) tags.push("#医療充実");
  if (keywords.includes("strong_critical")) tags.push("#重病への備え");
  if (keywords.includes("custom_needs")) tags.push("#じぶん設計");
  if (keywords.includes("balanced_plan") || keywords.includes("best_style")) tags.push("#バランス重視");
  if (keywords.includes("basic_medical") || keywords.includes("basic_medical_critical")) tags.push("#基本医療");
  if (keywords.includes("basic_death_disability")) tags.push("#基本生活保障");
  userTags.forEach(tag => {
    // Only add user tags if they are NOT related to 学資/貯蓄 and not already included
    if (!tag.includes("学資") && !tag.includes("貯蓄") && (tag.includes("家族") || tag.includes("生活") || tag.includes("バランス")) && !tags.includes(tag) && tags.length < 3) tags.push(tag);
  });
  return [...new Set(tags)].slice(0, 3); // Ensure unique tags and limit to 3
}

// Helper function to assign CSS class to tags
function getTagClass(tag) {
  if (tag.includes("生活") || tag.includes("重視") || tag.includes("手厚い")) return "bg-orange-100 text-orange-800";
  if (tag.includes("学資") || tag.includes("安心") || tag.includes("医療")) return "bg-blue-100 text-blue-800";
  if (tag.includes("保険料") || tag.includes("じぶん設計") || tag.includes("基本") || tag.includes("バランス")) return "bg-green-100 text-green-800";
  return "bg-gray-200 text-gray-700";
}

// PlanDetails Component - Reworked Structure
function PlanDetails({
    planData,
    currentPlanContext,
    officialPlanData,
    userTags,
    onLoadPlan,
    onBenefitClick
}) {
  // --- Debugging Logs ---
  console.log("PlanDetails Props:", { planData, currentPlanContext, officialPlanData, userTags });

  // displayPlanInfo はプラン名や説明、キーワードを表示するために使用
  const displayPlanInfo = currentPlanContext === 'custom'
    ? { name: "カスタムプラン", description: "スライダーで調整された、あなただけのプランです。", benefitKeywords: ["custom_needs"] }
    : officialPlanData || { name: "プラン情報なし", description: "", benefitKeywords: [] };

  console.log("PlanDetails displayPlanInfo:", displayPlanInfo); // Log displayPlanInfo

  // --- Organize benefit items by customer-centric category (Updated structure) ---
  const lifeProtectionItems = [
    { label: '死亡一時金', value: planData?.deathLumpsum || 0, unit: '万円', key: 'deathLumpsum' },
    { label: '死亡年金', value: planData?.deathAnnuity || 0, unit: '万円/月', key: 'deathAnnuity' },
    { label: '就業不能一時金', value: planData?.disabilityLumpsum || 0, unit: '万円', key: 'disabilityLumpsum' },
    { label: '就業不能月額', value: planData?.disabilityMonthly || 0, unit: '万円/月', key: 'disabilityMonthly' },
  ];

  // healthProtectionItems is no longer needed as medical rendering is handled inside RenderBenefitCategory
  /*
  const healthProtectionItems = [
    { label: '総合医療保障', value: 1, unit: '', key: 'comprehensiveMedical', description: '実費補填型 あり' },
    { label: '入院日額', value: planData?.medicalDaily || 0, unit: '円/日', key: 'medicalDaily', icon: 'fa-bed-pulse' },
    { label: 'がん一時金', value: planData?.criticalCancer || 0, unit: '万円', key: 'criticalCancer', icon: 'fa-disease' },
    { label: '循環器等一時金', value: planData?.criticalCirculatory || 0, unit: '万円', key: 'criticalCirculatory', icon: 'fa-heart-pulse' },
  ];
  */
  // Critical illness items are still needed for their category
  const criticalIllnessItems = [
    { label: 'がん一時金', value: planData?.criticalCancer || 0, unit: '万円', key: 'criticalCancer', icon: 'fa-disease' },
    { label: '循環器等一時金', value: planData?.criticalCirculatory || 0, unit: '万円', key: 'criticalCirculatory', icon: 'fa-heart-pulse' },
  ];

  const futureSavingsItems = [
    { label: '月額積立額', value: planData?.savingsMonthly || 0, unit: '円/月', key: 'savingsMonthly' },
    // Add other savings/pension items if applicable
  ];

  // ストーリーとタグは displayPlanInfo を使用 (getBenefitStory call removed)
  // const story = getBenefitStory(displayPlanInfo, userTags); // Removed this line
  const tags = getBenefitTags(displayPlanInfo.benefitKeywords, userTags);

  // console.log("PlanDetails story:", story); // Removed this line

  const handleBenefitClick = useCallback((benefitInfo) => {
    if (onBenefitClick) {
      // Ensure category name is passed correctly
      // Note: Category mapping is handled inside RenderBenefitCategory now for Medical
      onBenefitClick(benefitInfo);
    }
  }, [onBenefitClick]);

  return (
    <section id="plan-details-section" className="module flex flex-col bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Header with Plan Buttons - Consistent Style */}
      <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-800 pb-2 mb-4 flex items-center justify-between gap-2 flex-wrap">
        <span className="flex items-center min-w-[100px]">
          <i className="fas fa-clipboard-list mr-2 text-green-600"></i>
          提案プラン
        </span>
        <div className="plan-buttons flex-shrink-0 inline-flex gap-1.5 flex-wrap justify-end">
          {['recommended', 'planA', 'planC_DeathFocus', 'planB_MedicalFocus'].map(planKey => {
            const labels = { recommended: '推奨', planA: '万全', planC_DeathFocus: '生活', planB_MedicalFocus: '医療' };
            const isActive = currentPlanContext === planKey;
            const buttonClass = `py-1 px-3 text-xs border rounded-full transition-all duration-200 shadow-sm ${isActive ? 'bg-green-700 text-white border-green-700 font-bold ring-2 ring-green-300 ring-offset-1' : 'border-gray-400 bg-white text-gray-600 hover:border-green-600 hover:bg-green-50 hover:text-green-800'}`;
            return ( <button key={planKey} onClick={() => onLoadPlan(planKey)} className={buttonClass}>{labels[planKey]}</button> );
          })}
        </div>
      </h2>

      {/* Plan Details Content Area */}
      <div className="plan-details-content flex-grow flex flex-col">

        {/* --- Plan Summary (Name, Tags ONLY) - REMOVED ENTIRELY --- */}
        {/*
        <div className="plan-summary mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
           <div className="flex items-baseline justify-between flex-wrap gap-x-2 gap-y-1">
             <h3 className="text-lg font-semibold text-yellow-900 flex items-center flex-shrink-0">
               <i className={`fas ${currentPlanContext === 'custom' ? 'fa-sliders-h' : 'fa-star'} mr-2 text-yellow-600`}></i>
               {displayPlanInfo.name}
              </h3>
              <div className="benefit-tags flex-shrink-0 flex flex-wrap gap-1">
                {tags.map(tag => (
                  <span key={tag} className={`tag inline-block py-0.5 px-2 rounded-full text-xs shadow-sm ${getTagClass(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>
           </div>
        </div>
        */}

        {/* --- Benefit Details by Customer Need Category (Accordion) --- */}
        <div id="benefit-details-area" className="benefit-details-by-category flex-grow">
          <RenderBenefitCategory
            category="万一・就業不能の保障"
            iconClass="fas fa-umbrella"
            items={lifeProtectionItems}
            planData={planData}
            onBenefitClick={handleBenefitClick}
          />
          <RenderBenefitCategory
            category="病気・ケガの保障"
            iconClass="fas fa-briefcase-medical"
            items={criticalIllnessItems}
            planData={planData}
            onBenefitClick={handleBenefitClick}
          />
          <RenderBenefitCategory
            category="将来への準備（貯蓄）"
            iconClass="fas fa-piggy-bank"
            items={futureSavingsItems}
            planData={planData}
            onBenefitClick={handleBenefitClick}
          />
        </div>

      </div>
    </section>
  );
}

export default PlanDetails;

