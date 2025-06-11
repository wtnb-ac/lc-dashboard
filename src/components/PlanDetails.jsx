import React, { useState, useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
// Font Awesome アイコンを使用する場合 (プロジェクト設定が必要)
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileInvoiceDollar, faShieldAlt, faUserShield, faHospital, faGraduationCap, faLightbulb, faChild, faBaby, faPiggyBank, faCross, faUserInjured, faStethoscope, faHeartPulse } from '@fortawesome/free-solid-svg-icons';

// ★ダミーの保険料計算関数（本来は useAiConcierge.js や calculationUtils.js のロジックを参照・移植する）
const getDummyPremiumApproximation = (value, type) => {
  if (type === 'deathLump') return Math.max(500, Math.round(value * 0.03 * 100));
  if (type === 'deathAnn') return Math.max(300, Math.round(value * 1.5 * 100));
  if (type === 'disLump') return Math.max(400, Math.round(value * 0.025 * 100));
  if (type === 'disMonth') return Math.max(250, Math.round(value * 2.0 * 100));
  if (type === 'medDaily') return Math.max(100, Math.round(value * 0.2));
  if (type === 'medSurgery') return Math.max(200, Math.round(value * 0.05 * 100));
  if (type === 'critCancer') return Math.max(300, Math.round(value * 0.04 * 100));
  if (type === 'critCirc') return Math.max(280, Math.round(value * 0.035 * 100));
  if (type === 'savings') return Math.max(0, Math.round(value * 0.95));
  return 0;
};

