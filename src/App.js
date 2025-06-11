import React, { useState, useCallback, useEffect, useMemo } from 'react';
import './App.css'; // App.cssをインポート

// Import components
// 作成したコンポーネントをインポート
import CustomerHeader from './components/CustomerHeader.jsx';
import CurrentContracts from './components/CurrentContracts.jsx';
import CoverageRadarChart from './components/CoverageRadarChart.jsx';
import PlanDetails from './components/PlanDetails.jsx';
import SimulationSliders from './components/SimulationSliders.jsx';
import Timeline from './components/Timeline.jsx';
import AiConcierge from './components/AiConcierge.jsx';

// Import Font Awesome CSS if not globally included (optional)
// Font Awesome CSS をグローバルに含まれていない場合にインポート（オプション）
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import constants
import { initialCustomerData } from './constants/customerData.js';
// Import other constants
import { timelineEvents } from './constants/timelineEvents.js';
import { profileEditorHtml } from './constants/aiContent.js'; // Remove notification related imports here

// Import utils
/*
import {
  calculateQuantitativeValue,
  calculateMedicalCoverageScore,
  calculateRadarDataPoint,
  combineCurrentCoverage,
  calculateTotalCoverageValue,
  calculateSimulatedPremium,
  calculateCoverageInfo
} from './utils/calculationUtils';
*/

// --- Import Custom Hooks ---
import { useAiConcierge } from './hooks/useAiConcierge.js';
import { useNotifications } from './hooks/useNotifications.js';
import { usePlanSimulation } from './hooks/usePlanSimulation.js'; // Import the new hook
import { useRadarChartData } from './hooks/useRadarChartData.js'; // Import the new hook

// --- Helper function to generate benefit story (Moved from PlanDetails.jsx) ---
/*
function getBenefitStory(planData, userTags = []) {
    const safePlanData = planData || {};
    let mainPoints = [];
    const keywords = safePlanData.benefitKeywords || [];

    const simDeathTotal = (safePlanData.deathLumpsum || 0) + (safePlanData.deathAnnuity || 0) * 12 * 25;
    const simDisabilityTotal = (safePlanData.disabilityLumpsum || 0) + (safePlanData.disabilityMonthly || 0) * 12 * 25;
    const hasMedical = (safePlanData.medicalDaily || 0) > 0 || (safePlanData.medicalSurgery || 0) > 0 || (safePlanData.criticalCancer || 0) > 0 || (safePlanData.criticalCirculatory || 0) > 0; // Adjusted condition
    const simSavings = safePlanData.savingsMonthly || 0;

    if (simDeathTotal > 0 || simDisabilityTotal > 0) mainPoints.push("万一・就業不能");
    if (hasMedical) mainPoints.push("医療・重い病気"); // Updated category name
    if (simSavings > 0) {
        if (userTags.includes("#学資準備重視") || keywords.includes("education_fund")) {
            mainPoints.push("お子様の学資");
        } else {
            mainPoints.push("将来への貯蓄");
        }
    }

    let specificDescription = '';
    if (safePlanData.description && safePlanData.name !== "カスタムプラン") {
        specificDescription = safePlanData.description;
    } else if (safePlanData.name === "カスタムプラン") {
         specificDescription = "スライダーで調整された、あなただけのプランです。";
    } else if (mainPoints.length > 0) {
        specificDescription = `${mainPoints.join('、')}に備えるプランです。`;
    } else {
        return "プランを選択するか、スライダーで保障を調整してください。";
    }

    let keywordInsight = '';
    if (safePlanData.name !== "カスタムプラン") {
        if (keywords.includes("premium_care")) keywordInsight = "";
        else if (keywords.includes("cost_conscious") && keywords.includes("focused_medical_critical")) keywordInsight = "";
        else if (keywords.includes("cost_conscious") && keywords.includes("focused_death_disability")) keywordInsight = "";
        else if (keywords.includes("balanced_plan")) keywordInsight = "";
    }

    return `${specificDescription}${keywordInsight ? `<br><span class="text-xs text-gray-600">${keywordInsight}</span>` : ''}`;
}
*/

