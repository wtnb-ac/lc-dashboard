import { useState, useCallback } from 'react';

export const usePlanSimulation = (initialSimData, initialCustomerData, generateAndSetAiMessage) => {
  const [simulatedData, setSimulatedData] = useState(initialSimData);
  const [currentPlanContext, setCurrentPlanContext] = useState('recommended');

  const loadPlan = useCallback((planKey) => {
    let sourceData;
    let planDataKey;
    switch (planKey) {
        case 'recommended': planDataKey = 'recommendedPlanData'; break;
        case 'premier': planDataKey = 'planAData'; break;
        case 'medicalFocus': planDataKey = 'planB_MedicalFocusData'; break;
        case 'lifeProtectionFocus': planDataKey = 'planC_DeathFocusData'; break;
        default: console.error(`Invalid plan key provided to loadPlan: ${planKey}`); return;
    }

    if (!initialCustomerData[planDataKey]) {
        console.error(`Data for plan key "${planKey}" (${planDataKey}) not found.`);
        return;
    }
    sourceData = initialCustomerData[planDataKey];

    const newSimulatedData = {};
    // Use initialSimData passed to the hook as the blueprint
    const blueprintKeys = Object.keys(initialSimData || {});
    const allSourceKeys = Object.keys(sourceData || {});
    const keysToCopy = [...new Set([...blueprintKeys, ...allSourceKeys])];

    keysToCopy.forEach(key => {
        // Exclude metadata keys
        if (['name', 'description', 'totalPremium', 'protectionPremium', 'savingsPremium', 'benefitKeywords'].includes(key)) {
             return;
        }
        // Copy value from source plan, fallback to blueprint, then default
        newSimulatedData[key] = sourceData[key] !== undefined
            ? sourceData[key]
            : (initialSimData?.[key] !== undefined
                ? initialSimData[key]
                : (key === 'medicalBenefitsIncluded' ? [] : 0));
    });

    // console.log("loadPlan (hook) setting simulatedData:", newSimulatedData);
    setSimulatedData(newSimulatedData);
    setCurrentPlanContext(planKey);
    // Trigger AI message update
    if (generateAndSetAiMessage) {
        generateAndSetAiMessage('plan_select', planKey);
    }
  }, [initialSimData, initialCustomerData, generateAndSetAiMessage]);

  const handleSliderChange = useCallback((key, value) => {
    setSimulatedData(prevData => ({
      ...prevData,
      [key]: value
    }));

    // setCurrentPlanContext の前にAIメッセージを送信
    if (generateAndSetAiMessage) {
      generateAndSetAiMessage('slider_adjust', { name: key });
    }

    // Only set context to 'custom' if it wasn't already custom
    setCurrentPlanContext(prevContext => {
        if (prevContext !== 'custom') {
             return 'custom';
        }
        return prevContext; // Keep context as custom if already custom
    });

  }, [generateAndSetAiMessage]); 

  return {
    simulatedData,
    currentPlanContext,
    loadPlan,
    handleSliderChange,
    // We don't expose setSimulatedData or setCurrentPlanContext directly
  };
};
