import React, { useRef, useEffect, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import {
  TooltipComponent,
  LegendComponent,
  GridComponent // GridComponentもインポートしておくと他のチャートタイプで役立つことがあります
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register necessary ECharts components
// 必要なEChartsコンポーネントを登録
echarts.use([
  RadarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer
]);

// --- Color Definitions (Moved from App.jsx or define here) ---
const colors = {
  main: '#1B5E20',
  sub: '#FBC02D',
  required: '#AAAAAA',
  gap: '#D32F2F',
  self: '#FBC02D', // Use sub color for consistency with legend name '既契約'
  other: '#FBC02D', // Also use sub color
  simulated: '#3949AB',
  sufficient: '#28a745',
};

// CoverageRadarChart Component: Displays the coverage balance radar chart
// Updated props to match App.js
function CoverageRadarChart({
    indicatorsConfig,         // Config for radar axes (name, key)
    requiredData,             // Array of required levels (always 100)
    currentData,              // Array of current coverage levels (%)
    simulatedData,            // Array of simulated plan levels (%)
    originalRequiredCoverage, // Original required data object for tooltips
    originalCurrentCoverage,  // Original combined current data object for tooltips
    originalSimulatedPlanData,// Original simulated data object for tooltips
    customerProfile,          // For potential future use in tooltips
    onAxisLabelClick,         // Callback for axis label click
    premiumBreakdownText,     // Premium summary text from App.js
    mainGapText,              // Main gap text from App.js
    mainGapClass              // Main gap text class from App.js
}) {
  const chartRef = useRef(null);

  // --- Helper Functions for Tooltip Formatting --- 

  // Helper function to get qualitative level description
  const getLevelDescription = (percentage) => {
      if (percentage >= 95) return '充実レベル';
      if (percentage >= 65) return '標準レベル';
      if (percentage >= 30) return '基本レベル';
      return '要確認';
  }

  // Helper to format value for tooltip (Simplified based on user feedback)
  const formatTooltipValue = (indicatorKey, percentage, originalPlanData, originalRequiredData) => {
      // NOTE: This function is now ONLY called for non-medical indicators by the formatter
      let details = '-'; // Default to dash
      const getOrigValue = (data, key) => (data && typeof data[key] === 'number' ? data[key] : 0);

      switch (indicatorKey) {
          case 'death':
              const deathLump = getOrigValue(originalPlanData, 'deathLumpsum');
              const deathAnn = getOrigValue(originalPlanData, 'deathAnnuity');
              let deathDetails = [];
              if (deathLump > 0) deathDetails.push(`一時金: ${deathLump.toLocaleString()}万円`);
              if (deathAnn > 0) deathDetails.push(`月額: ${deathAnn.toLocaleString()}万円`);
              details = deathDetails.length > 0 ? deathDetails.join(', ') : '-';
              break;
          case 'disability':
              const disLump = getOrigValue(originalPlanData, 'disabilityLumpsum');
              const disMonth = getOrigValue(originalPlanData, 'disabilityMonthly');
              let disDetails = [];
              if (disLump > 0) disDetails.push(`一時金: ${disLump.toLocaleString()}万円`);
              if (disMonth > 0) disDetails.push(`月額: ${disMonth.toLocaleString()}万円`);
              details = disDetails.length > 0 ? disDetails.join(', ') : '-';
              break;
          case 'savings':
               const savingsValue = getOrigValue(originalPlanData, 'savingsMonthly');
               details = savingsValue > 0 ? `月額: ${savingsValue.toLocaleString()}円` : '-';
              break;
          case 'critical':
              const cancerLump = getOrigValue(originalPlanData, 'criticalCancer');
              const circLump = getOrigValue(originalPlanData, 'criticalCirculatory');
              let critDetails = [];
               if (cancerLump > 0) {
                  critDetails.push(`がん: ${cancerLump.toLocaleString()}万`);
               }
                if (circLump > 0) {
                   critDetails.push(`循環器等: ${circLump.toLocaleString()}万`);
                }
               details = critDetails.length > 0 ? critDetails.join(', ') : '-';
              break;
          default:
              details = '-'; // Keep default dash for unhandled keys
              break;
      }
      
      return details;
  }

  // Calculate radar option using percentages/levels
  const radarOption = useMemo(() => {
    // Remove or comment out the initial existence check, as App.js should provide defaults
    /* 
    if (!indicatorsConfig || !requiredData || !currentData || !simulatedData) {
       console.warn("Radar chart data missing!");
       return {};
    }
    */

    // --- Data Validation (ensure arrays are valid) --- 
    // Ensure indicatorsConfig exists before trying to map over it for fallbackData
    const validateDataArray = (arr) => Array.isArray(arr) && arr.every(num => typeof num === 'number' && !isNaN(num));
    const fallbackData = Array.isArray(indicatorsConfig) ? indicatorsConfig.map(() => 0) : []; // Default to 0 if validation fails or indicators missing

    // Validate requiredData, fallback to 100s array or empty if indicatorsConfig missing
    const validatedRequiredData = validateDataArray(requiredData) 
        ? requiredData 
        : (Array.isArray(indicatorsConfig) ? indicatorsConfig.map(() => 100) : []); 

    const validatedCurrentData = validateDataArray(currentData) ? currentData : fallbackData;
    const validatedSimulatedData = validateDataArray(simulatedData) ? simulatedData : fallbackData;
    
    // Added check: If indicatorsConfig itself is missing, we can't proceed.
    if (!Array.isArray(indicatorsConfig) || indicatorsConfig.length === 0) {
        console.warn("Radar chart cannot render: indicatorsConfig is missing or empty.");
        return {}; // Return empty config if indicators are missing
    }

    // Define series names consistently
    const seriesNames = {
      required: '必要保障レベル',
      current: '既契約充足度',
      simulated: '提案プラン充足度'
    };

    // Tooltip formatter function using the helper
    const formatter = (params) => {
      let tooltipText = `${params.seriesName}<br/>`;
      const dataValues = params.data.value; // Array of percentages/levels

      // Ensure indicatorsConfig is available for the loop
      if (Array.isArray(dataValues) && Array.isArray(indicatorsConfig) && dataValues.length === indicatorsConfig.length) {
          dataValues.forEach((val, index) => {
              const indicator = indicatorsConfig[index];
              if (!indicator) return;
              const name = indicator.name;
              let originalDataForTooltip;
              let requiredDataForTooltip = originalRequiredCoverage;

              // Select the correct original data based on the specific data item's name
              const dataItemName = params.data?.name; // Use the name from the data object
              const indicatorKey = indicator.key; // Get the indicator key

              if (dataItemName === seriesNames.simulated) { // '提案プラン充足度'
                 originalDataForTooltip = originalSimulatedPlanData;
              } else if (dataItemName === seriesNames.current) { // '既契約充足度'
                 originalDataForTooltip = originalCurrentCoverage;
              } else { // Required series ('必要保障レベル') or unknown
                 originalDataForTooltip = null; // Not needed for required line display
              }

              let valueText = '';
              if (dataItemName === seriesNames.required) { // Required line (Grey dashed)
                  // Display the specific target coverage amount based on the indicator key
                  switch (indicatorKey) {
                      case 'death':
                          valueText = '4,500万円'; // User specified target
                          break;
                      case 'disability':
                          valueText = '7,000万円'; // User specified target
                          break;
                      case 'medical':
                          // Display fixed list for required level
                          valueText = '入院日額, 入院一時金, 入院治療費補填, 退院後通院補填'; 
                          break;
                      case 'critical':
                           // Display fixed list for required level (updated)
                           valueText = 'がん: 150万円, 循環器等: 150万円';
                          break;
                      case 'savings':
                           valueText = '月額: 40,000円'; // User specified target
                          break;
                      default:
                           // Fallback for any unknown required indicator key (shouldn't happen)
                           const numericValDefault = typeof val === 'number' && !isNaN(val) ? val : 0;
                           valueText = `${numericValDefault}%`;
                          break;
                  }
              } else if (originalDataForTooltip) { // Current (Yellow) or Simulated (Blue) lines
                  const numericVal = typeof val === 'number' && !isNaN(val) ? val : 0;
                  
                  // If medical, format based on included benefits array
                  if (indicatorKey === 'medical') {
                      // Define display names for benefits
                      const benefitDisplayNames = {
                          daily: '入院日額',
                          lumpSum: '入院一時金',
                          treatment: '入院治療費補填',
                          postDischarge: '退院後通院補填',
                          advanced: '先進医療保障'
                      };
                      // Get included benefits, default to empty array
                      const included = Array.isArray(originalDataForTooltip.medicalBenefitsIncluded) 
                                         ? originalDataForTooltip.medicalBenefitsIncluded 
                                         : [];
                      if (included.length > 0) {
                           valueText = included.map(key => benefitDisplayNames[key] || key).join(', ');
                      } else {
                           valueText = '-'; // No specific benefits listed
                      }
                  } else {
                      // Use the standard formatting function for other indicators
                      valueText = formatTooltipValue(indicatorKey, numericVal, originalDataForTooltip, requiredDataForTooltip);
                  }
              } else {
                  // Fallback when originalDataForTooltip is missing for Yellow/Blue lines
                  const numericVal = typeof val === 'number' && !isNaN(val) ? val : 0; // Get the calculated percentage/level
                  valueText = `データ参照不可 (${numericVal}%)`; // Show percentage as fallback info
                  // Log an error to the console for debugging
                  // Use dataItemName in the error log if available
                  console.error(`Tooltip Error: Original data for series '${dataItemName || params.seriesName || 'Unknown'}' and indicator '${name}' is missing or check failed. Displaying fallback.`);
              }

              tooltipText += `${params.marker || '●'} ${name}: ${valueText}<br/>`;
          });
      } else {
        tooltipText += `データ表示エラー (Indicators: ${Array.isArray(indicatorsConfig)}, Values: ${Array.isArray(dataValues)}, Lengths: ${indicatorsConfig?.length} vs ${dataValues?.length})`;
      }
      return tooltipText;
    };

    return {
      tooltip: {
        trigger: 'item',
        formatter: formatter,
        confine: true, // Keep tooltip within chart area
        textStyle: { fontSize: 11 }
      },
      legend: {
        data: [seriesNames.required, seriesNames.current, seriesNames.simulated],
        bottom: 5,
        textStyle: {
          fontSize: 10,
          color: '#333'
        },
        itemWidth: 15,
        itemHeight: 10
      },
      radar: {
        indicator: indicatorsConfig.map(ind => ({ // Safe to map here due to earlier check
             name: ind.name,
             max: 100, // Max is always 100%
             // Remove axisLabel to hide percentages on axes
             // axisLabel: { show: true, formatter: '{value}%', fontSize: 9, color: '#666' } 
        })),
        shape: 'circle',
        splitNumber: 5, // 5 segments (0, 20, 40, 60, 80, 100)
        axisName: {
          color: '#444',
          fontSize: 11,
          formatter: (value) => `{axisName|${value}}`, // Use rich text for click handling
           rich: {
               axisName: { padding: [0, 0, 3, 0] } // Add padding below name
           }
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(250, 250, 250, 0.3)', 'rgba(235, 240, 250, 0.3)']
          }
        },
        axisLine: {
          lineStyle: { color: 'rgba(189, 189, 189, 0.8)' }
        },
        splitLine: {
          lineStyle: { color: 'rgba(200, 200, 200, 0.6)' }
        },
        center: ['50%', '50%'],
        radius: '70%'
      },
      series: [{
        name: '保障のバランス', // Overall series name (can be omitted)
        type: 'radar',
        // Reorder data array for desired Z-index: [bottom, middle, top] -> [required, simulated, current]
        data: [
          {
            value: validatedRequiredData,
            name: seriesNames.required, // Grey Dashed (Bottom layer)
            symbol: 'none',
            lineStyle: { color: colors.required, type: 'dashed', width: 1.5 },
            itemStyle: { color: colors.required },
            areaStyle: { color: 'rgba(180, 180, 180, 0.25)' }
          },
          {
            value: validatedSimulatedData,
            name: seriesNames.simulated, // Blue Solid (Middle layer)
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { color: colors.simulated, width: 2.5 },
            itemStyle: { color: colors.simulated },
            areaStyle: { color: 'rgba(57, 73, 171, 0.4)' }
          },
          {
            value: validatedCurrentData,
            name: seriesNames.current, // Yellow Solid (Top layer)
            symbol: 'diamond',
            symbolSize: 6,
            lineStyle: { color: colors.self, width: 2 }, // Using self color for current combined
            itemStyle: { color: colors.self },
            areaStyle: { color: 'rgba(251, 192, 45, 0.6)' } // Increased opacity slightly to 0.3
          }
        ]
      }]
    };
  // Update dependencies to include all relevant props used in useMemo
  }, [
      indicatorsConfig, 
      requiredData, 
      currentData, 
      simulatedData, 
      originalRequiredCoverage, 
      originalCurrentCoverage, 
      originalSimulatedPlanData, 
      // formatTooltipValue is defined inside, no need to list, but ensure its dependencies are stable if it were outside
  ]); 

  // --- Axis Label Click Handler --- 
  useEffect(() => {
      const chartInstance = chartRef.current?.getEchartsInstance();
      if (chartInstance && onAxisLabelClick) {
          const clickHandler = (params) => {
              if (params.componentType === 'radar' && params.componentSubType === 'axisName') {
                   // Ensure indicatorsConfig is available before finding
                   const clickedIndicator = Array.isArray(indicatorsConfig) 
                       ? indicatorsConfig.find(ind => ind.name === params.name) 
                       : null;
                   if (clickedIndicator) {
                       onAxisLabelClick(clickedIndicator);
                   }
              }
          };
          chartInstance.on('click', clickHandler);
          return () => {
              // Ensure instance exists before trying to remove listener
              if (chartInstance && !chartInstance.isDisposed()) {
                  chartInstance.off('click', clickHandler);
              }
          };
      }
  }, [indicatorsConfig, onAxisLabelClick, chartRef]); // Add chartRef to dependencies

  return (
    <div className="center-column module flex flex-col bg-white border border-gray-200 rounded-md p-4 shadow-sm">
      <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-800 pb-1 mb-1 text-center flex items-center justify-center">
        <i className="fas fa-compass mr-2 text-emerald-600"></i> {/* Changed icon */} 
        保障充足度バランス
      </h2>
      {/* Render the chart */}
      <div style={{ flexGrow: 1, minHeight: '350px', width: '100%' }}>
        <ReactECharts
          ref={chartRef}
          echarts={echarts}
          option={radarOption}
          notMerge={true}
          lazyUpdate={true}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
      {/* Premium Summary Section (Uses props from App.js) */}
      <div className="summary-section flex justify-around gap-4 mt-2 p-2 border-t border-gray-200">
        <div className="summary-card bg-gray-50 border border-gray-200 rounded p-2 text-center flex-1 min-w-[150px]">
          <h3>月額保険料</h3>
          <div id="simulated-premium-breakdown" dangerouslySetInnerHTML={{ __html: premiumBreakdownText || '<p>計算中...</p>' }}></div>
        </div>
      </div>
    </div>
  );
}

export default CoverageRadarChart;

