import { useState, useCallback } from 'react';

export const usePlanSimulation = (initialSimData, initialCustomerData, generateAndSetAiMessage) => {
  const [simulatedData, setSimulatedData] = useState(initialSimData);
  const [currentPlanContext, setCurrentPlanContext] = useState('recommended');

  const loadPlan = useCallback((planKey) => {
    let sourceData;
    let planDataKey;
    switch (planKey) {
        case 'recommended': planDataKey = 'recommendedPlanData'; break;
        case 'planA': planDataKey = 'planAData'; break;
        case 'planB_MedicalFocus': planDataKey = 'planB_MedicalFocusData'; break;
        case 'planC_DeathFocus': planDataKey = 'planC_DeathFocusData'; break;
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

    console.log("loadPlan (hook) setting simulatedData:", newSimulatedData);
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

    // If the change reverts back exactly to a predefined plan, update context
    // This requires comparing the new state with all predefined plans - potentially complex.
    // For simplicity, we'll just set to custom on any slider change for now.
    // TODO: Implement comparison logic if needed for context switching back.

    // Only set context to 'custom' if it wasn't already custom
    setCurrentPlanContext(prevContext => {
        if (prevContext !== 'custom') {
             // Optional: Trigger AI message only when switching to custom
             // if (generateAndSetAiMessage) {
             //     generateAndSetAiMessage('slider_adjust', { name: key });
             // }
             return 'custom';
        }
        return prevContext; // Keep context as custom if already custom
    });

  }, []); // Removed generateAndSetAiMessage dependency for now, as message is optional

  return {
    simulatedData,
    currentPlanContext,
    loadPlan,
    handleSliderChange,
    // We don't expose setSimulatedData or setCurrentPlanContext directly
  };
};
