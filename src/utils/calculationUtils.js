// src/utils/calculationUtils.js

// Import constants if needed (e.g., initialCustomerData for combineCurrentCoverage structure)
import { initialCustomerData } from '../constants/customerData'; // Adjusted path

// Calculate quantitative coverage VALUE (Lumpsum + Annuity/Monthly equivalent)
export function calculateQuantitativeValue(dataSet, indicatorKey) {
  let value = 0;
  const ageFactor = 25; // Years to consider for monthly/annuity benefits (65 - 40)
  const months = 12;
  const getValue = (key) => (dataSet && typeof dataSet[key] === 'number' ? dataSet[key] : 0);

  switch (indicatorKey) {
    case 'death': // Represents total death coverage value (unit: 万円)
      value = getValue('deathLumpsum') + (getValue('deathAnnuity') * months * ageFactor);
      break;
    case 'disability': // Represents total disability coverage value (unit: 万円)
      value = getValue('disabilityLumpsum') + (getValue('disabilityMonthly') * months * ageFactor);
      break;
    case 'savings': // Use savingsMonthly directly (unit: 円) - Note: Unit difference handled in percentage calculation later
      value = getValue('savingsMonthly');
      break;
    // medical and critical are handled qualitatively
    default:
      value = 0; // Return 0 for keys not handled quantitatively here
  }
  return typeof value === 'number' && !isNaN(value) ? value : 0;
}

// Calculate Qualitative Level for Medical Coverage (0-100 scale)
export function calculateMedicalCoverageScore(planData, isCurrentCoverage = false) {
  let includedBenefits = [];

  if (planData && Array.isArray(planData.medicalBenefitsIncluded)) {
    includedBenefits = planData.medicalBenefitsIncluded;
  } 
  else if (isCurrentCoverage && planData) {
      const getValue = (key) => (planData && typeof planData[key] === 'number' ? planData[key] : 0);
      if (getValue('medicalDaily') > 0) {
          includedBenefits.push('daily');
      }
      // Add other assumptions for current coverage if needed
  }
  
  const score = includedBenefits.length * 20;
  return Math.min(100, Math.max(0, Math.round(score))); 
}

// Calculate Radar Data Point (Percentage/Level) based on indicator type
export function calculateRadarDataPoint(indicatorKey, planData, requiredData, isCurrentCoverage = false) { 
  const userTargetValues = {
    death: 5000,       // Unit: 万円 
    disability: 8000,  // Unit: 万円 
    savings: 60000,    // Unit: 円   (Monthly Savings)
    critical: 400       // Unit: 万円 (Combined Cancer + Circulatory Lumpsum)
  };
  const getValue = (data, key) => (data && typeof data[key] === 'number' ? data[key] : 0);

  switch (indicatorKey) {
    case 'death':
    case 'disability':
      const targetValueQuant = userTargetValues[indicatorKey];
      const planValueQuant = calculateQuantitativeValue(planData, indicatorKey); // Uses combined lump+annuity
      return targetValueQuant > 0 ? Math.min(100, Math.round((planValueQuant / targetValueQuant) * 100)) : 0;
    case 'savings': 
      const targetValueSavings = userTargetValues[indicatorKey];
      const planValueSavings = getValue(planData, 'savingsMonthly'); // Direct value
      return targetValueSavings > 0 ? Math.min(100, Math.round((planValueSavings / targetValueSavings) * 100)) : 0;
    case 'medical':
      return calculateMedicalCoverageScore(planData, isCurrentCoverage);
    case 'critical':
      const targetValueCritical = userTargetValues[indicatorKey];
      const cancerVal = getValue(planData, 'criticalCancer');
      const circVal = getValue(planData, 'criticalCirculatory');
      const planValueCritical = cancerVal + circVal; // Simple sum of the two lump sums
      return targetValueCritical > 0 ? Math.min(100, Math.round((planValueCritical / targetValueCritical) * 100)) : 0;
    default:
      console.warn(`Unhandled indicator key in calculateRadarDataPoint: ${indicatorKey}`);
      return 0;
  }
}

