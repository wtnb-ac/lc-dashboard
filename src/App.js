import React, { useState, useCallback, useEffect, useMemo } from 'react';

// Import components
// 作成したコンポーネントをインポート
import CustomerHeader from './components/CustomerHeader';
import CurrentContracts from './components/CurrentContracts';
import CoverageRadarChart from './components/CoverageRadarChart';
import PlanDetails from './components/PlanDetails';
import SimulationSliders from './components/SimulationSliders';
import Timeline from './components/Timeline';
import AiConcierge from './components/AiConcierge';

// Import Font Awesome CSS if not globally included (optional)
// Font Awesome CSS をグローバルに含まれていない場合にインポート（オプション）
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import constants
import { initialCustomerData } from './constants/customerData';
// Import other constants
import { timelineEvents } from './constants/timelineEvents';
import { profileEditorHtml } from './constants/aiContent'; // Remove notification related imports here

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
    toggleAiConcierge,
    handleCloseAiConcierge,
    updateAiMessage,
  } = useAiConcierge(); // Pass initial message if needed, e.g., 'こんにちは！'

  const {
    notificationCount,
    handleShowNotifications,
    handleShowNotificationDetail,
    showNotificationListHandler, // Use the renamed handler from the hook
  } = useNotifications(updateAiMessage, initialCustomerData.profile); // Pass updateAiMessage and customer profile

  // Initialize the new hook
  const {
    simulatedData, // Get state from the hook
    currentPlanContext, // Get state from the hook
    loadPlan, // Get function from the hook
    handleSliderChange // Get function from the hook
  } = usePlanSimulation(
    initialCustomerData.initialSimulationData, // Pass initial simulation data
    initialCustomerData, // Pass all initial customer data (needed for loading plans)
    updateAiMessage // Pass the AI message generator function
  );

  // Call the new hook to get calculated radar data
  const radarData = useRadarChartData(simulatedData, currentPlanContext, initialCustomerData);
  const {
      indicatorsConfig, // Get indicatorsConfig from the hook now
      requiredRadarData,
      currentRadarData,
      simulatedRadarData,
      combinedCurrentCoverage,
      premiumBreakdownText,
      mainGapText,
      mainGapClass
  } = radarData;

  // --- Function to update AI message content ---
  const generateAndSetAiMessage = useCallback((context, data = null) => {
    let output = '';
    const userName = initialCustomerData.profile.name;
    const planKey = typeof data === 'string' ? data : currentPlanContext; // Get the correct plan key

    // Define plan descriptions based on user input
    const planDescriptions = {
      recommended: 'バランスよくカバーし、既契約を考慮して必要保障額を満たすように調整。保険料を抑えつつ、医療と重い病気は基本的な保障（入院日額、重病一時金100万円など）を確保したプランです。',
      planA: '必要となる保障を高水準で備え、万全を期すプランです。がんや循環器疾患への備えも手厚く、入院一時金も付いているため短期的な費用にも安心です。',
      planC_DeathFocus: '保険料を抑えつつ、万一・就業不能時の家族の生活費を重視。死亡・就業不能保障は維持し、医療と重い病気の保障を基本的な内容に絞ったプランです。',
      planB_MedicalFocus: '保険料を抑えつつ、医療や重い病気への備えを重視。基本的な医療保障は維持し、死亡・就業不能保障額を調整したプランです。',
      custom: 'これはスライダーで調整されたあなただけのカスタムプランです。保障内容をご確認ください。' // Description for custom plan
    };

    let planDataKey;
    switch (planKey) {
      case 'recommended': planDataKey = 'recommendedPlanData'; break;
      case 'planA': planDataKey = 'planAData'; break;
      case 'planB_MedicalFocus': planDataKey = 'planB_MedicalFocusData'; break;
      case 'planC_DeathFocus': planDataKey = 'planC_DeathFocusData'; break;
      case 'custom': planDataKey = null; break;
      default: planDataKey = null;
    }

    const planInfo = planKey === 'custom'
      ? { name: "カスタムプラン" }
      : initialCustomerData[planDataKey];

    const planName = planInfo?.name || 'プラン'; // Default name
    const indicatorName = (typeof data === 'object' && data !== null) ? data.name : '項目';

    // Select the correct description
    let description = planDescriptions[planKey] || planDescriptions.custom; // Fallback to custom or a default

    switch (context) {
      case 'init':
        const initialPlanName = initialCustomerData.recommendedPlanData?.name || '推奨プラン';
        const initialDescription = planDescriptions['recommended'];
        output = `<p>${userName}さん、こんにちは！<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1"></p>`;
        output += `<p class="text-xs mt-1">現在の提案は「<strong>${initialPlanName}</strong>」です。</p>`;
        output += `<div class="story-quote text-xs mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">${initialDescription}</div>`;
        output += `<p class="text-xs mt-2">右側の詳細やスライダーで内容を確認・調整できますよ😊</p>`;
        break;
      case 'plan_select':
          output = `<p>「<strong>${planName}</strong>」を表示しますね！<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1">✨</p>`;
          output += `<div class="story-quote text-xs mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">${description}</div>`;
          output += `<p class="text-xs mt-2">保障内容と月額保険料をご確認ください。</p>`;
          break;
      case 'slider_adjust':
          const customDescription = planDescriptions['custom'];
          output = `<p>「${indicatorName}」を調整中...<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1">✍️</p>`;
          output += `<div class="story-quote text-xs mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded">${customDescription}</div>`;
          output += `<p class="text-xs mt-1">全体のバランスを見ながら調整しましょう。</p>`;
          break;
      case 'timeline_event':
        const eventData = timelineEvents[data];
        output = `<p>タイムライン「${eventData?.title || 'イベント'}」<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1"></p>${eventData?.details ? `<div class="ai-timeline-details text-xs mt-1">${eventData.details}</div>` : '<p class="text-xs mt-1">詳細を確認します。</p>'}`;
        break;
      case 'register_contract':
         output = `<p>現在の加入状況を登録・更新しますか？<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1">📝</p><p class="text-xs mt-1">保障内容をより正確に把握するために重要です。</p>`;
         break;
      case 'axis_info':
          const axisName = data?.name || 'グラフ軸';
          output = `<p><strong>${axisName}</strong> についてですね！<img src="pentan.png" alt="ペンタン" class="pentan-icon h-4 inline-block ml-1">📊</p><p class="text-xs mt-1">${data?.tooltipText || 'この項目は、必要保障額や推奨される質に対する充足度を示しています。'}</p>`;
          break;
      case 'benefit_details':
          const benefitName = data?.label || '保障'; // Use label if available
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
    updateAiMessage(output); // Call the hook's function to update state and open concierge
  }, [updateAiMessage, currentPlanContext, simulatedData]); // Dependencies updated

  // --- Event Handlers and Callbacks ---

  // Toggle AI Concierge visibility (Provided by useAiConcierge)
  // const toggleAiConcierge = useCallback(() => { ... }, []); // Removed

  // Handle closing AI Concierge (Provided by useAiConcierge)
  // const handleCloseAiConcierge = useCallback(() => { ... }, []); // Removed

  const handleRegisterContract = useCallback(() => {
    generateAndSetAiMessage('register_contract');
  }, [generateAndSetAiMessage]);

  const handleAxisLabelClick = useCallback((indicator) => {
    generateAndSetAiMessage('axis_info', indicator);
  }, [generateAndSetAiMessage]);

  const handleBenefitClick = useCallback((benefitInfo) => {
    console.log("Benefit clicked:", benefitInfo);
    // Pass the more detailed benefit info object
    generateAndSetAiMessage('benefit_details', benefitInfo);
  }, [generateAndSetAiMessage]);

  const handleConditionWarningClick = useCallback((conditionInfo) => {
    console.log("Condition warning clicked:", conditionInfo);
    generateAndSetAiMessage('condition_info_short_stay', conditionInfo);
  }, [generateAndSetAiMessage]);

  // --- NEW Handler for Profile Editor (Uses imported constant and hook's function) ---
  const handleShowProfileEditor = useCallback(() => {
    updateAiMessage(profileEditorHtml); // Use hook's function directly
  }, [updateAiMessage]);

  // --- Handlers for Notifications (Provided by useNotifications) ---
  // const showNotificationList = useCallback(() => { ... }, []); // Removed (renamed in hook)
  // const handleShowNotifications = useCallback(() => { ... }, []); // Removed
  // const handleShowNotificationDetail = useCallback((notificationId) => { ... }, []); // Removed

  const handleTimelineEventClick = useCallback((eventId) => {
    setActiveTimelineEventId(eventId);
    generateAndSetAiMessage('timeline_event', eventId);
  }, [generateAndSetAiMessage]);

  // --- Calculate Derived State for Radar Chart and Summaries ---
  // const { ... } = useMemo(() => { ... }); // Calculation logic moved to useRadarChartData hook

  const timelineEventDetailsContent = useMemo(() => {
    if (activeTimelineEventId !== null && timelineEvents[activeTimelineEventId]) {
      return <div dangerouslySetInnerHTML={{ __html: timelineEvents[activeTimelineEventId].details }} />;
    }
    return <p className="text-gray-500 italic text-center pt-2">気になるステップをタッチして、当時の気持ちを振り返ってみましょう <i className="far fa-hand-point-up ml-1"></i></p>;
  }, [activeTimelineEventId]);

  useEffect(() => {
    generateAndSetAiMessage('init'); // Use the generate function on initial load
  }, [generateAndSetAiMessage]);

  const getOfficialPlanDataKey = (context) => {
    switch (context) {
      case 'recommended': return 'recommendedPlanData';
      case 'planA': return 'planAData';
      case 'planB_MedicalFocus': return 'planB_MedicalFocusData';
      case 'planC_DeathFocus': return 'planC_DeathFocusData';
      default: return null;
    }
  };
  const officialPlanDataKey = getOfficialPlanDataKey(currentPlanContext);
  const officialPlanDataForDetails = officialPlanDataKey ? initialCustomerData[officialPlanDataKey] : null;

  // --- JSX Structure ---
  return (
    <div className="dashboard-container max-w-7xl mx-auto my-2 p-1 bg-gray-100 shadow-lg rounded-lg font-sans relative">
      <CustomerHeader
        customerProfile={initialCustomerData.profile} // Use initialCustomerData directly
        onToggleAiConcierge={toggleAiConcierge} // Use hook's function
        onShowProfileEditor={handleShowProfileEditor} // Use updated handler
        onShowNotifications={handleShowNotifications} // Use hook's function
        notificationCount={notificationCount} // Use hook's state
      />
      <main className="dashboard-main p-2 md:p-3">
        {/* 3-Column Layout */}
        <div className="main-content-columns flex flex-col lg:flex-row flex-wrap gap-3 mb-3">
          {/* Left Column */}
          <div className="left-column w-full lg:w-1/4 min-w-[280px] flex flex-col">
            <CurrentContracts
              currentCoverageSelf={initialCustomerData.currentCoverageSelf} // Use initialCustomerData directly
              currentCoverageOther={initialCustomerData.currentCoverageOther} // Use initialCustomerData directly
              onRegisterContract={handleRegisterContract} // Use updated handler
              onConditionWarningClick={handleConditionWarningClick} // Use updated handler
            />
          </div>
          {/* Center Column - Adjusted flex basis */}
          <div className="center-column w-full lg:flex-[1.5] min-w-[380px] flex flex-col">
            {/* --- Conditional Rendering for CoverageRadarChart (Uses imported indicatorsConfig) --- */}
            {(indicatorsConfig && indicatorsConfig.length > 0 && // Now uses indicatorsConfig from hook
              requiredRadarData && requiredRadarData.length > 0 &&
              currentRadarData && currentRadarData.length > 0 &&
              simulatedRadarData && simulatedRadarData.length > 0
              ) ? (
              <CoverageRadarChart
                indicatorsConfig={indicatorsConfig} // Pass indicatorsConfig from hook
                requiredData={requiredRadarData}
                currentData={currentRadarData}
                simulatedData={simulatedRadarData}
                originalRequiredCoverage={initialCustomerData.requiredCoverageBenchmark} // Use initialCustomerData directly
                originalCurrentCoverage={combinedCurrentCoverage}
                originalSimulatedPlanData={simulatedData}
                customerProfile={initialCustomerData.profile} // Use initialCustomerData directly
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
          {/* Right Column - Adjusted flex basis */}
          <div className="right-column w-full lg:flex-[1.5] min-w-[400px] flex flex-col gap-4">
            <PlanDetails
              planData={simulatedData}
              currentPlanContext={currentPlanContext}
              officialPlanData={officialPlanDataForDetails}
              userTags={initialCustomerData.profile.tags} // Use initialCustomerData directly
              onLoadPlan={loadPlan} // Use updated handler
              onBenefitClick={handleBenefitClick} // Use updated handler
            />
          </div>
        </div>

        {/* --- Timeline Section (Moved Here) --- */}
        <div className="timeline-section-wrapper mt-4">
          <Timeline
              timelineEvents={timelineEvents} // Use imported
              activeEventId={activeTimelineEventId}
              onEventClick={handleTimelineEventClick} // Use updated handler
              eventDetailsContent={timelineEventDetailsContent}
            />
        </div>

        {/* Content Below Columns */}
        <div className="below-columns-content mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimulationSliders
            simulatedData={simulatedData}
            onSliderChange={handleSliderChange} // Use updated handler
          />
          {/* Placeholder for PLY and Future Planning */}
          <section className="ply-recommendation module bg-white border border-gray-200 rounded-md p-4 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-800 pb-1 mb-3 flex items-center">
              <i className="fas fa-users mr-2"></i> みんなの選択 (PLY)
            </h2>
            <div className="text-xs text-gray-600 mb-3">
              <i className="fas fa-user-check mr-1 text-blue-500"></i>
              <strong>{initialCustomerData.plyData.matchedAttributes?.join('・') || 'あなたと似た属性の方々'}</strong> の傾向： {/* Use initialCustomerData directly */}
            </div>

            {/* --- NEW PLY Summary Display (Uses imported initialCustomerData) --- */}
            <div className="ply-summary-container space-y-4 mb-4">
              {initialCustomerData.plyData.summary?.map((categoryData, catIndex) => ( /* Use initialCustomerData directly */
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
                          {/* Join Rate Visualization (Simple Bar) */}
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
                        {/* Thinking Point (Tips) */}
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
              {initialCustomerData.plyData.voices?.slice(0, 2).map((voice, index) => ( /* Use initialCustomerData directly */
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
                <strong>考え方のヒント：</strong> {initialCustomerData.plyData.guidance} {/* Use initialCustomerData directly */}
              </p>
              {/* Action buttons (example) */}
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
            <p id="future-suggestion" className='text-sm'>{initialCustomerData.futureSuggestionText}</p> {/* Use initialCustomerData directly */}
          </section>
        </div>
      </main>
      {/* Render AI Concierge */}
      <AiConcierge
        isOpen={isAiConciergeOpen} // Use hook's state
        onClose={handleCloseAiConcierge} // Use hook's function
        messageContent={aiMessage} // Use hook's state
        onNotificationCardClick={handleShowNotificationDetail} // Pass hook's function
        onBackToList={showNotificationListHandler} // Pass hook's (renamed) function
      />
    </div>
  );
}

export default App;