// Helper function to render clickable benefit items (Accordion Style)
const RenderBenefitCategory = ({ category, iconClass, items, onBenefitClick, planData, categoryType, currentPlanContext, currentPlanName }) => {
  const [isOpen, setIsOpen] = useState(true); // Default to OPEN again
  // const validItems = items.filter(item => item.value > 0 || item.key === 'comprehensiveMedical'); // Include comprehensiveMedical even if value is 0
  // 病気・ケガの保障カテゴリでは、itemsに直接渡されたもの(criticalIllnessItems)とplanData.medicalBenefitsIncludedから生成したものを結合する
  let combinedItems = items;
  if (category === '病気・ケガの保障' && planData && planData.medicalBenefitsIncluded) {
    const medicalItemsFromPlan = planData.medicalBenefitsIncluded.map(key => {
        // この部分は PlanDetails の medicalElements 生成ロジックを参考に、簡易的な item オブジェクトを生成
        // App.js から渡される planData (simulatedData) の構造に依存
        let label = '';
        let value = planData[key] || 0;
        let unit = '';
        let iconClassFromMap = '';
        // 簡易的なマッピング
        if (key === 'medicalDaily' || key === 'daily') { label = '入院日額'; unit = '円/日'; iconClassFromMap = 'fa-bed-pulse'; if (planData.medicalDaily) value = planData.medicalDaily; }
        else if (key === 'medicalLumpSum' || key === 'lumpSum') { label = '入院一時金'; unit = '万円'; iconClassFromMap = 'fa-suitcase-medical'; if(planData.medicalLumpSum) value=planData.medicalLumpSum; else value=0; }
        else if (key === 'treatment') { label = '入院治療費補填'; unit = ''; iconClassFromMap = 'fa-receipt'; value = planData.treatment || '実費補填';}
        else if (key === 'postDischarge') { label = '退院後通院補填'; unit = ''; iconClassFromMap = 'fa-person-walking-arrow-right'; value = planData.postDischarge || '実費補填'; }
        else if (key === 'advanced') { label = '先進医療保障'; unit = ''; iconClassFromMap = 'fa-star-of-life'; value = planData.advanced || 'あり'; }
        
        return { key: `medical_${key}`, label, value, unit, iconClassFromMap, isMedicalBenefit: true };
    }).filter(item => item.label); // ラベルが設定されたもののみ
    combinedItems = [...medicalItemsFromPlan, ...items.filter(i => i.key === 'criticalCancer' || i.key === 'criticalCirculatory')]; // items は criticalIllnessItems
  }
  const validItems = combinedItems.filter(item => (typeof item.value === 'number' && item.value > 0) || (typeof item.value === 'string' && item.value && item.value !== '0') || item.key === 'comprehensiveMedical');

  const contentRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef([]);
  const categoryIconRef = useRef(null); // カテゴリアイコンの参照
  const categoryPremiumRef = useRef(null); // カテゴリ保険料の参照

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (categoryIconRef.current) {
      gsap.to(categoryIconRef.current, {
        rotate: isOpen ? 0 : 10, // 開くときに少し回転戻す、閉じるときに少し回転
        scale: isOpen ? 1 : 1.1, // 開くときに通常サイズ、閉じるときに少し拡大
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.4, 
        ease: 'power3.inOut',
        onComplete: () => {
          // Scroll to top of content if it becomes too long, or other adjustments
        }
      });
    }
    if (isOpen && itemsRef.current.length > 0) {
      gsap.fromTo(itemsRef.current.filter(el => el), 
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.08, delay: 0.1, ease: 'power2.out' } 
      );
    }
  }, [isOpen]);

  const handleItemClick = (item, event) => {
    const cardElement = event.currentTarget;
    gsap.timeline()
      .to(cardElement, { scale: 1.05, y: -5, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)", duration: 0.15, ease: 'power2.out' })
      .to(cardElement, { scale: 1, y: 0, boxShadow: "0px 4px 6px rgba(0,0,0,0.05)", duration: 0.2, ease: 'bounce.out', onComplete: () => {
        if (onBenefitClick) {
          const currentCategoryName = category === '病気・ケガの保障' ? '医療・重い病気の保障' : category;
          onBenefitClick({ ...item, categoryNameForAi: currentCategoryName });
        }
      }});
  };

  const displayCategoryName = category === '病気・ケガの保障' ? '医療・重い病気の保障' : category;
  let displayIconClass = iconClass;

  let headerBaseClass = 'text-base font-semibold p-2.5 px-3 flex items-center justify-between cursor-pointer transition-all duration-300 ease-in-out rounded-t-lg group';
  let headerIconColor = 'text-gray-600';
  let chevronColor = 'text-gray-500';
  let valueColor = 'text-gray-800';
  let headerBgClass = 'bg-slate-100 hover:bg-slate-200 border-b border-slate-300';
  let headerTitleColor = 'text-slate-700';

  if (categoryType === 'protection') {
    displayIconClass = category === '病気・ケガの保障' ? 'fas fa-stethoscope' : iconClass;
    headerBgClass = isOpen
      ? 'bg-emerald-100 border-b border-emerald-300'
      : 'bg-emerald-50 hover:bg-emerald-100 border-b border-emerald-200';
    headerIconColor = 'text-emerald-600';
    chevronColor = isOpen ? 'text-emerald-500 group-hover:text-emerald-700' : 'text-emerald-400 group-hover:text-emerald-600';
    valueColor = 'text-emerald-700 font-semibold';
    headerTitleColor = 'text-emerald-800 font-medium';
  } else if (categoryType === 'savings') {
    displayIconClass = iconClass;
    headerBgClass = isOpen
      ? 'bg-amber-100 border-b border-amber-300'
      : 'bg-amber-50 hover:bg-amber-100 border-b border-amber-200';
    headerIconColor = 'text-amber-600';
    chevronColor = isOpen ? 'text-amber-500 group-hover:text-amber-700' : 'text-amber-400 group-hover:text-amber-600';
    valueColor = 'text-amber-700 font-semibold';
    headerTitleColor = 'text-amber-800 font-medium';
  }

  itemsRef.current = [];

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

  let categoryPremium = 0;
  if (planData) {
    if (category === '万一・就業不能の保障') {
      categoryPremium = 
        getDummyPremiumApproximation(planData.deathLumpsum || 0, 'deathLump') +
        getDummyPremiumApproximation(planData.deathAnnuity || 0, 'deathAnn') +
        getDummyPremiumApproximation(planData.disabilityLumpsum || 0, 'disLump') +
        getDummyPremiumApproximation(planData.disabilityMonthly || 0, 'disMonth');
    } else if (category === '病気・ケガの保障') {
      categoryPremium = 
        getDummyPremiumApproximation(planData.medicalDaily || 0, 'medDaily') +
        getDummyPremiumApproximation(planData.medicalSurgery || 0, 'medSurgery') +
        getDummyPremiumApproximation(planData.criticalCancer || 0, 'critCancer') +
        getDummyPremiumApproximation(planData.criticalCirculatory || 0, 'critCirc');
    } else if (category === '将来への準備（貯蓄）') {
      categoryPremium = getDummyPremiumApproximation(planData.savingsMonthly || 0, 'savings');
    }
  }

  // カテゴリ保険料のカウントアップアニメーション
  useEffect(() => {
    if (categoryPremiumRef.current && categoryPremium > 0) {
      const fromValue = parseFloat(categoryPremiumRef.current.textContent.replace(/[^0-9.-]+/g,'') || '0');
      const animObject = { value: fromValue };
      gsap.to(animObject, {
        value: categoryPremium,
        duration: 0.8, 
        ease: 'power2.out',
        onUpdate: () => {
          if (categoryPremiumRef.current) {
            categoryPremiumRef.current.textContent = Math.round(animObject.value).toLocaleString();
          }
        }
      });
    }
  }, [categoryPremium]);

  return (
    <div className="benefit-category bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-slate-300/60 transition-all duration-300 ease-out transform hover:-translate-y-px">
      <h3
        ref={headerRef}
        className={`text-base font-semibold p-2.5 px-3 flex items-center justify-between cursor-pointer transition-all duration-300 ease-in-out rounded-t-lg group ${headerBgClass} border-b-2`}
        onClick={handleToggle}
        title={`${displayCategoryName} の詳細を${isOpen ? '閉じる' : '開く'}`}
      >
        <span className="flex items-center">
          <i ref={categoryIconRef} className={`${displayIconClass} mr-2 w-4.5 text-center text-lg ${headerIconColor} transition-transform duration-300 ${isOpen ? 'group-hover:scale-105' : 'group-hover:scale-100'}`}></i>
          <span className={`${headerTitleColor} text-base font-bold`}>{displayCategoryName}</span>
        </span>
        <div className="flex items-center">
          {categoryPremium > 0 && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm mr-2 tabular-nums tracking-tight 
                            ${categoryType === 'protection' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                              categoryType === 'savings' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-700'}
                           `}>
              月払: <span ref={categoryPremiumRef}>{Math.round(categoryPremium).toLocaleString()}</span>円
            </span>
          )}
          <i className={`fas fa-chevron-down text-xs ${chevronColor} transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'} group-hover:scale-110`}></i>
        </div>
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
                    <div className="text-center py-2 px-1.5 flex flex-col items-center justify-center min-h-[80px]">
                        <img src="/pentan_confused.png" alt="保障なしペンタン" className="h-12 w-12 mb-2 opacity-70" />
                        <p className="text-[10px] text-gray-500 italic">このカテゴリの登録保障はありません。</p>
                    </div>
                );
            }
            return (
              <div className="grid grid-cols-1 gap-2">
                {validDeathItems.length > 0 && (
                  <div className="flex items-stretch rounded-md overflow-hidden shadow-sm border border-sky-200/70 hover:shadow-md transition-shadow duration-200 bg-sky-50/70">
                    <div className="w-8 bg-sky-100 text-sky-700 flex items-center justify-center">
                      <span className="vertical-rl transform rotate-90 text-[11px] font-semibold tracking-normal p-0.5 whitespace-nowrap">死亡保障</span>
                    </div>
                    <div className="flex-grow space-y-0.5 p-1 bg-sky-50/50 ">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {deathLump?.value > 0 && (
                          <div
                            key={deathLump.key}
                            className={`benefit-item-card flex flex-col items-start p-1 rounded border border-gray-100 cursor-pointer bg-white ${getItemHoverClass('death')}`}
                            onClick={(e) => handleItemClick(deathLump, e)}
                            title={`${deathLump.label} の詳細`}
                            ref={el => itemsRef.current.push(el)}
                          >
                            <span className="flex items-center text-gray-700 text-xs">
                              <i className={`fas fa-sack-dollar text-indigo-500 w-3.5 text-center mr-1.5 text-sm p-0.5 bg-indigo-50/70 rounded-sm`}></i>
                              <span className="font-medium">{deathLump.label}</span>
                            </span>
                            <span className={`font-semibold ${valueColor} text-sm ml-3`}>
                              {deathLump.value.toLocaleString()}{deathLump.unit}
                            </span>
                          </div>
                        )}
                        {deathAnn?.value > 0 && (
                          <div
                            key={deathAnn.key}
                            className={`benefit-item-card flex flex-col items-start p-1 rounded border border-gray-100 cursor-pointer bg-white ${getItemHoverClass('death')}`}
                            onClick={(e) => handleItemClick(deathAnn, e)}
                            title={`${deathAnn.label} の詳細`}
                            ref={el => itemsRef.current.push(el)}
                          >
                            <span className="flex items-center text-gray-700 text-xs">
                              <i className={`fas fa-hand-holding-dollar text-sky-500 w-3.5 text-center mr-1.5 text-sm p-0.5 bg-sky-50/70 rounded-sm`}></i>
                              <span className="font-medium">{deathAnn.label}</span>
                            </span>
                            <span className={`font-semibold ${valueColor} text-sm ml-3`}>
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
                  <div className="flex items-stretch rounded-md overflow-hidden shadow-sm border border-lime-200/70 hover:shadow-md transition-shadow duration-200 bg-lime-50/70">
                    <div className="w-8 bg-lime-100 text-lime-700 flex items-center justify-center">
                      <span className="transform rotate-90 text-[11px] font-semibold tracking-normal p-0.5 whitespace-nowrap">就業不能</span>
                    </div>
                    <div className="flex-grow space-y-0.5 p-1 bg-lime-50/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {disLump?.value > 0 && (
                          <div
                            key={disLump.key}
                            className={`benefit-item-card flex flex-col items-start p-1 rounded border border-gray-100 cursor-pointer bg-white ${getItemHoverClass('disability')}`}
                            onClick={(e) => handleItemClick(disLump, e)}
                            title={`${disLump.label} の詳細`}
                            ref={el => itemsRef.current.push(el)}
                          >
                            <span className="flex items-center text-gray-700 text-xs">
                              <i className={`fas fa-briefcase-medical text-orange-500 w-3.5 text-center mr-1.5 text-sm p-0.5 bg-orange-50/70 rounded-sm`}></i>
                              <span className="font-medium">{disLump.label}</span>
                            </span>
                            <span className={`font-semibold ${valueColor} text-sm ml-3`}>
                              {disLump.value.toLocaleString()}{disLump.unit}
                            </span>
                          </div>
                        )}
                        {disMonth?.value > 0 && (
                          <div
                            key={disMonth.key}
                            className={`benefit-item-card flex flex-col items-start p-1 rounded border border-gray-100 cursor-pointer bg-white ${getItemHoverClass('disability')}`}
                            onClick={(e) => handleItemClick(disMonth, e)}
                            title={`${disMonth.label} の詳細`}
                            ref={el => itemsRef.current.push(el)}
                          >
                            <span className="flex items-center text-gray-700 text-xs">
                              <i className={`fas fa-money-bill-wave text-rose-500 w-3.5 text-center mr-1.5 text-sm p-0.5 bg-rose-50/70 rounded-sm`}></i>
                              <span className="font-medium">{disMonth.label}</span>
                            </span>
                            <span className={`font-semibold ${valueColor} text-sm ml-3`}>
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
                        let value = planData?.[key] !== undefined ? planData[key] : config.getValue(planData || {});
                        if (key === 'lumpSum' && !planData?.medicalLumpSum) value = 10;

                        const unit = config.unit || '';
                        const displayValue = (typeof value === 'number' && value > 0) ? `${value.toLocaleString()}${unit}` : (value || '-');
                        const itemForClick = {
                            key: key,
                            label: config.label,
                            value: (typeof value === 'number' ? value : (key === 'lumpSum' ? 10 : undefined)),
                            unit: unit,
                            description: (typeof value !== 'number' ? value : undefined),
                            iconClassFromMap: config.icon,
                            displayValue: displayValue
                        };
                        medicalElements.push(
                            <div
                                key={key}
                                itemData={itemForClick} 
                            >
                            </div>
                        );
                    }
                });
                const validCriticalItems = items.filter(i => i?.value > 0);
                let criticalElementsData = []; 
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
                        <div className="text-center py-3 px-2 flex flex-col items-center justify-center min-h-[80px]">
                            <img src="/pentan_empty.png" alt="保障なしペンタン" className="h-12 w-12 mb-1.5 opacity-75" /> 
                            <p className="text-xs text-gray-500 italic">このカテゴリには現在ご加入の保障はありません。</p>
                        </div>
                    );
                }
                return (
                    <div className="grid grid-cols-1 gap-2">
                        {medicalElements.length > 0 && (
                          <div className="flex items-stretch rounded-md overflow-hidden shadow-sm border border-teal-200/70 hover:shadow-md transition-shadow duration-200 bg-teal-50/70">
                            <div className="w-8 bg-teal-100 text-teal-700 flex items-center justify-center">
                               <span className="writing-mode-vertical-rl transform rotate-90 text-[11px] font-semibold tracking-normal p-0.5 whitespace-nowrap">医療保障</span>
                            </div>
                            <div className="flex-grow space-y-0.5 p-1 bg-teal-50/50">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {medicalElements.map(elPlaceholder => { 
                                    const el = elPlaceholder.props.itemData; 
                                    return (
                                    <div key={el.key} 
                                         className={`min-w-0 benefit-item-card bg-white p-1.5 rounded border border-gray-100 cursor-pointer transform transition-all duration-200 flex flex-col items-start ${getItemHoverClass('medical')}`}
                                         onClick={(e) => handleItemClick(el, e)}
                                         title={`${el.label} の詳細を見る`}
                                         ref={itemEl => itemsRef.current.push(itemEl)}>
                                      <span className="flex items-center text-gray-700 text-xs">
                                        <i className={`fas ${el.iconClassFromMap || 'fa-shield-alt text-gray-400'} w-3.5 text-center mr-1.5 text-sm`}></i>
                                        <span className="font-medium">{el.label}:</span>
                                      </span>
                                      <span className={`font-medium ${valueColor} text-sm ml-3`}>
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
                           <div className="flex items-stretch mt-1.5 rounded-md overflow-hidden shadow-sm border border-orange-200/70 hover:shadow-md transition-shadow duration-200 bg-orange-50/70">
                            <div className="w-8 bg-orange-100 text-orange-700 flex items-center justify-center">
                               <span className="writing-mode-vertical-rl transform rotate-90 text-[11px] font-semibold tracking-normal p-0.5 whitespace-nowrap">重い病気</span>
                            </div>
                            <div className="flex-grow space-y-0.5 p-1 bg-orange-50/50">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {criticalElementsData.map(el => 
                                    <div key={el.key} 
                                         className={`min-w-0 benefit-item-card bg-white p-1.5 rounded border border-gray-100 cursor-pointer transform transition-all duration-200 flex flex-col items-start ${getItemHoverClass('critical')}`}
                                         onClick={(e) => handleItemClick(el, e)}
                                         title={`${el.label} の詳細を見る`}
                                         ref={itemEl => itemsRef.current.push(itemEl)}>
                                       <span className="flex items-center text-gray-700 text-xs">
                                        <i className={`fas ${el.iconClassCrit || 'fa-heart-pulse text-gray-400'} w-3.5 text-center mr-1.5 text-sm`}></i>
                                        <span className="font-medium">{el.label}:</span>
                                      </span>
                                      <span className={`font-medium ${valueColor} text-sm ml-3`}>
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
                <div className="space-y-2 bg-amber-50/70 rounded-md p-1.5 border border-amber-200/70 shadow-sm">
                    {validItems.map((item) => (
                        <div 
                            key={item.key} 
                            className={`benefit-item-card flex items-center justify-between p-2.5 rounded-lg shadow-md border border-gray-200 cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white ${getItemHoverClass('savings_item')}`}
                            onClick={(e) => handleItemClick(item, e)} 
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
                                <span className="text-xs text-gray-500 ml-1">(子1 15,000円 + 子2 20,000円)</span>
                                }
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-3 px-2 flex flex-col items-center justify-center min-h-[80px]">
                     <img src="/pentan_savings_empty.png" alt="積立なしペンタン" className="h-14 w-14 mb-1 opacity-80" />
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
  const planButtonsRef = useRef(null); // プランボタンのコンテナ参照

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

    // GSAPタイムラインを作成
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo(sectionEl, 
      { opacity: 0, y: 50, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.6, clearProps: "transform" } 
    );

    if (nameEl && displayPlanInfo.name && displayPlanInfo.name !== "プラン読込中...") {
      tl.fromTo(nameEl, 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 0.5, onStart: () => { if(nameEl) nameEl.textContent = displayPlanInfo.name; } }, 
        "-=0.3" // 前のアニメーションと少しオーバーラップ
      );
    } 
    // プランボタンのアニメーション
    if (planButtonsRef.current && planButtonsRef.current.children.length > 0) {
      tl.fromTo(Array.from(planButtonsRef.current.children).filter(el => el),
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.4 },
        "-=0.2"
      );
    }

    if (categoriesEl && categoriesEl.children.length > 0) {
      tl.fromTo(Array.from(categoriesEl.children).filter(el => el), 
          { opacity:0, y:30, scale: 0.98 }, 
          { opacity:1, y:0, scale: 1, stagger: 0.12, duration:0.5, ease: 'back.out(1.2)' }, 
          "-=0.2" 
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
    { label: '積立額', value: planData?.savingsMonthly || 0, unit: '円/月', key: 'savingsMonthly' },
  ];

  const tags = getBenefitTags(displayPlanInfo.benefitKeywords, userTags);

  const handleBenefitClick = useCallback((benefitInfo) => {
    if (onBenefitClick) {
      onBenefitClick(benefitInfo);
    }
  }, [onBenefitClick]);

  const handleLoadPlan = (planKey, event) => {
    const sectionEl = planDetailsSectionRef.current;
    const buttonEl = event?.currentTarget;

    const tl = gsap.timeline();
    if (buttonEl) {
      tl.to(buttonEl, { scale: 0.95, yoyo: true, repeat: 1, duration: 0.15, ease: 'power1.inOut' });
    }

    if (sectionEl) {
       tl.to(sectionEl, { 
         opacity: 0, y: -20, scale: 0.95, duration: 0.35, ease: 'power2.in',
         onStart: () => {},
         onComplete: () => {
           onLoadPlan(planKey);
         }
       }, buttonEl ? ">-0.1" : ">0"); // ボタンアニメーションがあれば少し遅らせる
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
      className="module flex flex-col bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 rounded-xl p-2 md:p-4 shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 ease-in-out opacity-0"
    >
      {/* Header Section for Plan Name and Buttons */}
      <div className="plan-header-block flex flex-col items-start">
        <div className="flex items-center justify-center w-full">
          
          <h2 ref={planNameRef} className="text-xl font-bold text-green-800 border-b-2 border-green-800 pb-1 mb-2 text-center flex-grow">
          <i className="fas fa-compass mr-3 text-emerald-600 text-xl"></i>
            {/* {displayPlanInfo.name} GSAPで設定されるため初期は空でも良い */}
          </h2>
        </div>
      </div>

      <div ref={planButtonsRef} className="plan-buttons w-full flex flex-wrap items-center justify-start gap-4 mb-2 ml-2">
        {[
          { key: 'recommended', label: '推奨' }, 
          { key: 'premier', label: 'プレミア' }, 
          { key: 'lifeProtectionFocus', label: '生活重視' }, 
          { key: 'medicalFocus', label: '医療重視' }
        ].map(plan => {
          const isActive = currentPlanContext === plan.key;
          const icon = planButtonIcons[plan.key] || 'fa-question-circle';
          let buttonClass = `flex items-center gap-1 py-1 px-2 text-xs font-semibold border rounded-lg transition-all duration-300 ease-in-out shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 `;
          if (isActive) {
            buttonClass += 'bg-gradient-to-br from-emerald-500 to-green-600 text-white border-emerald-700 ring-emerald-400 scale-105 shadow-xl';
          } else {
            buttonClass += 'bg-white text-gray-600 border-gray-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 focus:ring-emerald-400 hover:shadow-md';
          }
          // GSAP ホバーエフェクト用のイベントハンドラ
          const handleButtonHover = (e, isHovering) => {
            gsap.to(e.currentTarget, {
              y: isHovering ? -3 : 0,
              scale: isHovering ? 1.08 : (isActive ? 1.05 : 1),
              boxShadow: isHovering ? "0px 10px 20px rgba(0,0,0,0.1)" : "0px 5px 10px rgba(0,0,0,0.05)",
              duration: 0.2,
              ease: 'power2.out'
            });
          };

          return (
            <button 
              key={plan.key} 
              onClick={(e) => handleLoadPlan(plan.key, e)} 
              className={buttonClass}
              title={`${plan.label}プランの詳細を見る`}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              <i className={`fas ${icon} ${isActive ? 'text-yellow-300 animate-pulse_fast' : 'text-emerald-600 group-hover:text-emerald-500'} text-xs transition-colors duration-300`}></i>
              <span className="tracking-wide">{plan.label}</span>
            </button>
          );
        })}
      </div>

      <div className="plan-details-content flex-grow flex flex-col">
        <div ref={benefitCategoriesRef} id="benefit-details-area" className="benefit-details-by-category flex-grow space-y-4">
          <RenderBenefitCategory
            category="万一・就業不能の保障"
            iconClass="fas fa-umbrella"
            items={lifeProtectionItems}
            planData={planData}
            onBenefitClick={handleBenefitClick}
            categoryType="protection"
            currentPlanContext={currentPlanContext}
            currentPlanName={officialPlanData?.name || (currentPlanContext === 'custom' ? 'カスタムプラン' : (currentPlanContext === 'recommended' ? '推奨プラン' : 'プラン'))}
          />
          <RenderBenefitCategory
            category="病気・ケガの保障"
            iconClass="fas fa-briefcase-medical"
            items={criticalIllnessItems}
            planData={planData}
            onBenefitClick={handleBenefitClick}
            categoryType="protection"
            currentPlanContext={currentPlanContext}
            currentPlanName={officialPlanData?.name || (currentPlanContext === 'custom' ? 'カスタムプラン' : (currentPlanContext === 'recommended' ? '推奨プラン' : 'プラン'))}
          />
          <RenderBenefitCategory
            category="将来への準備（貯蓄）"
            iconClass="fas fa-piggy-bank"
            items={futureSavingsItems}
            planData={planData}
            onBenefitClick={handleBenefitClick}
            categoryType="savings"
            currentPlanContext={currentPlanContext}
            currentPlanName={officialPlanData?.name || (currentPlanContext === 'custom' ? 'カスタムプラン' : (currentPlanContext === 'recommended' ? '推奨プラン' : 'プラン'))}
          />
        </div>
      </div>
    </section>
  );
}

export default PlanDetails;