// Combine self and other coverage data
export function combineCurrentCoverage(self, other) {
  const combined = {};
  // Use initialSimulationData keys as a reference (excluding medicalBenefitsIncluded for direct sum)
  const allKeys = Object.keys(initialCustomerData.initialSimulationData || {}).filter(k => k !== 'medicalBenefitsIncluded');
  
  allKeys.forEach(key => {
      const selfValue = Number(self?.[key]) || 0;
      const otherValue = Number(other?.[key]) || 0;
      combined[key] = selfValue + otherValue;
  });

  combined.premium = (Number(self?.premium) || 0) + (Number(other?.premium) || 0);

  const selfKeywords = Array.isArray(self?.benefitKeywords) ? self.benefitKeywords : [];
  const otherKeywords = Array.isArray(other?.benefitKeywords) ? other.benefitKeywords : [];
  combined.benefitKeywords = [...new Set([...selfKeywords, ...otherKeywords])];
  
  if (other?.medicalDaily > 0) {
      combined.hasOtherMedicalCondition = true; 
  }

  const combinedBenefits = [];
  if ((Number(self?.medicalDaily) || 0) + (Number(other?.medicalDaily) || 0) > 0) {
      combinedBenefits.push('daily');
  }
  combined.medicalBenefitsIncluded = [...new Set(combinedBenefits)];

  return combined;
}

// Calculate total coverage value for radar chart axes (Potentially redundant, keep for now)
export function calculateTotalCoverageValue(dataSet, indicatorKey) {
  let value = 0;
  const ageFactor = 25;
  const months = 12;
  const getValue = (key) => (dataSet && typeof dataSet[key] === 'number' ? dataSet[key] : 0); // Safe getter

  switch (indicatorKey) {
    case 'deathLumpsum': value = getValue('deathLumpsum') + (getValue('deathAnnuity') * months * ageFactor); break;
    case 'disabilityMonthly': value = getValue('disabilityLumpsum') + (getValue('disabilityMonthly') * months * ageFactor); break;
    case 'criticalCancer': value = getValue('criticalCancer') + getValue('criticalCirculatory'); break;
    case 'medicalDaily': value = getValue('medicalDaily'); break;
    case 'savingsMonthly': value = getValue('savingsMonthly'); break;
    default: value = getValue(indicatorKey);
  }
  return typeof value === 'number' && !isNaN(value) ? value : 0;
}

// Calculate estimated premium (simplified example)
export function calculateSimulatedPremium(simData, currentPlanContext, customerData) {
    // This function needs customerData (which includes plan premiums)
    // If a specific plan is selected, use its predefined premium
    if (currentPlanContext !== 'custom' && customerData[currentPlanContext + 'Data']) {
        const plan = customerData[currentPlanContext + 'Data'];
        return {
            total: plan.totalPremium || 0,
            protection: plan.protectionPremium || 0,
            savings: plan.savingsPremium || 0
        };
    }

    // Custom simulation premium estimation
    const factors = {
        deathLumpsum: 0.5, deathAnnuity: 200, disabilityLumpsum: 0.8, disabilityMonthly: 300,
        medicalDaily: 1, medicalSurgery: 400, criticalCancer: 20, criticalCirculatory: 20,
        savingsMonthly: 0.9
    };
    let protectionPremium = 0;
    let savingsPremium = (simData?.savingsMonthly || 0) * factors.savingsMonthly;

    for (const key in simData) {
        if (factors[key] && key !== 'savingsMonthly' && typeof simData[key] === 'number') {
            protectionPremium += simData[key] * factors[key];
        }
    }
    let totalPremium = Math.max(0, Math.round(protectionPremium + savingsPremium));
    savingsPremium = Math.max(0, Math.round(savingsPremium));
    protectionPremium = totalPremium - savingsPremium;

    return { total: totalPremium, protection: protectionPremium, savings: savingsPremium };
}

// Calculate coverage sufficiency info (simplified example)
export function calculateCoverageInfo(simData, reqCoverage, indicators) {
    // Note: reqCoverage here likely refers to the benchmark data
    const weights = { deathLumpsum: 3, disabilityMonthly: 3, medicalDaily: 1, criticalCancer: 1, savingsMonthly: 1 };
    let maxGapScore = -1; let maxGapIndex = -1;
    indicators.forEach((ind, index) => {
        const key = ind.key;
        // Use calculateTotalCoverageValue as it was used before (needs review vs requiredCoverageBenchmark structure)
        const req = calculateTotalCoverageValue(reqCoverage, key);
        const sim = calculateTotalCoverageValue(simData, key);
        const weight = weights[key] || 1;
        if (req > 0) {
            let gap = Math.max(0, req - sim);
            let gapScore = (gap / req) * weight;
            if (gapScore > maxGapScore && gap > 0.01 * req) {
                maxGapScore = gapScore;
                maxGapIndex = index;
            }
        }
    });

    let coverageRate = maxGapIndex === -1 ? 100 : 100 - (maxGapScore * 20);
    coverageRate = Math.max(0, Math.min(100, Math.round(coverageRate)));

    return { coverageRate, maxGapIndex };
}
