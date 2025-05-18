// src/constants/customerData.js

export const initialCustomerData = {
    profile: { name: "明治 太郎", age: 40, family: "配偶者, 子2人(10歳男, 8歳女)", lastUpdate: "2025/04/22", address: "埼玉県川越市1-1-1", tags: ["#40代", "#子育て中(10歳, 8歳)", "#持ち家検討中", "#自動車保有", "#都心済み", "#趣味:キャンプ", "#家族の生活重視", "#保険料とのバランス"] }, // addressを追加
    currentCoverageSelf: { deathLumpsum: 0, deathAnnuity: 0, disabilityLumpsum: 0, disabilityMonthly: 0, medicalDaily: 0, medicalSurgery: 0, criticalCancer: 0, criticalCirculatory: 0, savingsMonthly: 5000, premium: 5000 },
    currentCoverageOther: { deathLumpsum: 1000, deathAnnuity: 0, disabilityLumpsum: 0, disabilityMonthly: 0, medicalDaily: 4000, medicalSurgery: 0, criticalCancer: 100, criticalCirculatory: 0, savingsMonthly: 0, premium: 4320 },
    // indicatorsConfig と requiredCoverage は radarConfig.js へ移動予定
    // timelineEvents は timelineEvents.js へ移動予定
    // profileEditorHtml などは aiContent.js へ移動予定
    initialSimulationData: { // スライダーの初期値 (推奨プランに合わせる)
      deathLumpsum: 500, deathAnnuity: 10, disabilityLumpsum: 1000, disabilityMonthly: 20,
      medicalDaily: 4000, medicalSurgery: 0, criticalCancer: 100, criticalCirculatory: 100, // ★ 推奨プランに合わせて修正
      savingsMonthly: 35000,
      medicalBenefitsIncluded: ['daily', 'treatment', 'postDischarge']
    },
    recommendedPlanData: {
      name: "推奨プラン",
      description: "これまでのご要望に基づき、死亡・就業不能・学資準備をバランス良くカバーできるプランです。",
      deathLumpsum: 500, deathAnnuity: 10, disabilityLumpsum: 1000, disabilityMonthly: 20,
      medicalDaily: 4000, medicalSurgery: 0, criticalCancer: 100, criticalCirculatory: 100, // ★ 重病保障を100ずつに修正
      savingsMonthly: 35000, totalPremium: 48000, protectionPremium: 16500, savingsPremium: 31500,
      benefitKeywords: ["best_style", "balanced_plan", "education_fund", "core_protection"],
      medicalBenefitsIncluded: ['daily', 'treatment', 'postDischarge']
    },
    planAData: { // プレミアプラン
      name: "プレミアプラン",
      description: "推奨プランをベースに、医療保障と重い病気への備えをさらに手厚くした安心重視プランです。",
      deathLumpsum: 1000, deathAnnuity: 10, disabilityLumpsum: 1000, disabilityMonthly: 20, // ★ 就業不能一時金を1000に修正
      medicalDaily: 8000, medicalSurgery: 10, criticalCancer: 150, criticalCirculatory: 150, // ★ 重病保障を150ずつに修正
      savingsMonthly: 35000,
      totalPremium: 55000, protectionPremium: 23500, savingsPremium: 31500, // Premium recalculation might be needed, kept same for now
      benefitKeywords: ["premium_care", "strong_medical", "strong_critical", "education_fund", "strong_protection"],
      medicalBenefitsIncluded: ['daily', 'lumpSum', 'treatment', 'postDischarge']
    },
    planB_MedicalFocusData: { // 抑えめプラン (医療・重病フォーカス)
      name: "医療重視プラン",
      description: "推奨プランをベースに、死亡・就業不能保障を抑え、医療と重病への備えを重視したプランです。",
      deathLumpsum: 300, deathAnnuity: 7, disabilityLumpsum: 500, disabilityMonthly: 15, // ★ 死亡年金を 7 に修正
      medicalDaily: 4000, medicalSurgery: 0, criticalCancer: 100, criticalCirculatory: 100,
      savingsMonthly: 35000,
      totalPremium: 42000, protectionPremium: 10500, savingsPremium: 31500,
      benefitKeywords: ["cost_conscious", "focused_medical_critical", "basic_death_disability", "education_fund"],
      medicalBenefitsIncluded: ['daily', 'treatment', 'postDischarge']
    },
    planC_DeathFocusData: { // 抑えめプラン (死亡・就業不能フォーカス)
      name: "生活保障重視プラン",
      description: "推奨プランをベースに、医療と重い病気への備えを基本レベルに抑え、万一の生活保障を重視したプランです。",
      deathLumpsum: 500, deathAnnuity: 10, disabilityLumpsum: 1000, disabilityMonthly: 20,
      medicalDaily: 3000, medicalSurgery: 0, criticalCancer: 100, criticalCirculatory: 0, // ★ がん100, 循環器0に修正
      savingsMonthly: 35000,
      totalPremium: 43000, protectionPremium: 11500, savingsPremium: 31500,
      benefitKeywords: ["cost_conscious", "focused_death_disability", "basic_medical_critical", "education_fund"],
      medicalBenefitsIncluded: ['daily']
    },
    plyData: {
      // Attributes used for matching (example)
      matchedAttributes: ["40代", "小学生のお子様あり", "持ち家検討中"],
      // Summary of trends and thinking points - Reworked Structure
      summary: [
        {
          category: "死亡保障",
          icon: "fa-solid fa-umbrella",
          sections: [
            // Order changed: 1. Pension, 2. Term Lump Sum, 3. Whole Life Lump Sum
            {
              title: "年金／月額（遺族の生活費）",
              icon: "fa-solid fa-calendar-days",
              visualizationType: 'amount', // Focus on amount
              joinRate: 60, // Keep rate data for potential text display
              averageValue: { amount: 10, unit: '万円/月' }, // Structured amount
              commonMethod: "年金形式の保険",
              thinkingPoint: "遺族年金だけでは不足する生活費を補填するため、家計の収支に基づき過不足なく設定するのが理想です。",
              valueLevelText: "必要額は個人差大", // Qualitative level
            },
            {
              title: "一時金（生活再建・教育資金）",
              icon: "fa-solid fa-house-chimney-window",
              visualizationType: 'amount', // Focus on amount
              joinRate: 75,
              averageValue: { amount: 800, unit: '万円' }, // Adjusted amount
              commonMethod: "定期保険",
              thinkingPoint: "お子様の独立までなど、特に大きな保障が必要な期間に対して、定期保険で準備する考え方が主流です。",
              valueLevelText: "一般的",
            },
            {
              title: "一時金（葬儀・整理資金）",
              icon: "fa-solid fa-cash-register",
              visualizationType: 'amount', // Focus on amount
              joinRate: 90,
              averageValue: { amount: 200, unit: '万円' }, // Adjusted amount
              commonMethod: "終身保険",
              thinkingPoint: "万一の際に必ず必要となる費用を、多くの方が一生涯保障の終身保険で準備しています。",
              valueLevelText: "やや少なめ", // Example level
            },
          ],
        },
        {
          category: "医療保障",
          icon: "fa-solid fa-briefcase-medical",
          sections: [
            {
              title: "入院・手術",
              icon: "fa-solid fa-bed-pulse",
              visualizationType: 'rate', // Focus on rate
              joinRate: 90,
              averageValue: { amount: 7000, unit: '円/日 (目安)' }, // Keep amount for context
              commonMethod: "医療保険, 特約",
              thinkingPoint: "治療費以外の諸費用（差額ベッド代等）や短期入院・外来手術への備え。公的保障でカバーされる範囲も確認し、必要な分だけ上乗せする考え方が基本です。",
            },
            // Removed 手術一時金 as separate entry, combined conceptually
          ],
        },
        {
          category: "学資・貯蓄",
          icon: "fa-solid fa-piggy-bank",
          sections: [
            {
              title: "月額積立",
              icon: "fa-solid fa-graduation-cap",
              visualizationType: 'both', // Show both rate and amount
              joinRate: 75,
              averageValue: { amount: 2, unit: '万円/月' }, // Simplified unit
              commonMethod: "学資保険, NISA等",
              thinkingPoint: "教育費の目標額や時期に合わせて、保険の保障機能やNISA等の運用性を比較し、ご家庭に合う方法で計画的に準備するのがおすすめです。",
            },
          ],
        },
        // Add other categories like 就業不能 in similar structure
      ],
      // Voices from similar people (example - structure remains similar)
      voices: [
        {
          quote: "万一の時、子供が大学卒業するまでの生活費が一番心配でした。",
          reason: "担当者と試算して、必要額から死亡保険（定期・年金）をピッタリ提案してもらい安心できたため。",
          age: 42,
          family: "配偶者・子2人(中学生、小学生)",
          icon: "fa-solid fa-comment-dots",
        },
        {
          quote: "私立大学の進学を考えると教育費が想像以上で…。計画的に貯められる学資保険に入りました。",
          reason: "一番心配である子供の教育費を、進学時期に合わせて受け取れるのが魅力であったため。",
          age: 39,
          family: "配偶者・子1人(小学生)",
          icon: "fa-regular fa-comment",
        },
      ],
      guidance: "これらの傾向や考え方を参考に、太郎様ご自身の優先順位や予算と照らし合わせながら、プラン内容を比較検討してみてくださいね。",
      // Removed obsolete fields like trends, text, recommendations etc.
    },
    futureSuggestionText: "現在はお子様中心の保障ですが、10～15年後などライフステージが変わる際は見直しが必要です。死亡保障等を減らし、医療・老後資金準備を強化する方向性が一般的です。",
  };