// --- Main App Component ---
// メインのAppコンポーネント
function App() {
  // State Management
  // const [customerData] = useState(initialCustomerData); // Remove this line
  const [activeTimelineEventId, setActiveTimelineEventId] = useState(null);

  // --- Initialize Custom Hooks ---
  const {
    isAiConciergeOpen,
    aiMessage,
    toggleAiConcierge: originalToggleAiConcierge, // Rename original toggle
    handleCloseAiConcierge,
    updateAiMessage,
    showOtherContractGuide,    // useAiConcierge から取得
    showCoverageDetailGuide, // useAiConcierge から取得
    showRichBenefitDetailGuide // ★ 新しいハンドラをインポート
  } = useAiConcierge();

  const {
    notificationCount,
    handleShowNotifications,
    showNotificationListHandler, 
  } = useNotifications(updateAiMessage, initialCustomerData.profile);

  // generateAndSetAiMessage の定義を usePlanSimulation より前に移動
  const generateAndSetAiMessage = useCallback((context, data = null) => {
    let output = '';
    const userName = initialCustomerData.profile.name;
    // currentPlanContext はこのスコープでは直接利用できないため、
    // data から取得するか、plan_select や slider_adjust の場合は data が planKey や indicatorName を持つことを期待
    let planKey = null;
    let planName = 'プラン';
    let description = '';
    const planDescriptions = {
      recommended: 'バランスよくカバーし、既契約を考慮して必要保障額を満たすように調整。保険料を抑えつつ、医療と重い病気は基本的な保障（入院日額、重病一時金100万円など）を確保したプランです。',
      premier: '必要となる保障を高水準で備え、万全を期すプランです。がんや循環器疾患への備えも手厚く、入院一時金も付いているため短期的な費用にも安心です。',
      lifeProtectionFocus: '保険料を抑えつつ、万一・就業不能時の家族の生活費を重視。死亡・就業不能保障は維持し、医療と重い病気の保障を基本的な内容に絞ったプランです。',
      medicalFocus: '保険料を抑えつつ、医療や重い病気への備えを重視。基本的な医療保障は維持し、死亡・就業不能保障額を調整したプランです。',
      custom: 'これはスライダーで調整されたあなただけのカスタムプランです。保障内容をご確認ください。'
    };
    let planDataKey = null;

    if (context === 'plan_select') {
        planKey = typeof data === 'string' ? data : null;
    } else if (context === 'slider_adjust') {
        planKey = 'custom'; // スライダー調整時はカスタムプラン扱い
    } else if (context === 'init') {
        planKey = 'recommended'; // 初期表示は推奨プラン
    }
    // 他の context の場合は planKey が直接必要ないか、data 経由で処理

    if (planKey) {
        switch (planKey) {
            case 'recommended': planDataKey = 'recommendedPlanData'; break;
            case 'premier': planDataKey = 'planAData'; break;
            case 'medicalFocus': planDataKey = 'planB_MedicalFocusData'; break;
            case 'lifeProtectionFocus': planDataKey = 'planC_DeathFocusData'; break;
            case 'custom': planDataKey = null; break; // カスタムプランは initialCustomerData に直接的なデータなし
            default: planDataKey = null;
        }
        const planInfo = planKey === 'custom' ? { name: "カスタムプラン" } : initialCustomerData[planDataKey];
        planName = planInfo?.name || 'プラン';
        description = planDescriptions[planKey] || planDescriptions.custom;
    }


    const indicatorName = (context === 'slider_adjust' && typeof data === 'object' && data !== null) ? data.name : '項目';


    switch (context) {
      case 'init':
        const initialPlanName = initialCustomerData.recommendedPlanData?.name || '推奨プラン';
        const initialDescription = planDescriptions['recommended'];
        output = `<div class="flex items-start gap-2.5 mb-2">
                    <img src="/pentan.png" alt="ペンタン" class="pentan-avatar h-10 w-10 rounded-full border-2 border-white shadow-md" />
                    <div>
                      <p class="font-semibold text-sky-700">${userName}さん、こんにちは！</p>
                      <p class="text-xs text-gray-600 leading-tight mt-0.5">現在のプランは「<strong>${initialPlanName}</strong>」だよ。</p>
                    </div>
                  </div>`;
        output += `<div class="story-quote text-xs mt-2 p-3 bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-sky-400 rounded-r-lg shadow-sm">
                     <h5 class="font-semibold text-sky-800 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5 text-yellow-400"></i>このプランの特徴</h5>
                     <p class="text-gray-700 leading-relaxed">${initialDescription}</p>
                   </div>`;
        output += `<p class="text-xs text-gray-600 mt-3 text-center">右側の詳細やスライダーで、もっと自分にピッタリのプランに調整してみてね！<i class="fas fa-sliders-h ml-1.5 text-sky-500"></i></p>`;
        break;
      case 'plan_select':
          const selectedPlanData = planDataKey ? initialCustomerData[planDataKey] : {};
          const protectionPremium = selectedPlanData.protectionPremium || 0;
          const savingsPremium = selectedPlanData.savingsPremium || 0;
          const totalPremium = selectedPlanData.totalPremium || (protectionPremium + savingsPremium);
          output = `<div class="flex items-start gap-2.5 mb-3">
                      <img src="/pentan.png" alt="ペンタン" class="pentan-avatar h-12 w-12 rounded-full border-2 border-white shadow-lg" />
                      <div>
                        <p class="font-bold text-lg text-sky-700">ジャーン！<i class="fas fa-wand-magic-sparkles ml-1.5 text-yellow-400"></i></p>
                        <p class="text-sm text-gray-700 leading-tight mt-0.5">「<strong>${planName}</strong>」の準備ができたよ！</p>
                      </div>
                    </div>`;
          output += `<div class="ai-card bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-3.5 rounded-xl shadow-md border border-sky-200">
                       <div class="flex items-center gap-2 mb-2.5 pb-2 border-b border-sky-200">
                         <i class="fas fa-file-invoice-dollar text-2xl text-sky-600"></i>
                         <div>
                            <h5 class="font-extrabold text-sky-800 text-md">${planName}</h5>
                            <p class="text-xs text-sky-600 font-medium">${selectedPlanData.benefitKeywords && selectedPlanData.benefitKeywords.length > 0 ? selectedPlanData.benefitKeywords.slice(0,2).map(k => '#${k}').join(' ') : 'あなたに合わせたプラン'}</p>
                         </div>
                       </div>
                       <div class="text-xs text-gray-700 space-y-1.5 mb-3 px-1 leading-relaxed">
                         ${description.split('。').map(sentence => sentence.trim() && `<p class="flex items-start"><i class="fas fa-check-double mr-2 mt-1 text-sky-500"></i><span>${sentence}。</span></p>`).join('')}
                       </div>
                       <div class="premium-breakdown bg-white/70 p-2.5 rounded-lg shadow-inner border border-sky-100">
                         <h6 class="text-xs font-semibold text-sky-700 mb-1.5 flex items-center"><i class="fas fa-wallet mr-1.5 text-sky-500"></i>毎月の保険料（目安）</h6>
                         <p class="text-center text-sm mb-1">
                           <span class="font-bold text-sky-800 text-lg">${totalPremium.toLocaleString()}</span> 円
                         </p>
                         <div class="text-xs flex justify-around text-center">
                           <div>
                             <span class="text-gray-500 block">保障</span>
                             <strong class="text-blue-600">${protectionPremium.toLocaleString()} 円</strong>
                           </div>
                           <div>
                             <span class="text-gray-500 block">貯蓄</span>
                             <strong class="text-amber-600">${savingsPremium.toLocaleString()} 円</strong>
                           </div>
                         </div>
                       </div>
                     </div>`;
          output += `<p class="text-sm text-gray-700 mt-4 text-center px-2">じっくり確認して、不明な点は何でも聞いてね！ <i class="far fa-comment-dots ml-1.5 text-sky-500"></i></p>`;
        break;
      case 'slider_adjust':
          const customDescription = planDescriptions['custom'];
          output = `<div class="flex items-start gap-2.5 mb-1">
                      <img src="/pentan.png" alt="ペンタン" class="pentan-avatar h-8 w-8 rounded-full border-2 border-white shadow-sm" />
                      <p class="text-sm font-medium text-sky-700">「${indicatorName}」を調整中だね！<i class="fas fa-pencil-alt ml-1.5 text-amber-500"></i></p>
                    </div>`;
          output += `<div class="story-quote text-xs mt-1.5 p-2.5 bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-sky-300 rounded-r-md shadow-sm">
                       <p class="text-gray-700 leading-relaxed">${customDescription}</p>
                     </div>`;
          output += `<p class="text-xs text-gray-600 mt-2 text-center">全体のバランスを見ながら、ピッタリを目指そう！<i class="fas fa-palette ml-1 text-purple-500"></i></p>`;
          break;
      case 'timeline_event':
        const eventData = timelineEvents[data];
        output = `<p>タイムライン「${eventData?.title || 'イベント'}」<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1"></p>${eventData?.details ? `<div class="ai-timeline-details text-xs mt-1">${eventData.details}</div>` : '<p class="text-xs mt-1">詳細を確認します。</p>'}`;
        break;
      case 'axis_info':
          const axisName = data?.name || 'グラフ軸';
          output = `<p><strong>${axisName}</strong> についてですね！<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1">📊</p><p class="text-xs mt-1">${data?.tooltipText || 'この項目は、必要保障額や推奨される質に対する充足度を示しています。'}</p>`;
          break;
      case 'benefit_details': 
          const benefitName = data?.label || '保障';
          const benefitDesc = data?.description || '保障内容の詳細を表示します。';
          output = `<p><strong>${benefitName}</strong> の詳細情報ですね！<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1">🔍</p>`;
          if(data?.value !== undefined && data?.unit !== undefined) {
              const displayVal = typeof data.value === 'number' ? data.value.toLocaleString() : data.value;
              output += `<p class="text-xs mt-1">現在のプランでの設定値: <strong>${displayVal}${data.unit || ''}</strong></p>`;
          }
          output += `<p class="text-xs mt-1">${benefitDesc}</p>`;
          break;
      case 'condition_info_short_stay':
          output = `<p>「5日免責」ですね！<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1">⚠️</p><p class="text-xs mt-1">これは入院開始から5日間は給付対象外となる条件です。近年は入院日数が短くなる傾向があるのでご注意ください。</p>`;
          break;
      default: output = `<p>何かお手伝いできることはありますか？<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1"></p>`;
    }
    // updateAiMessage(output); // 元の呼び出し箇所
    // 修正: プラン選択・スライダー調整時で、かつAIコンシェルジュが閉じていなければメッセージ更新を抑制
    if ((context === 'plan_select' || context === 'slider_adjust') && !isAiConciergeOpen) {
      // 何もしない
    } else {
      updateAiMessage(output);
    }
  }, [updateAiMessage, isAiConciergeOpen]); // 依存配列から currentPlanContext を削除し、isAiConciergeOpen を追加

  const {
    simulatedData,
    currentPlanContext, // ここで currentPlanContext を取得
    loadPlan,
    handleSliderChange
  } = usePlanSimulation(
    initialCustomerData.initialSimulationData,
    initialCustomerData,
    generateAndSetAiMessage // ここで渡す
  );

  const radarData = useRadarChartData(simulatedData, currentPlanContext, initialCustomerData);
  const {
      indicatorsConfig,
      requiredRadarData,
      currentRadarData,
      simulatedRadarData,
      combinedCurrentCoverage,
      premiumBreakdownText,
      mainGapText,
      mainGapClass
  } = radarData;

  // officialPlanDataForDetails の定義を handleBenefitClick の前に移動
  const getOfficialPlanDataKey = (context) => {
    switch (context) {
      case 'recommended': return 'recommendedPlanData';
      case 'premier': return 'planAData';
      case 'medicalFocus': return 'planB_MedicalFocusData';
      case 'lifeProtectionFocus': return 'planC_DeathFocusData';
      default: return null;
    }
  };
  const officialPlanDataKey = getOfficialPlanDataKey(currentPlanContext);
  const officialPlanDataForDetails = officialPlanDataKey ? initialCustomerData[officialPlanDataKey] : null;

  const handleRegisterContract = useCallback(() => {
    showOtherContractGuide();
  }, [showOtherContractGuide]);

  const handleAxisLabelClick = useCallback((indicator) => {
    generateAndSetAiMessage('axis_info', indicator);
  }, [generateAndSetAiMessage]);

  const handleBenefitClick = useCallback((benefitInfo) => {
    console.log("Benefit clicked (from PlanDetails or similar):", benefitInfo);
    // generateAndSetAiMessage('benefit_details', benefitInfo); // 古い呼び出しを置き換える
    
    // benefitInfo に planData と currentPlanContext, currentPlanName を含める必要がある
    // PlanDetails から渡される情報に基づいて showRichBenefitDetailGuide を呼び出す
    // App.js のスコープで planData (simulatedData) と currentPlanContext は利用可能
    // currentPlanName は officialPlanDataForDetails.name や currentPlanContext から導出可能
    
    let planName = 'カスタムプラン'; // デフォルト
    if (currentPlanContext !== 'custom' && officialPlanDataForDetails) {
      planName = officialPlanDataForDetails.name;
    } else if (currentPlanContext === 'recommended' && initialCustomerData.recommendedPlanData) {
      planName = initialCustomerData.recommendedPlanData.name; // 推奨プランの場合
    } 
    // 他の固定プラン名も必要に応じてここで設定
    
    showRichBenefitDetailGuide(benefitInfo, simulatedData, currentPlanContext, planName);

  }, [generateAndSetAiMessage, showRichBenefitDetailGuide, simulatedData, currentPlanContext, initialCustomerData.recommendedPlanData]); // 依存関係から officialPlanDataForDetails を削除し、代わりに currentPlanContext と initialCustomerData.recommendedPlanData を追加（または必要に応じて officialPlanDataForDetails の再計算に必要なものをすべて追加）

  const handleCurrentCoverageItemClick = useCallback((item) => {
    showCoverageDetailGuide(item); 
  }, [showCoverageDetailGuide]);

  const handleConditionWarningClick = useCallback((conditionInfo) => {
    generateAndSetAiMessage('condition_info_short_stay', conditionInfo);
  }, [generateAndSetAiMessage]);

  const handleShowProfileEditor = useCallback(() => {
    updateAiMessage(profileEditorHtml); 
  }, [updateAiMessage]);

  const handleTimelineEventClick = useCallback((eventId) => {
    setActiveTimelineEventId(eventId);
    generateAndSetAiMessage('timeline_event', eventId);
  }, [generateAndSetAiMessage]);

  const timelineEventDetailsContent = useMemo(() => {
    if (activeTimelineEventId !== null && timelineEvents[activeTimelineEventId]) {
      return <div dangerouslySetInnerHTML={{ __html: timelineEvents[activeTimelineEventId].details }} />;
    }
    return <p className="text-gray-500 italic text-center pt-2">気になるステップをタッチして、当時の気持ちを振り返ってみましょう <i className="far fa-hand-point-up ml-1"></i></p>;
  }, [activeTimelineEventId]);

  // New toggleAiConcierge to set initial message when opening
  const toggleAiConcierge = useCallback(() => {
    originalToggleAiConcierge();
    // If aiconcierge is being opened, and message is not already set (or set to initial/empty)
    // For simplicity, we'll set 'init' message every time it's opened by toggle
    // Note: !isAiConciergeOpen checks the state *before* the toggle takes full effect in this render cycle
    if (!isAiConciergeOpen) { 
      generateAndSetAiMessage('init');
    }
  }, [originalToggleAiConcierge, isAiConciergeOpen, generateAndSetAiMessage]);

  return (
    <div className="dashboard-container max-w-7xl mx-auto  bg-gray-100 shadow-lg rounded-lg font-sans relative">
      <CustomerHeader
        customerProfile={initialCustomerData.profile} 
        onToggleAiConcierge={toggleAiConcierge} 
        onShowProfileEditor={handleShowProfileEditor} 
        onShowNotifications={showNotificationListHandler} 
        notificationCount={notificationCount} 
      />
      <main className="dashboard-main md:p-1">
        <div className="main-content-columns flex flex-col lg:flex-row flex-wrap gap-2 mb-2">
          <div className="left-column w-full lg:w-1/4 min-w-[150px] flex flex-col">
            <CurrentContracts
              currentCoverageSelf={initialCustomerData.currentCoverageSelf} 
              currentCoverageOther={initialCustomerData.currentCoverageOther} 
              onRegisterContract={handleRegisterContract} 
              onConditionWarningClick={handleConditionWarningClick} 
              onShowCoverageItemGuide={handleCurrentCoverageItemClick} 
            />
          </div>
          <div className="center-column w-full lg:flex-[1.5] min-w-[480px] flex flex-col">
            {(indicatorsConfig && indicatorsConfig.length > 0 && 
              requiredRadarData && requiredRadarData.length > 0 &&
              currentRadarData && currentRadarData.length > 0 &&
              simulatedRadarData && simulatedRadarData.length > 0
              ) ? (
              <CoverageRadarChart
                indicatorsConfig={indicatorsConfig} 
                requiredData={requiredRadarData}
                currentData={currentRadarData}
                simulatedData={simulatedRadarData}
                originalRequiredCoverage={initialCustomerData.requiredCoverageBenchmark} 
                originalCurrentCoverage={combinedCurrentCoverage}
                originalSimulatedPlanData={simulatedData}
                customerProfile={initialCustomerData.profile} 
                onAxisLabelClick={handleAxisLabelClick}
                premiumBreakdownText={premiumBreakdownText}
                mainGapText={mainGapText}
                mainGapClass={mainGapClass}
              />
            ) : (
              <div className="center-column module flex flex-col bg-white border border-gray-200 rounded-md p-4 shadow-sm justify-center items-center min-h-[400px]">
                <p className="text-gray-500">レーダーチャートを読み込み中...</p>
              </div>
            )}
          </div>
          <div className="right-column w-full lg:flex-[1.5] min-w-[440px] flex flex-col gap-4">
            <PlanDetails
              planData={simulatedData}
              currentPlanContext={currentPlanContext}
              officialPlanData={officialPlanDataForDetails}
              userTags={initialCustomerData.profile.tags} 
              onLoadPlan={loadPlan} 
              onBenefitClick={handleBenefitClick} 
            />
          </div>
        </div>

        <div className="timeline-section-wrapper mt-4">
          <Timeline
              timelineEvents={timelineEvents} 
              activeEventId={activeTimelineEventId}
              onEventClick={handleTimelineEventClick} 
              eventDetailsContent={timelineEventDetailsContent}
            />
        </div>

        <div className="below-columns-content mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimulationSliders
            simulatedData={simulatedData}
            onSliderChange={handleSliderChange} 
          />
          <section className="ply-recommendation module bg-white border border-gray-200 rounded-md p-4 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-800 pb-1 mb-3 flex items-center">
              <i className="fas fa-users mr-2"></i> みんなの選択 (PLY)
            </h2>
            <div className="text-xs text-gray-600 mb-3">
              <i className="fas fa-user-check mr-1 text-blue-500"></i>
              <strong>{initialCustomerData.plyData.matchedAttributes?.join('・') || 'あなたと似た属性の方々'}</strong> の傾向： 
            </div>

            <div className="ply-summary-container space-y-4 mb-4">
              {initialCustomerData.plyData.summary?.map((categoryData, catIndex) => ( 
                <div key={catIndex} className="ply-category-section bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <i className={`${categoryData.icon || 'fa-solid fa-info-circle'} mr-2 text-green-700`}></i>
                    {categoryData.category}
                  </h3>
                  <div className="space-y-3">
                    {categoryData.sections?.map((section, secIndex) => (
                      <div key={secIndex} className="ply-section-item border-t border-gray-200 pt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700 flex items-center">
                            <i className={`${section.icon || 'fa-solid fa-check'} w-4 text-center mr-1.5 text-gray-500`}></i>
                            {section.title}
                          </span>
                          <div className="flex items-center space-x-1" title={`加入率: ${section.joinRate}%`}>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${section.joinRate}%` }}></div>
                            </div>
                            <span className="text-xs font-medium text-blue-600">{section.joinRate}%</span>
                          </div>
                        </div>
                        <div className="text-xs pl-5 mb-1">
                          <span className="text-gray-600">目安：</span>
                          <strong className="text-indigo-700">{section.averageValue.amount.toLocaleString()} {section.averageValue.unit}</strong>
                          {section.commonMethod && <span className="text-gray-500 text-[10px] ml-1"> ({section.commonMethod})</span>}
                        </div>
                        <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-1.5 pl-5 relative before:content-['💡'] before:absolute before:left-1.5 before:top-1.5">
                          {section.thinkingPoint}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">こんな声も届いています</h3>
              {initialCustomerData.plyData.voices?.slice(0, 2).map((voice, index) => ( 
                <div key={index} className="ply-voice-card text-xs bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                  <blockquote className="italic mb-1.5 text-gray-700 border-l-4 border-blue-300 pl-3">
                    <i className={`${voice.icon || 'fa-regular fa-comment'} mr-1.5 text-blue-500`}></i>
                    「{voice.quote}」
                  </blockquote>
                  <p className="text-gray-600 text-[10px] mb-1 pl-4">({voice.age}歳, {voice.family})</p>
                  <p className="text-gray-800 pl-4"><strong className="text-gray-600">決め手：</strong> {voice.reason}</p>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-3 border-t border-dashed border-gray-200">
              <p className="text-xs text-gray-700 leading-relaxed">
                <i className="fas fa-compass mr-1.5 text-emerald-600"></i>
                <strong>考え方のヒント：</strong> {initialCustomerData.plyData.guidance} 
              </p>
              <div className="mt-3 text-right space-x-2">
                  <button className="text-xs py-1 px-2 border border-green-600 text-green-700 rounded hover:bg-green-50 transition-colors">詳しく聞く</button>
                  <button className="text-xs py-1 px-2 border border-indigo-600 text-indigo-700 rounded hover:bg-indigo-50 transition-colors">シミュレーションで試す</button>
              </div>
            </div>
          </section>
          <section className="future-planning module bg-white border border-gray-200 rounded-md p-4 shadow-sm">
            <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-800 pb-1 mb-3 flex items-center">
              <i className="fas fa-seedling mr-2"></i> 将来のライフプランニング
            </h2>
            <p id="future-suggestion" className='text-sm'>{initialCustomerData.futureSuggestionText}</p> 
          </section>
        </div>
      </main>
      <AiConcierge
        isOpen={isAiConciergeOpen} 
        onClose={handleCloseAiConcierge} 
        messageContent={aiMessage} 
        onNotificationCardClick={showNotificationListHandler} 
        onBackToList={showNotificationListHandler} 
      />
    </div>
  );
}

export default App;
