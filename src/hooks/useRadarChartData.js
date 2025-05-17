import { useMemo } from 'react';
import {
    // Assuming these are exported from radarConfig
    // Removed indicatorsConfig from here as it's directly used
    requiredCoverageBenchmark
} from '../constants/radarConfig';
// Import indicatorsConfig separately
import { indicatorsConfig } from '../constants/radarConfig'; // Explicitly import
import {
    combineCurrentCoverage,
    calculateRadarDataPoint,
    calculateSimulatedPremium,
    calculateCoverageInfo
} from '../utils/calculationUtils';

export const useRadarChartData = (simulatedData, currentPlanContext, initialCustomerData) => {

    const radarChartData = useMemo(() => {
        // --- Data Validation ---
        if (!initialCustomerData ||
            !indicatorsConfig ||
            !requiredCoverageBenchmark ||
            !initialCustomerData.currentCoverageSelf ||
            !initialCustomerData.currentCoverageOther ||
            !simulatedData) {
            console.warn("useRadarChartData: Required data missing or incomplete.");
            const indicators = indicatorsConfig || [];
            const defaultRadarData = indicators.map(() => 0);
            return {
                requiredRadarData: indicators.map(() => 100),
                currentRadarData: defaultRadarData,
                simulatedRadarData: defaultRadarData,
                combinedCurrentCoverage: combineCurrentCoverage(initialCustomerData?.currentCoverageSelf, initialCustomerData?.currentCoverageOther),
                premiumBreakdownText: '<p>計算中...</p>',
                mainGapText: '---',
                mainGapClass: '',
                indicatorsConfig: indicatorsConfig
            };
        }

        // --- Calculations ---
        const combinedCurrentCoverage = combineCurrentCoverage(
            initialCustomerData.currentCoverageSelf,
            initialCustomerData.currentCoverageOther
        );
        const indicators = indicatorsConfig;
        const reqData = requiredCoverageBenchmark; // Benchmark data
        const simData = simulatedData; // From hook argument

        console.log(`useRadarChartData: Calculating for context '${currentPlanContext}'. Medical benefits:`, simData?.medicalBenefitsIncluded);

        // Calculate required levels (fixed percentages for display)
        const reqRadar = indicators.map(ind => {
            switch (ind.key) {
                case 'death': return 90;
                case 'disability': return 88;
                case 'medical': return 80;
                case 'critical': return 75;
                case 'savings': return 67;
                default: return 100;
            }
        });

        // Calculate current and simulated levels
        const currentRadar = indicators.map(ind => calculateRadarDataPoint(ind.key, combinedCurrentCoverage, reqData, true));
        const simRadar = indicators.map(ind => calculateRadarDataPoint(ind.key, simData, reqData, false));

        // Calculate premium breakdown
        const premiumResult = calculateSimulatedPremium(simData, currentPlanContext, initialCustomerData);
        const calculatedSavingsPremium = premiumResult.savings;
        const protectionAmount = Math.max(0, premiumResult.total - calculatedSavingsPremium);
        const totalAmount = protectionAmount + calculatedSavingsPremium;
        const breakdownText = `保障：<strong>${protectionAmount.toLocaleString()}</strong> 円 ＋ 貯蓄：<strong>${calculatedSavingsPremium.toLocaleString()}</strong> 円<span class="text-xs text-gray-500 ml-1">(合計：${totalAmount.toLocaleString()} 円)</span>`;

        // Calculate main gap
        const { maxGapIndex } = calculateCoverageInfo(simData, reqData, indicators);
        let gapText = '---';
        let gapClass = '';
        if (maxGapIndex !== -1 && indicators[maxGapIndex]) {
          gapText = indicators[maxGapIndex].name;
          gapClass = 'text-red-600';
        } else {
          gapText = "充足";
          gapClass = 'text-green-600';
        }

        return {
            requiredRadarData: reqRadar,
            currentRadarData: currentRadar,
            simulatedRadarData: simRadar,
            combinedCurrentCoverage: combinedCurrentCoverage,
            premiumBreakdownText: breakdownText,
            mainGapText: gapText,
            mainGapClass: gapClass,
            indicatorsConfig: indicatorsConfig
        };
    // Dependencies for the useMemo inside the hook
    }, [simulatedData, currentPlanContext, initialCustomerData, indicatorsConfig]);

    // Return the calculated data object
    return radarChartData;
};
