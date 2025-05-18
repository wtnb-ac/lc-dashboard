import React, { useState, useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
// Font Awesome アイコンを使用する場合 (プロジェクト設定が必要)
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileInvoiceDollar, faShieldAlt, faUserShield, faHospital, faGraduationCap, faLightbulb, faChild, faBaby, faPiggyBank, faCross, faUserInjured, faStethoscope, faHeartPulse } from '@fortawesome/free-solid-svg-icons';

// Helper function to render clickable benefit items (Accordion Style)
const RenderBenefitCategory = ({ category, iconClass, items, onBenefitClick, planData, categoryType }) => {
  const [isOpen, setIsOpen] = useState(true); // Default to OPEN again
  const validItems = items.filter(item => item.value > 0 || item.key === 'comprehensiveMedical'); // Include comprehensiveMedical even if value is 0
  const contentRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef([]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.4, // Slightly increased duration for smoother feel
        ease: 'power3.inOut', // Smoother easing
        onComplete: () => {
        }
      });
    }
    if (isOpen && itemsRef.current.length > 0) {
      gsap.fromTo(itemsRef.current.filter(el => el),
        { opacity: 0, y: 10, scale: 0.98 }, // Start slightly lower and smaller, reduce y from 15 to 10
        { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.07, delay: 0.05, ease: 'back.out(1.1)' } // reduce duration, stagger, delay and ease
      );
    }
  }, [isOpen]);

  const handleItemClick = (item) => {
    if (onBenefitClick) {
      const currentCategoryName = category === '病気・ケガの保障' ? '医療・重い病気の保障' : category;
      onBenefitClick({ ...item, category: currentCategoryName });
    }
  };

  const displayCategoryName = category === '病気・ケガの保障' ? '医療・重い病気の保障' : category;
  let displayIconClass = iconClass;

  // Compact header style
  let headerBaseClass = 'text-xs font-semibold p-2 px-3 flex items-center justify-between cursor-pointer transition-all duration-300 ease-in-out rounded-t-lg group'; // Reduced padding & font size
  let headerIconColor = 'text-gray-600';
  let chevronColor = 'text-gray-500';
  let valueColor = 'text-gray-800'; // This will be overridden for protection/savings
  let headerBgClass = 'bg-slate-100 hover:bg-slate-200 border-b border-slate-300'; // Default simple BG
  let headerTitleColor = 'text-slate-700';

  // Define base hover classes for items, to be specialized later
  // let itemHoverBgBase = 'hover:bg-opacity-20'; // Base for colored hover

  if (categoryType === 'protection') {
    displayIconClass = category === '病気・ケガの保障' ? 'fas fa-stethoscope' : iconClass;
    headerBgClass = isOpen
      ? 'bg-emerald-100 border-b border-emerald-300'
      : 'bg-emerald-50 hover:bg-emerald-100 border-b border-emerald-200';
    headerIconColor = 'text-emerald-600';
    chevronColor = isOpen ? 'text-emerald-500 group-hover:text-emerald-700' : 'text-emerald-400 group-hover:text-emerald-600';
    valueColor = 'text-emerald-700 font-semibold';
    headerTitleColor = 'text-emerald-800 font-medium';
    // itemHoverBgBase = 'hover:bg-sky-100'; // Will be specialized
  } else if (categoryType === 'savings') {
    displayIconClass = iconClass;
    headerBgClass = isOpen
      ? 'bg-amber-100 border-b border-amber-300'
      : 'bg-amber-50 hover:bg-amber-100 border-b border-amber-200';
    headerIconColor = 'text-amber-600';
    chevronColor = isOpen ? 'text-amber-500 group-hover:text-amber-700' : 'text-amber-400 group-hover:text-amber-600';
    valueColor = 'text-amber-700 font-semibold';
    headerTitleColor = 'text-amber-800 font-medium';
    // itemHoverBgBase = 'hover:bg-amber-100'; // Will be specialized
  }

  itemsRef.current = [];

  // Function to get specific hover class based on sub-category/item type
  const getItemHoverClass = (subCategoryType) => {
    switch (subCategoryType) {
      case 'death': return `hover:bg-sky-50 hover:border-sky-300`;
      case 'disability': return `hover:bg-lime-50 hover:border-lime-300`;
      case 'medical': return `hover:bg-teal-50 hover:border-teal-300`;
      case 'critical': return `hover:bg-orange-50 hover:border-orange-300`;
      case 'savings_item': return `hover:bg-amber-50 hover:border-amber-300`;
      default: return `hover:bg-gray-50 hover:border-gray-300`;
    }
  };


  return (
    <div className="benefit-category bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-slate-300/60 transition-all duration-300 ease-out transform hover:-translate-y-px">
      <h3
        ref={headerRef}
        className={`text-lg font-semibold p-3 px-4 flex items-center justify-between cursor-pointer transition-all duration-300 ease-in-out rounded-t-lg group ${headerBgClass} border-b-2`}
        onClick={handleToggle}
        title={`${displayCategoryName} の詳細を${isOpen ? '閉じる' : '開く'}`}
      >
        <span className="flex items-center">
          <i className={`${displayIconClass} mr-2.5 w-5 text-center text-xl ${headerIconColor} transition-transform duration-300 ${isOpen ? 'group-hover:scale-105' : 'group-hover:scale-100'}`}></i>
          <span className={`${headerTitleColor} text-lg font-bold`}>{displayCategoryName}</span>
        </span>
        <i className={`fas fa-chevron-down text-sm ${chevronColor} transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'} group-hover:scale-110`}></i>
      </h3>
      <div ref={contentRef} className="product-category-content p-2.5 space-y-2 text-xs overflow-hidden bg-slate-50/20 border-t border-gray-200" style={{ height: isOpen ? 'auto' : '0px', opacity: isOpen ? 1: 0}}>
        {(categoryType === 'protection' && category === '万一・就業不能の保障') && (
          (() => {
            const deathLump = items.find(i => i.key === 'deathLumpsum');
            const deathAnn = items.find(i => i.key === 'deathAnnuity');
            const disLump = items.find(i => i.key === 'disabilityLumpsum');
            const disMonth = items.find(i => i.key === 'disabilityMonthly');
            const validDeathItems = [deathLump, deathAnn].filter(i => i?.value > 0);
            const validDisabilityItems = [disLump, disMonth].filter(i => i?.value > 0);
            if (validDeathItems.length === 0 && validDisabilityItems.length === 0) {
                return (
                    <div className="text-center py-2 px-1.5">
                        <i className="fas fa-empty-set text-2xl text-gray-400 mb-1"></i>
                        <p className="text-[10px] text-gray-500 italic">このカテゴリの登録保障はありません。</p>
                    </div>
                );
            }
            return (
              <div className="grid grid-cols-1 gap-2">
                {validDeathItems.length > 0 && (
                  <div className="flex items-stretch rounded-md overflow-hidden shadow-sm border border-sky-200/70 hover:shadow-md transition-shadow duration-200">
                    <div className="w-8 bg-sky-100 text-sky-700 flex items-center justify-center">
                      <span className="vertical-rl transform rotate-90 text-[10px] font-semibold tracking-normal p-0.5 whitespace-nowrap">死亡保障</span>
                    </div>
                    <div className="flex-grow space-y-0.5 p-1 bg-sky-50/50 ">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {deathLump?.value > 0 && (
                          <div
                            key={deathLump.key}
                            className={`benefit-item-card flex flex-col items-start p-1.5 rounded border border-gray-100 cursor-pointer bg-white ${getItemHoverClass('death')}`}
                            onClick={() => handleItemClick(deathLump)}
                            title={`${deathLump.label} の詳細`}
                            ref={el => itemsRef.current.push(el)}
                          >
                            <span className="flex items-center text-gray-700 text-xs">
                              <i className={`fas fa-sack-dollar text-indigo-500 w-3.5 text-center mr-1.5 text-sm p-0.5 bg-indigo-50/70 rounded-sm`}></i>
                              <span className="font-medium">{deathLump.label}</span>
                            </span>
                            <span className={`font-semibold ${valueColor} text-base ml-4`}>
                              {deathLump.value.toLocaleString()}{deathLump.unit}
                            </span>
                          </div>
                        )}
                        {deathAnn?.value > 0 && (
                          <div
                            key={deathAnn.key}
                            className={`benefit-item-card flex flex-col items-start p-1.5 rounded border border-gray-100 cursor-pointer bg-white ${getItemHoverClass('death')}`}
                            onClick={() => handleItemClick(deathAnn)}
                            title={`${deathAnn.label} の詳細`}
                            ref={el => itemsRef.current.push(el)}
                          >
                            <span className="flex items-center text-gray-700 text-xs">
                              <i className={`fas fa-hand-holding-dollar text-sky-500 w-3.5 text-center mr-1.5 text-sm p-0.5 bg-sky-50/70 rounded-sm`}></i>
                              <span className="font-medium">{deathAnn.label}</span>
                            </span>
                            <span className={`font-semibold ${valueColor} text-base ml-4`}>
                              {deathAnn.value.toLocaleString()}{deathAnn.unit}
                            </span>
                          </div>
                        )}
                      </div>
                      {validDeathItems.length === 0 &&  <div className="text-[10px] text-gray-400 italic px-1 py-0 text-center"><i className="fas fa-minus-circle mr-1 text-gray-300"></i>該当なし</div>}
                    </div>
                  </div>
                )}

                {validDisabilityItems.length > 0 && (
                  <div className="flex items-stretch rounded-md overflow-hidden shadow-sm border border-lime-200/70 hover:shadow-md transition-shadow duration-200">
                    <div className="w-8 bg-lime-100 text-lime-700 flex items-center justify-center">
                      <span className="transform rotate-90 text-[10px] font-semibold tracking-normal p-0.5 whitespace-nowrap">就業不能</span>
                    </div>
                    <div className="flex-grow space-y-0.5 p-1 bg-lime-50/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {disLump?.value > 0 && (
                          <div
                            key={disLump.key}
                            className={`benefit-item-card flex flex-col items-start p-1.5 rounded border border-gray-100 cursor-pointer bg-white ${getItemHoverClass('disability')}`}
                            onClick={() => handleItemClick(disLump)}
                            title={`${disLump.label} の詳細`}
                            ref={el => itemsRef.current.push(el)}
                          >
                            <span className="flex items-center text-gray-700 text-xs">
                              <i className={`fas fa-briefcase-medical text-orange-500 w-3.5 text-center mr-1.5 text-sm p-0.5 bg-orange-50/70 rounded-sm`}></i>
                              <span className="font-medium">{disLump.label}</span>
                            </span>
                            <span className={`font-semibold ${valueColor} text-base ml-4`}>
                              {disLump.value.toLocaleString()}{disLump.unit}
                            </span>
                          </div>
                        )}
                        {disMonth?.value > 0 && (
                          <div
                            key={disMonth.key}
                            className={`benefit-item-card flex flex-col items-start p-1.5 rounded border border-gray-100 cursor-pointer bg-white ${getItemHoverClass('disability')}`}
                            onClick={() => handleItemClick(disMonth)}
                            title={`${disMonth.label} の詳細`}
                            ref={el => itemsRef.current.push(el)}
                          >
                            <span className="flex items-center text-gray-700 text-xs">
                              <i className={`fas fa-money-bill-wave text-rose-500 w-3.5 text-center mr-1.5 text-sm p-0.5 bg-rose-50/70 rounded-sm`}></i>
                              <span className="font-medium">{disMonth.label}</span>
                            </span>
                            <span className={`font-semibold ${valueColor} text-base ml-4`}>
                              {disMonth.value.toLocaleString()}{disMonth.unit}
                            </span>
                          </div>
                        )}
                      </div>
                      {validDisabilityItems.length === 0 && <div className="text-[10px] text-gray-400 italic px-1 py-0 text-center"><i className="fas fa-minus-circle mr-1 text-gray-300"></i>該当なし</div>}
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}
        {(categoryType === 'protection' && category === '病気・ケガの保障') && (
            (() => {
                const medicalBenefitMap = {
                    daily: { label: '入院日額', icon: 'fa-bed-pulse text-cyan-500', getValue: (d) => d.medicalDaily, unit: '円/日' },
                    lumpSum: { label: '入院一時金', icon: 'fa-suitcase-medical text-teal-500', getValue: () => 10, unit: '万円' }, // Example, ensure value is passed
                    treatment: { label: '入院治療費補填', icon: 'fa-receipt text-indigo-500', getValue: () => '実費補填', unit: '' },
                    postDischarge: { label: '退院後通院補填', icon: 'fa-person-walking-arrow-right text-purple-500', getValue: () => '実費補填', unit: '' },
                    advanced: { label: '先進医療保障', icon: 'fa-star-of-life text-amber-500', getValue: () => 'あり', unit: '' },
                };
                const includedMedicalKeys = planData?.medicalBenefitsIncluded || [];
                let medicalElements = [];
                Object.keys(medicalBenefitMap).forEach(key => {
                    if (includedMedicalKeys.includes(key)) {
                        const config = medicalBenefitMap[key];
                        // Try to get value from planData if key exists, otherwise use getValue
                        let value = planData?.[key] !== undefined ? planData[key] : config.getValue(planData || {});
                        if (key === 'lumpSum' && !planData?.medicalLumpSum) value = 10; // Keep example if not in data

                        const unit = config.unit || '';
                        const displayValue = (typeof value === 'number' && value > 0) ? `${value.toLocaleString()}${unit}` : (value || '-');
                        const itemForClick = {
                            key: key,
                            label: config.label,
                            value: (typeof value === 'number' ? value : (key === 'lumpSum' ? 10 : undefined)), // ensure lumpSum has a value for click if not in data
                            unit: unit,
                            description: (typeof value !== 'number' ? value : undefined),
                            iconClassFromMap: config.icon,
                            displayValue: displayValue
                        };
                        medicalElements.push(
                            <div
                                key={key}
                                itemData={itemForClick} // Store itemData here
                                // className={`benefit-item flex items-center justify-between p-2 rounded-md ${itemHoverBgClass} shadow-sm border border-gray-100 cursor-pointer transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-white`}
                                // onClick={() => handleItemClick(itemForClick)}
                                // title={`${config.label} の詳細を見る`}
                                // ref={el => itemsRef.current.push(el)}
                            >
                                {/* Content will be mapped later into cards */}
                            </div>
                        );
                    }
                });
                const validCriticalItems = items.filter(i => i?.value > 0);
                let criticalElementsData = []; // Store data for critical elements
                validCriticalItems.forEach(item => {
                    let iconClassCrit = 'fa-heart-pulse text-gray-400';
                    if (item.key === 'criticalCancer') iconClassCrit = 'fa-disease text-pink-600';
                    else if (item.key === 'criticalCirculatory') iconClassCrit = 'fa-brain text-violet-600';
                    
                    criticalElementsData.push({
                        ...item,
                        iconClassCrit: iconClassCrit
                    });
                });

                if (medicalElements.length === 0 && criticalElementsData.length === 0) {
                    return (
                        <div className="text-center py-3 px-2">
                            <i className="fas fa-empty-set text-3xl text-gray-400 mb-1.5"></i>
                            <p className="text-xs text-gray-500 italic">このカテゴリには現在ご加入の保障はありません。</p>
                        </div>
                    );
                }
                return (
                    <div className="grid grid-cols-1 gap-2">
                        {medicalElements.length > 0 && (
                          <div className="flex items-stretch rounded-md overflow-hidden shadow-sm border border-teal-200/70 hover:shadow-md transition-shadow duration-200">
                            <div className="w-8 bg-teal-100 text-teal-700 flex items-center justify-center">
                               <span className="writing-mode-vertical-rl transform rotate-90 text-[10px] font-semibold tracking-normal p-0.5 whitespace-nowrap">医療保障</span>
                            </div>
                            <div className="flex-grow space-y-0.5 p-1 bg-teal-50/50">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {medicalElements.map(elPlaceholder => { // elPlaceholder contains itemData
                                    const el = elPlaceholder.props.itemData; // Access itemData
                                    return (
                                    <div key={el.key} 
                                         className={`min-w-0 benefit-item-card bg-white p-1.5 rounded border border-gray-100 cursor-pointer transform transition-all duration-200 flex flex-col items-start ${getItemHoverClass('medical')}`}
                                         onClick={() => handleItemClick(el)}
                                         title={`${el.label} の詳細を見る`}
                                         ref={itemEl => itemsRef.current.push(itemEl)}>
                                      <span className="flex items-center text-gray-700 text-xs">
                                        <i className={`fas ${el.iconClassFromMap || 'fa-shield-alt text-gray-400'} w-3.5 text-center mr-1.5 text-sm`}></i>
                                        <span className="font-medium">{el.label}:</span>
                                      </span>
                                      <span className={`font-medium ${valueColor} ml-4 text-base`}>
                                        {el.displayValue}
                                      </span>
                                    </div>
                                    );
                                  })}
                                </div>
                                {medicalElements.length === 0 && <div className="text-[10px] text-gray-400 italic px-1 py-0 text-center"><i className="fas fa-minus-circle mr-1 text-gray-300"></i>該当なし</div>}
                            </div>
                          </div>
                        )}
                        {criticalElementsData.length > 0 && (
                           <div className="flex items-stretch mt-1.5 rounded-md overflow-hidden shadow-sm border border-orange-200/70 hover:shadow-md transition-shadow duration-200">
                            <div className="w-8 bg-orange-100 text-orange-700 flex items-center justify-center">
                               <span className="writing-mode-vertical-rl transform rotate-90 text-[10px] font-semibold tracking-normal p-0.5 whitespace-nowrap">重い病気</span>
                            </div>
                            <div className="flex-grow space-y-0.5 p-1 bg-orange-50/50">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {criticalElementsData.map(el => // el is already item data
                                    <div key={el.key} 
                                         className={`min-w-0 benefit-item-card bg-white p-1.5 rounded border border-gray-100 cursor-pointer transform transition-all duration-200 flex flex-col items-start ${getItemHoverClass('critical')}`}
                                         onClick={() => handleItemClick(el)}
                                         title={`${el.label} の詳細を見る`}
                                         ref={itemEl => itemsRef.current.push(itemEl)}>
                                       <span className="flex items-center text-gray-700 text-xs">
                                        <i className={`fas ${el.iconClassCrit || 'fa-heart-pulse text-gray-400'} w-3.5 text-center mr-1.5 text-sm`}></i>
                                        <span className="font-medium">{el.label}:</span>
                                      </span>
                                      <span className={`font-medium ${valueColor} ml-4 text-base`}>
                                        {el.value.toLocaleString()}{el.unit}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {criticalElementsData.length === 0 && <div className="text-[10px] text-gray-400 italic px-1 py-0 text-center"><i className="fas fa-minus-circle mr-1 text-gray-300"></i>該当なし</div>}
                            </div>
                          </div>
                        )}
                    </div>
                );
            })()
        )}
        {(categoryType === 'savings' && category === '将来への準備（貯蓄）') && (
            validItems.length > 0 ? (
                <div className="space-y-2">
                    {validItems.map((item) => (
                        <div 
                            key={item.key} 
                            className={`benefit-item-card flex items-center justify-between p-2.5 rounded-lg shadow-md border border-gray-200 cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white ${getItemHoverClass('savings_item')}`}
                            onClick={() => handleItemClick(item)} 
                            title={`${item.label} の詳細・関連情報を見る`} 
                            ref={el => itemsRef.current.push(el)}
                        >
                            <span className="flex items-center text-gray-700 text-sm">
                                <i className="fas fa-coins w-6 text-center mr-2.5 text-lg text-amber-500 p-1 bg-amber-50 rounded-md"></i>
                                <span className="font-medium">{item.label}:</span>
                            </span>
                            <span className={`font-bold ${valueColor} ml-2 text-base`}>
                                {item.value.toLocaleString()}{item.unit || ''}
                                {item.key === 'savingsMonthly' && item.value === 35000 &&
                                <span className="text-xs text-gray-500 ml-1.5">(子1 15,000円 + 子2 20,000円)</span>
                                }
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-3 px-2">
                    <i className="fas fa-empty-set text-3xl text-gray-400 mb-1.5"></i>
                    <p className="text-xs text-gray-500 italic">このカテゴリには現在ご加入の保障はありません。</p>
                </div>
            )
        )}
      </div>
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
    if (!tag.includes("学資") && !tag.includes("貯蓄") && (tag.includes("家族") || tag.includes("生活") || tag.includes("バランス")) && !tags.includes(tag) && tags.length < 3) tags.push(tag);
  });
  return [...new Set(tags)].slice(0, 3);
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
  const planDetailsSectionRef = useRef(null);
  const planNameRef = useRef(null);
  const benefitCategoriesRef = useRef(null);

  const displayPlanInfo = currentPlanContext === 'custom'
    ? { name: "カスタムプラン", description: "スライダーで調整された、あなただけのプランです。", benefitKeywords: ["custom_needs"] }
    : officialPlanData || { name: "プラン読込中...", description: "情報を取得しています。", benefitKeywords: [] };

  useEffect(() => {
    const sectionEl = planDetailsSectionRef.current;
    const nameEl = planNameRef.current;
    const categoriesEl = benefitCategoriesRef.current;

    if (!sectionEl) {
        return;
    }
    
    if (!planData || Object.keys(planData).length === 0) {
        gsap.set(sectionEl, { opacity: 0 });
        return; 
    }

    // Entrance animation for the entire section
    // Ensure initial state is set for fromTo if not already handled by opacity-0 className
    gsap.set(sectionEl, { opacity: 0, y: 50, scale: 0.95 }); 
    gsap.to(sectionEl, // Changed from fromTo to just to, as initial state is set above
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        ease: 'power3.out', 
        clearProps: "transform", // Only clear transform, let GSAP handle opacity until next animation or manual set
        onStart: () => {},
        onComplete: () => {
            gsap.set(sectionEl, { opacity: 1 }); // Force opacity to 1
        }
      }
    );

    // Plan name animation (runs after section entrance)
    if (nameEl && displayPlanInfo.name && displayPlanInfo.name !== "プラン読込中...") {
      gsap.fromTo(nameEl, 
        { opacity: 0, x: -20, y: 0 }, // Initial state: invisible and slightly to the left
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6, 
          ease: 'power2.out',
          delay: 0.4, // Delay to start after section entrance animation has progressed
          onStart: () => { if(nameEl) nameEl.textContent = displayPlanInfo.name; }
        }
      );
    } 

    // Benefit categories animation (staggered, runs after section entrance)
    if (categoriesEl && categoriesEl.children.length > 0) {
      gsap.fromTo(Array.from(categoriesEl.children).filter(el => el), 
          { opacity:0, y:30, scale: 0.98 }, // Start items from lower, slightly smaller
          { 
            opacity:1, 
            y:0, 
            scale: 1,
            stagger: 0.15, // Slightly increased stagger for more distinct appearance
            duration:0.6, 
            delay: 0.5, // Delay to start after section entrance
            ease: 'back.out(1.4)', // More dynamic pop-out effect
          }
      );
    } 

  }, [planData, currentPlanContext, displayPlanInfo.name]); 

  const lifeProtectionItems = [
    { label: '死亡一時金', value: planData?.deathLumpsum || 0, unit: '万円', key: 'deathLumpsum' },
    { label: '死亡年金', value: planData?.deathAnnuity || 0, unit: '万円/月', key: 'deathAnnuity' },
    { label: '就業不能一時金', value: planData?.disabilityLumpsum || 0, unit: '万円', key: 'disabilityLumpsum' },
    { label: '就業不能月額', value: planData?.disabilityMonthly || 0, unit: '万円/月', key: 'disabilityMonthly' },
  ];

  const criticalIllnessItems = [
    { label: 'がん一時金', value: planData?.criticalCancer || 0, unit: '万円', key: 'criticalCancer', icon: 'fa-disease' },
    { label: '循環器等一時金', value: planData?.criticalCirculatory || 0, unit: '万円', key: 'criticalCirculatory', icon: 'fa-heart-pulse' },
  ];

  const futureSavingsItems = [
    { label: '月額積立', value: planData?.savingsMonthly || 0, unit: '円/月', key: 'savingsMonthly' },
  ];

  const tags = getBenefitTags(displayPlanInfo.benefitKeywords, userTags);

  const handleBenefitClick = useCallback((benefitInfo) => {
    if (onBenefitClick) {
      onBenefitClick(benefitInfo);
    }
  }, [onBenefitClick]);

  const handleLoadPlan = (planKey) => {
    const sectionEl = planDetailsSectionRef.current;
    if (sectionEl) {
       gsap.to(sectionEl, { 
         opacity: 0, y: -20, scale: 0.95, duration: 0.35, ease: 'power2.in',
         onStart: () => {},
         onComplete: () => {
           onLoadPlan(planKey);
         }
       });
    } else {
        onLoadPlan(planKey);
    }
  };
  
  // Conditional rendering based on planData availability
  if (!planData || Object.keys(planData).length === 0 && currentPlanContext !== 'custom') {
    return (
      <section ref={planDetailsSectionRef} id="plan-details-section" className="module flex flex-col bg-white border border-gray-200 rounded-lg p-4 shadow-md opacity-0" aria-hidden="true">
        <p className="text-center text-gray-500">プラン情報を読み込んでいます...</p>
      </section>
    );
  }

  const planButtonIcons = {
    recommended: 'fa-star',
    premier: 'fa-crown',
    lifeProtectionFocus: 'fa-shield-heart', // Font Awesome 6 Heart Shield
    medicalFocus: 'fa-briefcase-medical'
  };

  return (
    <section 
      ref={planDetailsSectionRef} 
      id="plan-details-section" 
      className="module flex flex-col bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 rounded-xl p-5 md:p-6 shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 ease-in-out opacity-0"
    >
      {/* Header Section for Plan Name and Buttons */}
      <div className="plan-header-block flex flex-col items-start mb-5 pb-4 border-b-2 border-emerald-600"> 
        <div className="flex items-baseline mb-3.5"> 
          <i className="fas fa-clipboard-check mr-3 text-4xl text-emerald-500"></i> {/* Icon changed & size increased */}
          <h2 ref={planNameRef} className="text-3xl font-extrabold text-emerald-700 m-0 tracking-tight">
            {displayPlanInfo.name}
          </h2>
        </div>
        <div className="plan-buttons w-full flex flex-wrap items-center justify-start gap-2.5">
          {[
            { key: 'recommended', label: '推奨' }, 
            { key: 'premier', label: 'プレミア' }, 
            { key: 'lifeProtectionFocus', label: '生活重視' }, 
            { key: 'medicalFocus', label: '医療重視' }
          ].map(plan => {
            const isActive = currentPlanContext === plan.key;
            const icon = planButtonIcons[plan.key] || 'fa-question-circle';
            let buttonClass = `flex items-center gap-1 py-2 px-2 text-xs sm:text-sm font-semibold border rounded-lg transition-all duration-300 ease-in-out shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 `;
            if (isActive) {
              buttonClass += 'bg-gradient-to-br from-emerald-500 to-green-600 text-white border-emerald-700 ring-emerald-400 scale-105 shadow-xl';
            } else {
              buttonClass += 'bg-white text-gray-600 border-gray-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 focus:ring-emerald-400 hover:shadow-md';
            }
            return (
              <button 
                key={plan.key} 
                onClick={() => handleLoadPlan(plan.key)} 
                className={buttonClass}
                title={`${plan.label}プランの詳細を見る`}
              >
                <i className={`fas ${icon} ${isActive ? 'text-yellow-300 animate-pulse_fast' : 'text-emerald-600 group-hover:text-emerald-500'} text-sm sm:text-base transition-colors duration-300`}></i> 
                <span className="tracking-wide">{plan.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="plan-details-content flex-grow flex flex-col">
        <div ref={benefitCategoriesRef} id="benefit-details-area" className="benefit-details-by-category flex-grow space-y-4"> {/* Added space-y-4 for spacing */}
          <RenderBenefitCategory
            category="万一・就業不能の保障"
            iconClass="fas fa-umbrella"
            items={lifeProtectionItems}
            planData={planData}
            onBenefitClick={handleBenefitClick}
            categoryType="protection"
          />
          <RenderBenefitCategory
            category="病気・ケガの保障"
            iconClass="fas fa-briefcase-medical"
            items={criticalIllnessItems}
            planData={planData}
            onBenefitClick={handleBenefitClick}
            categoryType="protection"
          />
          <RenderBenefitCategory
            category="将来への準備（貯蓄）"
            iconClass="fas fa-piggy-bank"
            items={futureSavingsItems}
            planData={planData}
            onBenefitClick={handleBenefitClick}
            categoryType="savings"
          />
        </div>
      </div>
    </section>
  );
}

export default PlanDetails;

